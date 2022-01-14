import { Component, ChangeDetectionStrategy, OnInit, OnDestroy } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import { Observable, of, Subject } from 'rxjs';
import { Appointment } from '../../models/appointment.model';
import Swal from 'sweetalert2';
import { CalendarService } from './calendar.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-calendar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit, OnDestroy
{
	view: CalendarView = CalendarView.Week
	viewDate: Date = new Date()
	events: CalendarEvent[] = []
	refresh: Subject<any> = new Subject<any>()
	focusedMeeting: Observable<Appointment>

	constructor(private calendarService: CalendarService, private authService: AuthService) { }

	ngOnInit(): void 
	{
		this.calendarService.list(this.authService.currentUser$.value._id).subscribe( (result) =>
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

		this.calendarService.currentAppointment.subscribe(result => 
		{
			if (result)
			{
				let calendar = document.getElementById('calendarColumns')
				calendar.className = 'card col-sm-12 col-md-7 col-lg-7 p-0'
				this.focusedMeeting = of(result)
			}
		})
	}

	eventClicked({ event }: { event: CalendarEvent }): void {
		let calendar = document.getElementById('calendarColumns')
		calendar.className = 'card col-sm-12 col-md-7 col-lg-7 p-0'
		this.calendarService.read(event.id).pipe((data) => this.focusedMeeting = data)
	}

	backToCalendar()
	{
		let calendar = document.getElementById('calendarColumns')
		calendar.className = 'card col-sm-12 col-md-12 col-lg-12 p-0'
		this.focusedMeeting = undefined
	}

	onUpdateTrigger(appointmentToUpdate: Appointment)
	{
		const eventToInsert: CalendarEvent = 
		{
			id: appointmentToUpdate._id,
			title: appointmentToUpdate.meeting.title,
			start: new Date(appointmentToUpdate.meeting.start),
			end: new Date(appointmentToUpdate.meeting.end)
		}
		const location = this.events.findIndex(item => item.id == appointmentToUpdate._id)
		this.events[location] = eventToInsert
		this.refresh.next("refresh")
		let calendar = document.getElementById('calendarColumns')
		calendar.className = 'card col-sm-12 col-md-12 col-lg-12 p-0'
		this.focusedMeeting = undefined
	}

	onDeleteTrigger(deletedAppointmentId: string)
	{
		this.events.forEach((element, index) =>
		{
			if (element.id == deletedAppointmentId)
				this.events.splice(index, 1)
		})

		this.refresh.next("refresh")
		let calendar = document.getElementById('calendarColumns')
		calendar.className = 'card col-sm-12 col-md-12 col-lg-12 p-0'
		this.focusedMeeting = undefined
	}

	ngOnDestroy(): void 
	{
		this.focusedMeeting = undefined
		this.calendarService.changeAppointment(undefined)	
	}
}
