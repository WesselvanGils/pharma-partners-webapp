import { Component, Input, OnInit } from "@angular/core"
import { AuthService } from "../auth/auth.service"

@Component({
	selector: "app-navbar",
	templateUrl: "./navbar.component.html",
	styleUrls: ["./navbar.component.css"]
})
export class NavbarComponent implements OnInit 
{
	isNavbarCollapsed = true
	
	@Input() title: string = ""
	constructor(private authService: AuthService) {}

	ngOnInit(): void {}

	logUserOut ()
	{
		this.authService.logout()
	}
}
