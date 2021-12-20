import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EntityService } from 'src/app/shared/entity.service';
import { Prescription } from 'src/app/models/prescription.model';

@Injectable({ providedIn: 'root' })
export class PrescriptionService extends EntityService<Prescription>
{
	constructor (http: HttpClient)
    {
        super(http, environment.apiUrl, "prescriptions")
    }
}