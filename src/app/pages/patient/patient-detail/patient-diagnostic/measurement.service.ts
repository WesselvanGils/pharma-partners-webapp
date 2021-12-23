import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EntityService } from 'src/app/shared/entity.service';
import { Episode } from 'src/app/models/episode.model';
import { Diagnostic } from 'src/app/models/diagnostic.model';
import { Measurement } from 'src/app/models/measurement.model';

@Injectable({ providedIn: 'root' })
export class MeasurementService extends EntityService<Measurement>
{
	constructor(http: HttpClient)
	{
		super(http, environment.apiUrl, "measurements")
	}
}