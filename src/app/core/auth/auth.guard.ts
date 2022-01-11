import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from 'src/app/models/user.model';
import { AuthService } from './auth.service';

// Verifies that user is logged in before navigating to routes.
@Injectable(
	{
		providedIn: "root"
	}
)
export class LoggedInAuthGuard implements CanActivate, CanActivateChild
{
	constructor(private authService: AuthService, private router: Router) { }

	canActivate(): Observable<boolean>
	{
		return this.authService.currentUser$.pipe(
			map((user: User) =>
			{
				if (user && user.token && user.authToken)
				{
					return true;
				} else
				{
					console.log('not logged in, rerouting to /login');
					this.authService.setRedirectUrl(this.router.url);
					this.router.navigate([ '/login' ]);
					return false;
				}
			})
		);
	}

	canActivateChild(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean> | Promise<boolean> | boolean
	{
		console.log('canActivateChild LoggedIn');
		return this.canActivate();
	}
}