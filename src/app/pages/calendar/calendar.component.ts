import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from "@fullcalendar/angular"
import { Observable, of } from 'rxjs';
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
	events;
	calendarOptions: CalendarOptions;
	activeMeeting$: Observable<Meeting>

	constructor(private calendarService: CalendarService) { }

	ngOnInit()
	{
		this.calendarService.list().subscribe((result) =>
			this.convertDates(result, (formattedDates) => 
			{
				this.events = formattedDates
				this.calendarOptions = {
					initialView: 'dayGridWeek',
					eventClick: this.handleEventClick.bind(this),
					events: this.events
				}
			})
		)

		this.calendarOptions = {
			initialView: 'dayGridWeek',
			events: this.events
		}
	}

	handleEventClick( arg ) 
	{
		Swal.fire(arg.event._def);	
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