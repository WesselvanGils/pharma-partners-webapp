import { Component, OnInit } from "@angular/core"
import { FormGroup, FormControl, Validators } from "@angular/forms"
import { Router } from "@angular/router"
import { BehaviorSubject, map, Observable, Subscription } from "rxjs"
import { User } from "src/app/models/user.model"
import { AuthService } from "../auth.service"

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: [ "./login.component.css" ]
})
export class LoginComponent implements OnInit
{
	loginForm: FormGroup
	subs: Observable<User>
	submitted = false

	constructor(private authService: AuthService, private router: Router) { }

	ngOnInit(): void
	{
		this.loginForm = new FormGroup({
			email: new FormControl(null, [
				Validators.required,
				this.validEmail.bind(this)
			]),
			password: new FormControl(null, [
				Validators.required,
				this.validPassword.bind(this)
			])
		})

		this.authService.currentUser$.subscribe( (result) =>
		{
			if (result)
			{
				console.log("already logged in, rerouting to home")
				this.router.navigate(["/home"])
			}
		})
	}

	onSubmit(): void
	{
		if (this.loginForm.valid)
		{
			this.submitted = true
			const email = this.loginForm.value.email
			const password = this.loginForm.value.password
			this.authService
				.login(email, password)
				.subscribe(user =>
				{
					this.submitted = false
				})
		} else
		{
			this.submitted = false
			console.error("loginForm invalid")
		}
	}

	validEmail(control: FormControl): { [ s: string ]: boolean }
	{
		const email = control.value
		const regexp = new RegExp(
			"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$"
		)
		if (regexp.test(email) !== true)
		{
			return { email: false }
		} else
		{
			return null
		}
	}

	validPassword(control: FormControl): { [ s: string ]: boolean }
	{
		const password = control.value
		const regexp = new RegExp("^[a-zA-Z]([a-zA-Z0-9]){2,14}")
		const test = regexp.test(password)
		if (regexp.test(password) !== true)
		{
			return { password: false }
		} else
		{
			return null
		}
	}
}
