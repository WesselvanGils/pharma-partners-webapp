import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { Medication } from 'src/app/models/medication.model';
import { Patient } from 'src/app/models/patient.model';
import { Prescription } from 'src/app/models/prescription.model';
import Swal from 'sweetalert2';
import { MedicationService } from './medication.service';
import { PrescriptionService } from './prescription.service';
import { PatientService } from '../patient.service';

@Component({
	selector: 'app-patient-detail',
	templateUrl: './patient-detail.component.html',
	styleUrls: [ './patient-detail.component.css' ],
})
export class PatientDetailComponent implements OnInit
{
	patient$: Observable<Patient>
	prescriptions$: Observable<Prescription[]>
	medications$: Observable<Medication[]>

	constructor(
		private route: ActivatedRoute,
		private patientService: PatientService,
		private prescriptionService: PrescriptionService,
		private medicationService: MedicationService
	) { }

	ngOnInit()
	{
		this.patient$ = this.route.paramMap.pipe(
			switchMap((params: ParamMap) =>
				this.patientService.read(params.get('_id')!)
			)
		)
		this.prescriptions$ = this.prescriptionService.list()
		this.medications$ = this.medicationService.list()
	}

	detailPrescription(prescription: Prescription, patient: Patient)
	{
		const title = `Het recept van ${patient.firstname + ' ' + patient.lastname}`
		const message = `${prescription.dosage + ' ' + prescription.medication.name}`
		Swal.fire(title, message)
	}

	addPrescription()
	{
		let medicationOptions: string
		this.medications$.subscribe((medications) =>
		{
			medications.forEach(medication =>
			{
				medicationOptions = medicationOptions + `<option value=${medication._id}>${medication.name} ${medication.unit}</option>`
			})

			Swal.fire({
				title: 'Voeg recept toe',
				html: `
				<select type="text" id="medication" class="swal2-input" placeholder="Medicatie">
					<option selected disabled>Kies een medicijn..</option>
					${medicationOptions}
				</select>
				<input type="text" id="description" class="swal2-input" placeholder="Beschrijving">
				<input type="text" id="dosage" class="swal2-input" placeholder="Dosering">
				<input type="text" id="period" class="swal2-input" placeholder="Periode van inname">`,
				confirmButtonText: 'Toevoegen',
				showDenyButton: true,
				denyButtonText: "Afbreken",
				focusConfirm: false,
				preConfirm: () =>
				{
					const medication = Swal.getPopup().querySelector<HTMLInputElement>('#medication').value
					const description = Swal.getPopup().querySelector<HTMLInputElement>('#description').value
					const dosage = Swal.getPopup().querySelector<HTMLInputElement>('#dosage').value
					const period = Swal.getPopup().querySelector<HTMLInputElement>('#period').value

					if (!medication || !description || !dosage || !period)
					{
						Swal.showValidationMessage(`Vul a.u.b alle velden in`)
					}
					return {
						medication: medication,
						description: description,
						dosage: dosage,
						period: period,
					}
				}
			}).then((result) =>
			{
				let entry: Prescription =
				{
					_id: undefined,
					description: result.value.description,
					dosage: result.value.dosage,
					period: result.value.period,
					publicationDate: new Date(),
					medication: medications.find( medication => medication._id == result.value.medication)
				}
				this.prescriptionService.create(entry).subscribe( (result) =>
				{
					if (result) this.prescriptions$ = this.prescriptionService.list()
				})
			})
		})
	}
}
