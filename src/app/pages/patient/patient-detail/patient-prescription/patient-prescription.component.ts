import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { Observable } from "rxjs"
import { Episode } from "src/app/models/episode.model"
import { Journal } from "src/app/models/journal.model"
import { Medication } from "src/app/models/medication.model"
import { Patient } from "src/app/models/patient.model"
import { Prescription } from "src/app/models/prescription.model"
import Swal from "sweetalert2"
import { MedicalRecordService } from "../medicalRecord.service"
import { EpisodeService } from "../patient-episode/episode.service"
import { JournalService } from "../patient-journal/journal.service"
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
	@Input() episodes$: Observable<Episode[]>
	@Output() prescriptions$Change = new EventEmitter<Observable<Prescription[]>>()
	@Output() patient$Change = new EventEmitter<Observable<Patient>>()
	constructor
		(
			private prescriptionService: PrescriptionService,
			private medicationService: MedicationService,
			private medicalRecordService: MedicalRecordService,
			private journalService: JournalService,
			private episodeService: EpisodeService
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
		let episodeOptions: string
		this.medications$.subscribe(medications =>
		{
			this.episodes$.subscribe(episodes =>
			{
				episodes.forEach(episode =>
				{
					episodeOptions =
						episodeOptions +
						`<option value=${episode._id}>${episode.description}</option>`
				})

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
						<input type="Date" id="periodStart" class="swal2-input px-1" placeholder="Start van inname">
						<input type="Date" id="periodEnd" class="swal2-input px-1" placeholder="Eind van inname">`,
					confirmButtonText: "Voeg toe als journaalregel",
					showCancelButton: true,
					cancelButtonText: "Annuleer",
					showCloseButton: true,
					showDenyButton: true,
					denyButtonText: "Voeg los toe",
					focusConfirm: false,
					returnInputValueOnDeny: true,
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
						const periodStart = Swal.getPopup().querySelector<
							HTMLInputElement
						>("#periodStart").value
						const periodEnd = Swal.getPopup().querySelector<
							HTMLInputElement
						>("#periodEnd").value

						if (!medication || !description || !dosage || !periodStart || !periodEnd)
						{
							Swal.showValidationMessage(`Vul a.u.b alle velden in`)
						}
						return {
							medication: medication,
							description: description,
							dosage: dosage,
							periodStart: periodStart,
							periodEnd: periodEnd
						}
					}
				}).then(result =>
				{
					console.log(result)
					if (result.isDenied)
					{
						const prescriptionEntry: Prescription = 
						{
							_id: undefined,
							description: result.value.description,
							dosage: result.value.dosage,
							periodStart: new Date(result.value.periodStart),
							periodEnd: new Date(result.value.periodEnd),
							publicationDate: new Date(),
							medication: medications.find(
								medication =>
									medication._id == result.value.medication
							)
						}

						this.prescriptionService.create(prescriptionEntry).subscribe(prescription =>
						{
							this.patient$.subscribe(patient =>
							{
								patient.medicalrecord.prescriptions.push(prescription)
								this.medicalRecordService
									.update(patient.medicalrecord)
									.subscribe()
							})
						})
					}
					if (result.isConfirmed)
					{
						const prescriptionEntry: Prescription = {
							_id: undefined,
							description: result.value.description,
							dosage: result.value.dosage,
							periodStart: new Date(result.value.periodStart),
							periodEnd: new Date(result.value.periodEnd),
							publicationDate: new Date(),
							medication: medications.find(
								medication =>
									medication._id == result.value.medication
							)
						}

						const ICPC: string[] = [ "B81", "C80", "A55", "C11", "F22" ]
						let ICPCOptions: string
						ICPC.forEach(element =>
						{
							ICPCOptions = ICPCOptions + `<option>${element}</option>`
						})

						Swal.fire(
						{
							title: "Journaalregel toevoegen",
							html:
							`
								<select type="text" id="episode" class="swal2-input px-1" placeholder="Episode">
									<option selected disabled>Kies een Episode...</option>
									${episodeOptions}
								</select>
								<input type="text" id="characteristics" class="swal2-input px-1" placeholder="Kenmerken">
								<input type="text" id="consult" class="swal2-input px-1" placeholder="Consult">
								<select type="text" id="ICPC" class="swal2-input" placeholder="ICPC">
									<option selected disabled>Kies een ICPC code...</option>
									${ICPCOptions}
								</select>
							`,
							showConfirmButton: true,
							showDenyButton: true,
							preConfirm: () =>
							{
								const episode = Swal.getPopup().querySelector<
									HTMLInputElement
								>("#episode").value
								const characteristics = Swal.getPopup().querySelector<
									HTMLInputElement
								>("#characteristics").value
								const consult = Swal.getPopup().querySelector<
									HTMLInputElement
								>("#consult").value
								const ICPC = Swal.getPopup().querySelector<
									HTMLInputElement
								>("#ICPC").value
								return {
									episode: episode,
									characteristics: characteristics,
									consult: consult,
									ICPC: ICPC
								}
							}
						}).then(journalresult =>
						{
							if (journalresult.isConfirmed)
							{
								const journalEntry: Journal =
								{
									_id: undefined,
									ICPC: journalresult.value.ICPC,
									SOEP:
									{
										P: medications.find(medication => medication._id == result.value.medication).name
									},
									characteristics: journalresult.value.characteristics,
									consult: journalresult.value.consult,
									publicationDate: new Date()
								}
		
								this.prescriptionService.create(prescriptionEntry).subscribe(prescription =>
								{
									this.journalService.create(journalEntry).subscribe(journal =>
									{
										this.patient$.subscribe(patient =>
										{
											const episodeToUpdate = patient.medicalrecord.episodes.find(episode => episode._id == journalresult.value.episode)
											episodeToUpdate.journals.push(journal)
											patient.medicalrecord.prescriptions.push(prescription)
											this.episodeService.update(episodeToUpdate).subscribe()
											this.medicalRecordService
												.update(patient.medicalrecord)
												.subscribe()
										})
									})
								})
							}
						})
					}
				})
			})
		})
	}
}
