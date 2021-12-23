import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { Observable } from "rxjs"
import { Medication } from "src/app/models/medication.model"
import { Patient } from "src/app/models/patient.model"
import { Prescription } from "src/app/models/prescription.model"
import Swal from "sweetalert2"
import { MedicalRecordService } from "../medicalRecord.service"
import { MedicationService } from "./medication.service"
import { PrescriptionService } from "./prescription.service"

@Component({
	selector: "app-patient-prescription",
	templateUrl: "./patient-prescription.component.html",
	styleUrls: [ "./patient-prescription.component.css" ]
})
export class PatientPrescriptionComponent implements OnInit
{
	medications$: Observable<Medication[]>

	@Input() prescriptions$: Observable<Prescription[]>
	@Input() patient$: Observable<Patient>
	@Output() prescriptions$Change = new EventEmitter<Observable<Prescription[]>>()
	@Output() patient$Change = new EventEmitter<Observable<Patient>>()
	constructor
	(
		private prescriptionService: PrescriptionService,
		private medicationService: MedicationService,
		private medicalRecordService: MedicalRecordService
	) { }

	ngOnInit(): void 
	{
		this.medications$ = this.medicationService.list()
	}

	detailPrescription(prescription: Prescription, patient: Patient)
	{
		const title = `Het recept van ${patient.firstName + " " + patient.lastName}`
		const message = `${prescription.dosage + " " + prescription.medication.name}`
		Swal.fire(title, message)
	}

	addPrescription()
	{
		let medicationOptions: string
		this.medications$.subscribe(medications =>
		{
			medications.forEach(medication =>
			{
				medicationOptions =
					medicationOptions +
					`<option value=${medication._id}>${medication.name} ${medication.unit}</option>`
			})

			Swal.fire({
				title: "Voeg recept toe",
				html: `
				<select type="text" id="medication" class="swal2-input px-1" placeholder="Medicatie">
					<option selected disabled>Kies een medicijn...</option>
					${medicationOptions}
				</select>
				<input type="text" id="description" class="swal2-input px-1" placeholder="Beschrijving">
				<input type="text" id="dosage" class="swal2-input px-1" placeholder="Dosering">
				<input type="text" id="period" class="swal2-input px-1" placeholder="Periode van inname">`,
				confirmButtonText: "Voeg toe",
				showCloseButton: true,
				showDenyButton: true,
				denyButtonText: "Annuleer",
				focusConfirm: false,
				preConfirm: () =>
				{
					const medication = Swal.getPopup().querySelector<
						HTMLInputElement
					>("#medication").value
					const description = Swal.getPopup().querySelector<
						HTMLInputElement
					>("#description").value
					const dosage = Swal.getPopup().querySelector<
						HTMLInputElement
					>("#dosage").value
					const period = Swal.getPopup().querySelector<
						HTMLInputElement
					>("#period").value

					if (!medication || !description || !dosage || !period)
					{
						Swal.showValidationMessage(`Vul a.u.b alle velden in`)
					}
					return {
						medication: medication,
						description: description,
						dosage: dosage,
						period: period
					}
				}
			}).then(result =>
			{
				if (result.isConfirmed)
				{
					let entry: Prescription = {
						_id: undefined,
						description: result.value.description,
						dosage: result.value.dosage,
						period: result.value.period,
						publicationDate: new Date(),
						medication: medications.find(
							medication =>
								medication._id == result.value.medication
						)
					}

					this.prescriptionService.create(entry).subscribe(result =>
					{
						this.patient$.subscribe(patient =>
						{
							patient.medicalrecord.prescriptions.push(result)
							this.medicalRecordService
								.update(patient.medicalrecord)
								.subscribe()
						})
					})
				}
			})
		})
	}
}
