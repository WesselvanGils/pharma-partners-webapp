import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EntityService } from 'src/app/shared/entity.service';
import { Episode } from 'src/app/models/episode.model';
import { Diagnostic } from 'src/app/models/diagnostic.model';
import { catchError, Observable } from 'rxjs';
import { Measurement } from 'src/app/models/measurement.model';
import { Appointment } from 'src/app/models/appointment.model';

const httpOptions = {
	observe: 'body',
	responseType: 'json',
};

@Injectable({ providedIn: 'root' })
export class AppointmentService extends EntityService<Appointment>
{
	constructor(http: HttpClient)
	{
		super(http, environment.apiUrl, "meetings")
	}

	public updateAppointment(id: number | string, options?: any): Observable<Appointment>{
        const endpoint = `${environment.apiUrl}meetings/${id}`;
		console.log(`update ${endpoint}`);
		return this.http.put<Appointment[]>(endpoint, { ...options, ...httpOptions }).pipe(
			// tap(console.log),
			catchError(this.handleError)
		);
    }
}