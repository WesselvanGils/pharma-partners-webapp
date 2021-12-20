import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { catchError, Observable, of, Subscription, switchMap } from 'rxjs';
import { Medication } from 'src/app/models/medication.model';
import { Prescription } from 'src/app/models/prescription.model';
import { Alert, AlertService } from 'src/app/shared/alert/alert.service';
import { MedicationService } from './medication.service';
import { PrescriptionService } from './prescription.service';

@Component({
	selector: 'app-receipts',
	templateUrl: './receipts.component.html',
	styleUrls: [ './receipts.component.css' ]
})
export class ReceiptsComponent implements OnInit
{

	receiptForm: FormGroup
	subscription: Subscription
	medications$: Observable<Medication[]>

	tempReceipt: Prescription
	newReceipt: Prescription = {
		_id: undefined,
		description: '',
		dosage: '',
		publicationDate: new Date('25-12-2021'),
		period: '',
		medication: undefined
	}

	constructor
		(
			private route: ActivatedRoute,
			private alertService: AlertService,
			private router: Router,
			private prescriptionService: PrescriptionService,
			private medicationService: MedicationService
		)
	{ }

	ngOnInit()
	{
		this.subscription = this.route.paramMap.pipe(
			switchMap((params: ParamMap) =>
			{
				if (!params.get('_id'))
				{
					return of(this.newReceipt)
				} else
				{
					return this.prescriptionService.read(params.get('_id')!)
				}
			})
		).subscribe((receipt) =>
		{
			this.tempReceipt = receipt
			this.receiptForm = new FormGroup({
				_id: new FormControl(receipt._id),
				preparation: new FormControl(receipt.description, [ Validators.required ]),
				dosage: new FormControl(receipt.dosage, [ Validators.required ]),
				publicationDate: new FormControl(receipt.publicationDate, [ Validators.required ]),
				daysToTake: new FormControl(receipt.period, [ Validators.required ]),
				medication: new FormControl(receipt.medication, [ Validators.required ]),
			});
		})
		this.medications$ = this.medicationService.list()
	}

	onSubmit(): void
	{
		if (this.receiptForm.valid)
		{
			if (this.tempReceipt._id)
			{
				this.prescriptionService.update(this.receiptForm.value)
					.pipe(catchError((error: Alert) =>
					{
						console.log(error)
						this.alertService.error(error.message)
						return of(false)
					}))
					.subscribe((success) =>
					{
						console.log(success)
						if (success)
						{
							this.router.navigate([ '../patient/detail/' + this.tempReceipt._id ])
						}
					})
			} else
			{
				this.prescriptionService.create(this.receiptForm.value)
					.pipe(catchError((error: Alert) =>
					{
						console.log(error)
						this.alertService.error(error.message)
						return of(false)
					}))
					.subscribe((success) =>
					{
						console.log(success)
						if (success)
						{
							this.router.navigate([ '/home' ])
						}
					})
			}
		}
	}

	ngOnDestroy()
	{
		this.subscription?.unsubscribe()
	}

	gotoUser(prescription: Prescription)
	{
		if (prescription._id == undefined)
		{
			this.router.navigate([ '/home' ]);
		} else
		{
			const userIdQuery = prescription ? prescription._id : null;
			this.router.navigate([ '../patient/detail/' + userIdQuery ]);
		}
	}
}