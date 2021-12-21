import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Observable, switchMap } from "rxjs";
import { AuthService } from "src/app/core/auth/auth.service";
import { CalendarService } from "src/app/pages/calendar/calendar.service";
import { Appointment } from "src/app/models/appointment.model";
import { User } from "src/app/models/user.model";
import Swal from "sweetalert2";

@Component({
	selector: "app-homepage",
	templateUrl: "./homepage.component.html",
	styleUrls: [ "./homepage.component.css" ]
})
export class HomepageComponent implements OnInit
{
	getDatetime = new Date();
	loggedInUser$!: Observable<User>;
	appointments$!: Observable<Appointment[]>

	constructor
	(
		private appointmentService: CalendarService,
		private authService: AuthService
	)
	{ }

	ngOnInit(): void
	{
		this.loggedInUser$ = this.authService.currentUser$
		this.appointments$ = this.appointmentService.list()
	}

	goToAppointment()
	{
		Swal.fire({ title: "dit wordt een component" })
	}
}
