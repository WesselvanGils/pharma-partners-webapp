import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Medication} from 'src/app/models/medication.model';
import { EntityService } from 'src/app/shared/entity.service';

@Injectable({ providedIn: 'root' })
export class MedicationService extends EntityService<Medication>
{
	constructor (http: HttpClient)
    {
        super(http, environment.apiUrl, "medications")
    }
}