import { Component, OnDestroy, OnInit } from "@angular/core"
import { ActivatedRoute, ParamMap, Router } from "@angular/router";
import { Observable, of, switchMap } from "rxjs";
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
	loggedInUser$: Observable<User>;
	appointments$: Observable<Appointment[]>

	constructor
	(
		private appointmentService: CalendarService,
		private authService: AuthService
	)
	{ }

	ngOnInit(): void
	{
		this.loggedInUser$ = this.authService.currentUser$
		this.appointmentService.list(this.authService.currentUser$.value._id).subscribe(result =>
		{
			let appointmentList: Appointment[] = []
			result.forEach( (appointment: Appointment) =>
			{
				if (new Date(`${appointment.meeting.start}`).getDay() == new Date().getDay())
				{
					appointmentList.push(appointment)
				}
			})
			this.appointments$ = of(appointmentList)
		})
	}

	goToAppointment()
	{
		Swal.fire({ title: "dit wordt een component" })
	}
}
