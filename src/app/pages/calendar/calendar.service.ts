import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Meeting } from 'src/app/models/meeting.model';
import { EntityService } from 'src/app/shared/entity.service';
import { catchError } from 'rxjs';

const httpOptions = {
	observe: 'body',
	responseType: 'json',
};

@Injectable({ providedIn: 'root' })
export class CalendarService extends EntityService<Meeting>
{
	constructor(http: HttpClient)
	{
		super(http, environment.apiUrl, "meetings")
	}

	public getAllMeetings( options?: any ): Meeting[]
	{
		let endpoint = `${this.url}${this.endpoint}`;
		console.log(`list ${endpoint}`);
		const response = this.http
			.get<Meeting[]>(endpoint, { ...options, ...httpOptions })
			.pipe(catchError(this.handleError)
		)
		let returnList = []
		response.subscribe((result) =>
			result.forEach(item => 
			{
				returnList.push(item)
			}
		))

		return returnList
	}
}