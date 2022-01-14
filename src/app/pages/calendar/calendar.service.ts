import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Appointment } from 'src/app/models/appointment.model';
import { EntityService } from 'src/app/shared/entity.service';
import { BehaviorSubject, catchError } from 'rxjs';

const httpOptions = {
	observe: 'body',
	responseType: 'json',
};

@Injectable({ providedIn: 'root' })
export class CalendarService extends EntityService<Appointment>
{
	private appointmentSource = new BehaviorSubject<Appointment>(undefined)
	currentAppointment = this.appointmentSource.asObservable()

	constructor(http: HttpClient)
	{
		super(http, environment.apiUrl, "meetings")
	}

	changeAppointment( appointmnet: Appointment )
	{
		this.appointmentSource.next(appointmnet)
	}
}