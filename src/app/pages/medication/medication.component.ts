import { Component, Directive, EventEmitter, Input, OnInit, Output, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Medication } from 'src/app/models/medication.model';
import { Meeting } from 'src/app/models/meeting.model';
import { MedicationService } from './medication.service';


@Component({
  selector: 'app-medication',
  templateUrl: './medication.component.html',
  styleUrls: ['./medication.component.css']
})
export class MedicationComponent implements OnInit {

  meetings$!: Observable<Medication[]>;

  constructor( private medicationService: MedicationService,  private router: Router) {}

    ngOnInit() {
    
      this.meetings$ =  this.medicationService.list();
      console.log(this.meetings$)
    }

    

    removeUser(meeting: Meeting) 
    {
      console.log('Roept hij hem aan?')
      this.medicationService.delete(meeting._id).subscribe(() => this.meetings$ = this.medicationService.list())
      
    }
}



