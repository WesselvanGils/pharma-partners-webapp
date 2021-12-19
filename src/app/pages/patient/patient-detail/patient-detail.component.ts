import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Patient } from 'src/app/models/patient.model';
import { Receipt } from 'src/app/models/receipt.model';
import Swal from 'sweetalert2';
import { ReceiptService } from '../../receipts/receipts.service';
import { PatientService } from '../patient.service';

@Component({
  selector: 'app-patient-detail',
  templateUrl: './patient-detail.component.html',
  styleUrls: ['./patient-detail.component.css'],
})
export class PatientDetailComponent implements OnInit {
  patient$!: Observable<Patient>;
  receipts$!: Observable<Receipt[]>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private patientService: PatientService,
    private receiptService: ReceiptService
  ) {}

  ngOnInit() {
    this.patient$ = this.route.paramMap.pipe(
      switchMap((params: ParamMap) =>
        this.patientService.read(params.get('_id')!)
      )
    );
    this.receipts$ = this.receiptService.list();
  }

  detailReceipt(receipt: Receipt, patient: Patient) {
    const title = `Het recept van ${patient.firstname +' '+ patient.lastname}`;
    const message = `${receipt.dosage +' '+  receipt.medication.name}`;
    Swal.fire(title, message);
  }
}
