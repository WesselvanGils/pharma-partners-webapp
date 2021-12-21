import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, of, switchMap, take } from 'rxjs';
import { Medication } from 'src/app/models/medication.model';
import { Patient } from 'src/app/models/patient.model';
import { Prescription } from 'src/app/models/prescription.model';
import Swal from 'sweetalert2';
import { MedicationService } from './medication.service';
import { PrescriptionService } from './prescription.service';
import { PatientService } from '../patient.service';
import { EpisodeService } from './episode.service';
import { Episode } from 'src/app/models/episode.model';
import { MedicalRecordService } from './medicalRecord.service';

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
	episodes$: Observable<Episode[]>

	constructor(
		private route: ActivatedRoute,
		private patientService: PatientService,
		private prescriptionService: PrescriptionService,
		private medicationService: MedicationService,
		private episodeService: EpisodeService,
		private medicalRecordService: MedicalRecordService
	) { }

	ngOnInit()
	{
		if (!this.medications$) this.medications$ = this.medicationService.list()
		this.route.paramMap.pipe(
			switchMap((params: ParamMap) =>
				this.patientService.read(params.get('_id')!)
			)
		).subscribe(result =>
		{
			this.patient$ = of(result)
			this.prescriptions$ = of(result.medicalrecord.prescriptions)
			this.episodes$ = of(result.medicalrecord.episodes)
		})
	}

	detailPrescription(prescription: Prescription, patient: Patient)
	{
		const title = `Het recept van ${patient.firstName + ' ' + patient.lastName}`
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
				<select type="text" id="medication" class="swal2-input px-4" placeholder="Medicatie">
					<option selected disabled>Kies een medicijn...</option>
					${medicationOptions}
				</select>
				<input type="text" id="description" class="swal2-input px-1" placeholder="Beschrijving">
				<input type="text" id="dosage" class="swal2-input px-1" placeholder="Dosering">
				<input type="text" id="period" class="swal2-input px-1" placeholder="Periode van inname">`,
				confirmButtonText: 'Voeg toe',
				showCloseButton: true,
				showDenyButton: true,
				denyButtonText: "Annuleer",
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
					let entry: Prescription =
					{
						_id: undefined,
						description: result.value.description,
						dosage: result.value.dosage,
						period: result.value.period,
						publicationDate: new Date(),
						medication: medications.find(medication => medication._id == result.value.medication)
					}

					this.prescriptionService.create(entry).subscribe(result =>
					{
						this.patient$.subscribe(patient =>
						{
							patient.medicalrecord.prescriptions.push(result)
							this.medicalRecordService.update(patient.medicalrecord).subscribe(result =>
							{
								if (result) this.ngOnInit()
							})
						})
					})
				}
				this.prescriptionService.create(entry).subscribe( (result) =>
				{
					if (result) this.prescriptions$ = this.prescriptionService.list()
				})
			})
		})
	}

	addEpisode ()
	{
		const ICPC: string[] = [ 'B81', 'C80', 'A55', 'C11', 'F22' ]
		let ICPCOptions: string

		ICPC.forEach(element => 
		{
			ICPCOptions = ICPCOptions + `<option>${element}</option>`	
		})

		Swal.fire({
			title: "Voeg episode toe",
			html: `
			<style>
				input[type=checkbox]
				{
				/* Double-sized Checkboxes */
				-ms-transform: scale(1.5); /* IE */
				-moz-transform: scale(1.5); /* FF */
				-webkit-transform: scale(1.5); /* Safari and Chrome */
				-o-transform: scale(1.5); /* Opera */
				transform: scale(1.5);
				margin: 0;
				margin-right: 3px;
				}
			</style>
			<input type="text" id="description" class="swal2-input px-1" placeholder="Omschrijving">
			<input type="date" id="startDate" class="swal2-input" placeholder="Start Datum">
			<select type="text" id="ICPC" class="swal2-input" placeholder="ICPC">
				<option selected disabled>Kies een ICPC code...</option>
				${ICPCOptions}
				</select>
				<br>
				<input type="checkbox" id="priority" class="swal2-checkbox mt-3">
				<label class="form-check-label" for="priority">
					Priority
				</label>    
			`,
			confirmButtonText: 'Voeg toe',
			showDenyButton: true,
			showCloseButton: true,
			denyButtonText: "Annuleer",
			focusDeny: false,
			focusConfirm: false,
			preConfirm: () =>
			{
				const description = Swal.getPopup().querySelector<HTMLInputElement>('#description').value
				const startDate = Swal.getPopup().querySelector<HTMLInputElement>('#startDate').value as unknown as Date
				const ICPC = Swal.getPopup().querySelector<HTMLInputElement>('#ICPC').value
				const priorityInput = <HTMLInputElement> document.getElementById('priority')
				const priority = priorityInput.checked
				if (!description || !startDate || !ICPC )
				{
					Swal.showValidationMessage(`Vul a.u.b alle velden in`)
				}
				return {
					description: description,
					startDate: startDate,
					ICPC: ICPC,
					priority: priority,
				}
			}
		}).then((result) =>
		{
			let entry: Episode =
			{
				const entry: Episode =
				{
					_id: undefined,
					description: result.value.description,
					priority: result.value.priority,
					startDate: result.value.startDate,
					ICPC: result.value.ICPC,
					publicationDate: new Date()
				}

				this.episodeService.create(entry).subscribe(result =>
				{
					this.patient$.subscribe(patient =>
					{
						patient.medicalrecord.episodes.push(result)
						this.medicalRecordService.update(patient.medicalrecord).subscribe(result =>
						{
							if (result) this.ngOnInit()
						})
					})
				})
			}

			this.episodeService.create(entry).subscribe( (result) =>
			{
				if (result) this.episodes$ = this.episodeService.list()
			})
		})
	}
}