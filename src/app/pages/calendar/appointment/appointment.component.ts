import { Component, Input, OnInit } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';

@Component({
	selector: 'app-appointment',
	templateUrl: './appointment.component.html',
	styleUrls: [ './appointment.component.css' ]
})

export class AppointmentComponent implements OnInit
{
	@Input() focusedMeeting: CalendarEvent
	constructor() { }

	ngOnInit(): void 
	{

	}
}
