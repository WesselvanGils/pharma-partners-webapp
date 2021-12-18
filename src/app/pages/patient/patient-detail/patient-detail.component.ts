import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Patient } from 'src/app/models/patient.model';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css']
})
export class PatientDetailComponent implements OnInit {
  patient$!: Observable<Patient>

  constructor(private route: ActivatedRoute, private router: Router, private patientService: PatientService) { }

  ngOnInit(){
    this.patient$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.patientService.read(params.get('_id')!))
    );
  }

}
