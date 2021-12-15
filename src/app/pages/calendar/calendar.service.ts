import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Meeting } from 'src/app/models/meeting.model';
import { EntityService } from 'src/app/shared/entity.service';

@Injectable({ providedIn: 'root' })
export class CalendarService extends EntityService<Meeting>
{
	constructor (http: HttpClient)
    {
        super(http, environment.apiUrl, "meetings")
    }
}