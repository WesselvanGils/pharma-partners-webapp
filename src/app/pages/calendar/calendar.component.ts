import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Observable } from 'rxjs';
import { Meeting } from 'src/app/models/meeting.model';
import Swal from 'sweetalert2';
import { colors } from './calendar-header/colors';
import { CalendarService } from './calendar.service';

@Component({
	selector: 'app-calendar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit
{
	view: CalendarView = CalendarView.Week;
	viewDate: Date = new Date();
	events: CalendarEvent[] = []

	constructor (private calendarService: CalendarService) {}

	ngOnInit(): void 
	{
		this.calendarService.getAllMeetings().forEach(meeting => 
		{
			this.events.push(meeting.calendarEvent)	
		})
	}

	eventClicked({ event }: { event: CalendarEvent }): void
	{
		Swal.fire(`${event.title}`)
	}
}
