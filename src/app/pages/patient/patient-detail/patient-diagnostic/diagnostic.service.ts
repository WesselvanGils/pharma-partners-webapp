import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EntityService } from 'src/app/shared/entity.service';
import { Episode } from 'src/app/models/episode.model';
import { Diagnostic } from 'src/app/models/diagnostic.model';
import { catchError, Observable } from 'rxjs';
import { Measurement } from 'src/app/models/measurement.model';

const httpOptions = {
	observe: 'body',
	responseType: 'json',
};

@Injectable({ providedIn: 'root' })
export class DiagnosticService extends EntityService<Diagnostic>
{
	constructor(http: HttpClient)
	{
		super(http, environment.apiUrl, "diagnostics")
	}

	public getMeasurements(id: number | string, options?: any): Observable<Measurement>
	{
		const endpoint = `${environment.apiUrl}diagnostics/${id}/measurements`;
		console.log(`read ${endpoint}`);
		return this.http.get<Measurement[]>(endpoint, { ...options, ...httpOptions }).pipe(
			// tap(console.log),
			catchError(this.handleError)
		);
	}
}