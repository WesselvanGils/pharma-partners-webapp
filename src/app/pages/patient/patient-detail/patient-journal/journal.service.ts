import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EntityService } from 'src/app/shared/entity.service';
import { Journal } from 'src/app/models/journal.model';

@Injectable({ providedIn: 'root' })
export class JournalService extends EntityService<Journal>
{
	constructor(http: HttpClient)
	{
		super(http, environment.apiUrl, "journals")
	}
}