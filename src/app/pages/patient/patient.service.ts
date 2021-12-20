import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EntityService } from 'src/app/shared/entity.service';
import { Patient } from 'src/app/models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService extends EntityService<Patient>
{
	constructor (http: HttpClient)
    {
        super(http, environment.apiUrl, "patients")
    }   
}