import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Observable, Subject } from 'rxjs';
import { Appointment } from '../../models/appointment.model';
import Swal from 'sweetalert2';
import { CalendarService } from './calendar.service';
import { Router } from '@angular/router';

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
	focusedMeeting: Observable<Appointment>

	constructor(private calendarService: CalendarService, private router: Router) { }

	ngOnInit(): void 
	{
		this.calendarService.list().subscribe( (result) =>
		{
			result.forEach( (item: Appointment) =>
			{
				this.events = [...this.events, 
					{
						id: item._id,
						title: item.meeting.title, 
						start: new Date(item.meeting.start), 
						end: new Date(item.meeting.end),
					}
				]
			})
			this.refresh.next("refresh")
		})
	}

	eventClicked({ event }: { event: CalendarEvent }): void {
		let calendar = document.getElementById('calendarColumns')
		calendar.className = 'card col-sm-12 col-md-7 col-lg-7 p-0'
		this.calendarService.read(event.id).pipe((data) => this.focusedMeeting = data)
	}

	backToCalendar(){
		let calendar = document.getElementById('calendarColumns')
		calendar.className = 'card col-sm-12 col-md-12 col-lg-12 p-0'
		this.focusedMeeting = undefined
	}
}
