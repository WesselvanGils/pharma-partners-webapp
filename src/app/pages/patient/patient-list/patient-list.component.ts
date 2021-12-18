import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, of, Subject, switchMap } from 'rxjs';
import { Patient } from 'src/app/models/patient.model';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-list',
  templateUrl: './patient-list.component.html',
  styleUrls: ['./patient-list.component.css']
})
export class PatientListComponent implements OnInit {
  patients$!: Observable<Patient[] | null>

  patients$!: Observable<Patient[] | null>
  selectedId=0

  patients: Patient[] = [];

  dtOptions: DataTables.Settings = {};

  dtTrigger: Subject<any> = new Subject<any>()

  constructor(
    private router: Router, 
    private activatedRoute: ActivatedRoute,
    private patientService: PatientService
  ) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 2
    };



    // this.patients$ = this.activatedRoute.paramMap.pipe(
    //   switchMap(params => {
    //     this.selectedId = parseInt(params.get('id')!, 10)
    //     return this.patientService.list();
    //   })
    // )

    this.patientService.list()
    .subscribe(data => {
      this.patients = data;
      // Calling the DT trigger to manually render the table
      this.dtTrigger.next(this.patients);
    });

  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }



}
