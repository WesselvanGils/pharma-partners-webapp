import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { flatMap, map, mergeMap, mergeMapTo, Observable, Subject, Subscriber, Subscription, switchMap } from 'rxjs';
import { Meeting } from 'src/app/models/meeting.model';
import { LoggingService } from 'src/app/shared/logging.service';
import Swal from 'sweetalert2';
import { CalendarService } from './calendar.service';

@Component({
	selector: 'app-calendar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit
{
	view: CalendarView = CalendarView.Week
	viewDate: Date = new Date()
	events: CalendarEvent[] = []
	refresh: Subject<any> = new Subject<any>()

	constructor(private calendarService: CalendarService) { }

	ngOnInit(): void 
	{
		this.calendarService.list().subscribe( (result) =>
		{
			result.forEach(item =>
			{
				this.events = [...this.events, 
					{
						title: item.meeting.title, 
						start: new Date(item.meeting.start), 
						end: new Date(item.meeting.end)
					}
				]
			})
			this.refresh.next("refresh")
		})
	}

	eventClicked({ event }: { event: CalendarEvent }): void
	{
		Swal.fire(`${event.title}`)
	}
}
