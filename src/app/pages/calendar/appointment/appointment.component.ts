import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Observable } from 'rxjs';
import { Appointment } from 'src/app/models/appointment.model';

@Component({
	selector: 'app-appointment',
	templateUrl: './appointment.component.html',
	styleUrls: [ './appointment.component.css' ]
})

export class AppointmentComponent implements OnInit
{
	@Input() focusedMeeting: Observable<Appointment>
	constructor() { }
	
	ngOnInit(): void 
	{

	}
}
