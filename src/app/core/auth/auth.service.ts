import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, Subscription, timer } from 'rxjs';
import { User } from 'src/app/models/user.model';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { map, catchError, flatMap } from 'rxjs/operators';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService
{
	public currentUser$ = new BehaviorSubject<User>(undefined);
	private readonly CURRENT_USER = 'currentuser';
	private readonly headers = new HttpHeaders({
		'Content-Type': 'application/json',
	});

	private redirectUrl: string;

	constructor
		(
			private alertService: AlertService,
			private http: HttpClient,
			private router: Router,
			@Inject(PLATFORM_ID) private platformId: any,
			@Optional() @Inject(Request) private request: any
		)
	{

		

		// Initializes the authentication service with the user from
		// the local storage making it so users stays logged in. 
		this.getUserFromLocalStorage()
			.subscribe((userFromLocalStorage) =>
			{
				if (userFromLocalStorage != undefined)
				{
					this.validateToken(userFromLocalStorage).subscribe((result) => 
					{
						if (result != undefined)
						{
							console.log(`User with email:${result.email} was logged in automatically`)
							this.currentUser$.next(result)
							this.router.navigate(["/homepage"])
							return result
						}else
						{
							console.log(`User ${userFromLocalStorage.email}'s token wasn't valid`)
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

	public setRedirectUrl(url: string) {
		this.redirectUrl = url;
	  }


	  public auth(login: string, password: string): Observable<any> {
		return this.http.post<any>('/auth/login', {login: login, password: password}).pipe(
		  flatMap(response => this.secondFactor(response.token) )
		);
	  }
	// Sends a login request to the backend api taking the email and password as input
	// Saves the user to local storage if the login is successfull
	// Returns an error if the login was unsuccessfull or an error occured at the api
	login(email: string, password: string): Observable<User>
	{
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
					console.log(`User with email: ${email} successfully logged in`)

					const userToSave: User = response.employee
					userToSave.token = response.token
					userToSave.authToken = this.secondFactor(response.authToken);

					console.log(userToSave.authToken);
					this.saveUserToLocalStorage(userToSave);
					this.currentUser$.next(userToSave)
					this.alertService.success('You have been signed in');
					return userToSave;
				}),
				catchError((error: any) =>
				{
					// Executes if the login was rejected by the api or if an error occured
					console.log(`Log in attempt with email: ${email} failed`)

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
			this.router
				.navigate([ 'login' ])
				.then((success) =>
				{
					// true when canDeactivate allows us to leave the page.
					if (success)
					{
						console.log(`User with email:${user.email} was successfully logged out.`)
						localStorage.removeItem(this.CURRENT_USER);
						this.currentUser$.next(undefined)
						this.alertService.success('You have been logged out.');
					} else
					{
						console.log(`User with email:${user.email} couldn't be logged out.`)
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

		return this.http.get<any>(url, httpOptions).pipe(
			map((response) =>
			{
				console.log(`token of user with email:${userData.email} was validated`)
				const responseUser: User = response.employee
				responseUser.token = response.token
				return responseUser;
			}),
			catchError((error: any) =>
			{
				console.log(`token of user with email:${userData.email} could not validated`)
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


	private secondFactor(authToken: string): Observable<any> {
		const httpOptions = {
			headers: new HttpHeaders({'AuthToken': authToken, 'Content-Type': 'application/json'})
		};

		const tick: Observable<number> = timer(1000, 1000);
		return Observable.create(subject => {
			const url = `${environment.apiUrl}authentication/status`;
			let tock = 0;
			const timerSubscription = tick.subscribe(() => {
				tock++;
				this.http.get<any>(url, httpOptions).subscribe( response => {
					if(response.status === 'approved'){
						console.log('Twilio approved');
						this.redirectUrl = this.redirectUrl === undefined ? '/' : this.redirectUrl;
						this.router.navigate([this.redirectUrl]);
						this.closeSecondFactorObservables(subject, true, timerSubscription);
					} else if(response.status === 'denied'){
						console.log('Twilio denied')
						this.closeSecondFactorObservables(subject, false, timerSubscription);
					}
				})
				if(tock === 60){
					this.closeSecondFactorObservables(subject, false, timerSubscription);
				}
			})
		})

	}

	public isAuthenticated(): Observable<boolean> {
		if(isPlatformServer(this.platformId)){
			return of(this.request.cookies.authentication === 'super-encrypted-value-indicating-that-user-is-authenticated!');
		}
		return this.http.get<any>(`${environment.apiUrl}authentication/isLogged`).pipe(map(response => response.authenticated));
	}

	private closeSecondFactorObservables(subject: Subject<any>, result: boolean, timerSubscription: Subscription): void {
		subject.next(result);
		subject.complete();
		timerSubscription.unsubscribe();
	}
}
