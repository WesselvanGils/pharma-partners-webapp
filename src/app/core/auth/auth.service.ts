import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map, catchError, switchMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoggingService } from 'src/app/shared/logging.service';

@Injectable({ providedIn: 'root' })
export class AuthService
{
	public currentUser$ = new BehaviorSubject<User>(undefined);
	private readonly CURRENT_USER = 'currentuser';
	private readonly headers = new HttpHeaders({
		'Content-Type': 'application/json',
	});

	constructor
		(
			private alertService: AlertService,
			private http: HttpClient,
			private router: Router,
			private loggingService: LoggingService
		)
	{
		// Initializes the authentication service with the user from
		// the local storage making it so users stays logged in. 
		this.getUserFromLocalStorage()
			.subscribe((userFromLocalStorage) =>
			{
				if (userFromLocalStorage != undefined)
				{
					loggingService.log(`Attempting to login ${userFromLocalStorage.email} automatically`)
					this.validateToken(userFromLocalStorage).subscribe((result) => 
					{
						if (result != undefined)
						{
							this.loggingService.log(`User with email:${result.email} was logged in automatically`)
							this.currentUser$.next(result)
							this.router.navigate(["/homepage"])
							return result
						}else
						{
							this.loggingService.log(`User ${userFromLocalStorage.email}'s token wasn't valid`)
							return undefined
						}
					})
				} else
				{
					console.log(`No user in the local storage`)
				}
			}
		)
	}

	// Sends a login request to the backend api taking the email and password as input
	// Saves the user to local storage if the login is successfull
	// Returns an error if the login was unsuccessfull or an error occured at the api
	login(email: string, password: string): Observable<User>
	{
		this.loggingService.log(`Sign in at ${environment.apiUrl}authentication/login with email ${email}`)

		return this.http
			.post<User>(
				`${environment.apiUrl}authentication/login`,
				{ email: email, password: password },
				{ headers: this.headers }
			)
			.pipe(
				map((response: any) =>
				{
					// Executes if the login is approved by the api
					this.loggingService.log(`User with email: ${email} successfully logged in`)

					const userToSave: User = response.employee
					userToSave.token = response.token

					this.saveUserToLocalStorage(userToSave);
					this.currentUser$.next(userToSave)
					this.alertService.success('You have been signed in');
					return userToSave;
				}),
				catchError((error: any) =>
				{
					// Executes if the login was rejected by the api or if an error occured
					this.loggingService.log(`Log in attempt with email: ${email} failed`)

					console.log('error:', error);
					console.log('error.message:', error.message);
					console.log('error.error.message:', error.error.message);
					this.alertService.error(error.error.message || error.message);
					return of(undefined);
				})
			);
	}

	// Removes the user from the local storage.
	// As a result the user is logged out. 
	logout(): void
	{
		this.getUserFromLocalStorage().subscribe(user => 
		{
			this.loggingService.log(`User with email: ${user.email} attempted to log out.`)

			this.router
				.navigate([ 'login' ])
				.then((success) =>
				{
					// true when canDeactivate allows us to leave the page.
					if (success)
					{
						this.loggingService.log(`User with email:${user.email} was successfully logged out.`)
						localStorage.removeItem(this.CURRENT_USER);
						this.currentUser$.next(undefined)
						this.alertService.success('You have been logged out.');
					} else
					{
						this.loggingService.log(`User with email:${user.email} couldn't be logged out.`)
					}
				})
				.catch((error) => console.log(`An error occured! ${error}`));
		})
	}

	// Validates a users token
	validateToken(userData: User): Observable<User>
	{
		const url = `${environment.apiUrl}authentication/validate/${userData._id}`;
		const httpOptions = {
			headers: new HttpHeaders({
				'Content-Type': 'application/json',
				Authorization: 'Bearer ' + userData.token,
			}),
		};

		this.loggingService.log(`Attempting to validate token of user with email:${userData.email}`)
		return this.http.get<any>(url, httpOptions).pipe(
			map((response) =>
			{
				this.loggingService.log(`token of user with email:${userData.email} was validated`)
				const responseUser: User = response.employee
				responseUser.token = response.token
				return responseUser;
			}),
			catchError((error: any) =>
			{
				this.loggingService.log(`token of user with email:${userData.email} could not validated`)
				this.logout();
				this.currentUser$.next(undefined)
				return of(undefined);
			})
		);
	}

	getUserFromLocalStorage(): Observable<User>
	{
		const localUser = JSON.parse(localStorage.getItem(this.CURRENT_USER));
		return of(localUser);
	}

	private saveUserToLocalStorage(user: User): void
	{
		localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
	}
}
