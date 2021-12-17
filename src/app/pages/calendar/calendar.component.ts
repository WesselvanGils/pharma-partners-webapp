import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CalendarEvent, CalendarView } from 'angular-calendar';
import Swal from 'sweetalert2';
import { colors } from './calendar-header/colors';

@Component({
	selector: 'app-calendar',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './calendar.component.html',
})
export class CalendarComponent
{
	view: CalendarView = CalendarView.Week;

	viewDate: Date = new Date();

	events: CalendarEvent[] = [
		{
			title: 'Click me',
			color: colors.yellow,
			start: new Date(),
		},
		{
			title: 'Or click me',
			color: colors.blue,
			start: new Date(),
		},
	]

	eventClicked({ event }: { event: CalendarEvent }): void
	{
		Swal.fire(`${event.title}`)
	}
}
