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
		private calendarService: CalendarService,
		private authService: AuthService,
		private router: Router
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
				let dateToCompare = new Date(`${appointment.meeting.start}`)
				let today = new Date()
				if (dateToCompare.getDate() == today.getDate() && 
					dateToCompare.getMonth() == today.getMonth() &&
					dateToCompare.getFullYear() == today.getFullYear())
				{
					appointmentList.push(appointment)
				}
			})
			this.appointments$ = of(appointmentList)
		})
	}

	goToAppointment(appointment: Appointment)
	{
		this.router.navigate(['/calendar'])
		this.calendarService.changeAppointment(appointment)
	}
}
