import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CalendarView } from 'angular-calendar';

@Component({
	selector: 'app-calendar-header',
	template: `
    <div class="row mb-3">
      <div class="col-sm-12 col-md-4 col-lg-4">
        <div class="btn-group" id="buttonGroup">
          <div
            class="btn btn-primary btn-sm"
            mwlCalendarPreviousView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)">
           <i class="fas fa-angle-left"></i>
          </div>
          <div
            class="btn btn-outline-primary btn-sm"
            mwlCalendarToday
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)">
            Today
          </div>
          <div
            class="btn btn-primary btn-sm"
            mwlCalendarNextView
            [view]="view"
            [(viewDate)]="viewDate"
            (viewDateChange)="viewDateChange.next(viewDate)">
            <i class="fas fa-angle-right"></i>
            </div>
        </div>
      </div>
      <div class="col-sm-12 col-md-8 col-lg-8">
        <h3 class="m-0">{{ viewDate | calendarDate: view + 'ViewTitle':locale }}</h3>
      </div>
      <!-- <div class="col-sm-12 col-md-4 col-lg-4">
        <div class="btn-group" id="buttonGroup">
          <div
            class="btn btn-primary"
            (click)="viewChange.emit(CalendarView.Month)"
            [class.active]="view === CalendarView.Month"
          >
            Month
          </div>
          <div
            class="btn btn-primary"
            (click)="viewChange.emit(CalendarView.Week)"
            [class.active]="view === CalendarView.Week"
          >
            Week
          </div>
          <div
            class="btn btn-primary"
            (click)="viewChange.emit(CalendarView.Day)"
            [class.active]="view === CalendarView.Day"
          >
            Day
          </div>
        </div>
      </div> -->
    </div>
    
  `,
})
export class CalendarHeaderComponent
{
	@Input() view: CalendarView;

	@Input() viewDate: Date;

	@Input() locale: string = 'en';

	@Output() viewChange = new EventEmitter<CalendarView>();

	@Output() viewDateChange = new EventEmitter<Date>();

	CalendarView = CalendarView;
}
