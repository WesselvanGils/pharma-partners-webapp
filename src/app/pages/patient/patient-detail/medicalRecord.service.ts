import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { EntityService } from 'src/app/shared/entity.service';
import { MedicalRecord } from 'src/app/models/medicalRecord.model';

@Injectable({ providedIn: 'root' })
export class MedicalRecordService extends EntityService<MedicalRecord>
{
	constructor (http: HttpClient)
    {
        super(http, environment.apiUrl, "medicalrecords")
    }
}