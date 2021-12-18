import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Patient } from 'src/app/models/patient.model';
import { PatientTempService } from '../patientTemp.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients$!: Observable<Patient[] | null>

  constructor(private patientTempService: PatientTempService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.patients$ = this.patientTempService.getPatients()
  }

}
