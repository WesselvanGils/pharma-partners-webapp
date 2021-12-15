import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CalendarOptions } from "@fullcalendar/angular"

@Component({
	selector: 'app-calendar',
	templateUrl: './calendar.component.html',
	styleUrls: [ './calendar.component.css' ]
})
export class CalendarComponent implements OnInit
{
	Events = [
		{
			title: "Event Name",
			start: "2021-12-15T10:30:00",
			end: "2021-12-15T11:30:00",
			description: "Lecture"
		}
	];
	calendarOptions: CalendarOptions;

	constructor() { }

	ngOnInit()
	{
		this.calendarOptions = {
			initialView: 'dayGridWeek',
			dateClick: this.onDateClick.bind(this),
			events: this.Events
		}
	}

	onDateClick(res)
	{
		// alert('Clicked on date : ' + res.dateStr)
	}
}