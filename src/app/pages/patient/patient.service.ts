import { Injectable, PipeTransform } from '@angular/core'
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Meeting } from 'src/app/models/meeting.model';
import { EntityService } from 'src/app/shared/entity.service';
import { Patient } from 'src/app/models/patient.model';
import { DecimalPipe } from '@angular/common';
import { BehaviorSubject, debounceTime, delay, Observable, of, Subject, switchMap, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PatientService extends EntityService<Patient>
{

	constructor (http: HttpClient)
    {
        super(http, environment.apiUrl, "patients")
    }

   
}

