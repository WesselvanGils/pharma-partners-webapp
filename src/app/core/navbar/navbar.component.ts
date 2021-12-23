import { Component, Input, OnInit } from "@angular/core"
import { BehaviorSubject, Observable } from "rxjs"
import { User } from "src/app/models/user.model"
import { AuthService } from "../auth/auth.service"

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit 
{
	isNavbarCollapsed = true
	loggedInUser: Observable<User>
	
	@Input() title: string = ""
	constructor(private authService: AuthService) {}

	ngOnInit(): void 
	{
		this.loggedInUser = this.authService.currentUser$
	}

	logUserOut ()
	{
		this.authService.logout()
	}
}
