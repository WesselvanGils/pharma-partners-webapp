import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from "@fullcalendar/angular"
import { Meeting } from 'src/app/models/meeting.model';
import Swal from 'sweetalert2';
import { CalendarService } from './calendar.service';

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: [ './calendar.component.css' ]
})
export class CalendarComponent implements OnInit
{
	Events;
	calendarOptions: CalendarOptions;

	constructor(private calendarService: CalendarService) { }

	ngOnInit()
	{
		this.calendarService.list().subscribe((result) =>
			this.convertDates(result, (formattedDates: any[]) => 
			{
				this.Events = formattedDates
				this.calendarOptions = {
					initialView: 'dayGridWeek',
					eventClick: this.handleEventClick.bind(this),
					events: this.Events
				}
			})
		)

		this.calendarOptions = {
			initialView: 'dayGridWeek',
			events: this.Events
		}
	}

	handleEventClick( arg ) 
	{
		Swal.fire("Hello world!");	
	}

	convertDates(input: Meeting[], callback)
	{

		let result = []

		input.forEach(meeting => 
		{
			result.push({
				start: meeting.startDate,
				end: meeting.endDate,
				title: `${meeting.patient.firstname} ${meeting.subject}`,
			})
		})

		callback(result)
	}
}