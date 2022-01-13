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
import { ICPC } from "src/app/models/ICPC.model"

@Component({
	selector: "app-patient-prescription",
	templateUrl: "./patient-prescription.component.html",
	styleUrls: ["./patient-prescription.component.css"]
})
export class PatientPrescriptionComponent implements OnInit {
	medications$: Observable<Medication[]>

	@Input() prescriptions$: Observable<Prescription[]>
	@Input() patient$: Observable<Patient>
	@Input() episodes$: Observable<Episode[]>
	@Input() ICPCs: ICPC[]
	@Output() prescriptions$Change = new EventEmitter<Observable<Prescription[]>>()
	@Output() patient$Change = new EventEmitter<Observable<Patient>>()
	constructor(
		private prescriptionService: PrescriptionService,
		private medicationService: MedicationService,
		private medicalRecordService: MedicalRecordService,
		private journalService: JournalService,
		private episodeService: EpisodeService) { }

	ngOnInit(): void {
		this.medications$ = this.medicationService.list()
	}

	detailPrescription(prescription: Prescription, patient: Patient) {
		const title = `Het recept van ${patient.firstName + " " + patient.lastName}`
		const message = `${prescription.dosage + " " + prescription.medication.name}`
		Swal.fire(title, message)
	}

	addPrescription() {
		let medicationOptions: string
		let episodeOptions: string
		this.medications$.subscribe(medications => {
			this.episodes$.subscribe(episodes => {
				episodes.forEach(episode => {
					episodeOptions =
						episodeOptions +
						`<option value=${episode._id}>${episode.description}</option>`
				})

				medications.forEach(medication => {
					medicationOptions =
						medicationOptions +
						`<option value=${medication._id}>${medication.name} ${medication.unit}</option>`
				})

				Swal.fire({
					title: "Voeg recept toe",
					html: `
						<style>
							/* Confirm button */
							.swal2-styled.swal2-confirm {
							  background-color: #3d6c99 !important;
							}
							.swal2-styled.swal2-confirm:focus {
							  box-shadow: 0 0 0 3px #3d6c9980 !important;
							}
							/* Deny button */
							.swal2-styled.swal2-deny {
							  background-color: #17a2b8 !important;
							}
							.swal2-styled.swal2-deny:focus {
							  box-shadow: 0 0 0 3px #17a2b880 !important;
							}
							/* Cancel button*/
							.swal2-styled.swal2-cancel {
								background-color: #ed1e79 !important;
							}
							.swal2-styled.swal2-cancel:focus {
								box-shadow: 0 0 0 3px rgb(237, 30, 121, 0.5) !important;
							}
						</style>
						<select type="text" id="medication" class="swal2-input px-2" placeholder="Medicatie">
							<option selected disabled>Kies een medicijn...</option>
							${medicationOptions}
						</select>
						<input type="text" id="description" class="swal2-input px-1" placeholder="Beschrijving">
						<input type="text" id="dosage" class="swal2-input px-1" placeholder="Dosering">
						<br>
						<label for="startTime">Start datum van inname:</label>
						<input type="Date" id="periodStart" class="swal2-input px-1 mx-1" placeholder="Start van inname">
						<br>
						<label for="endTime">Eind datum van inname:</label>
						<input type="Date" id="periodEnd" class="swal2-input px-1 mx-1" placeholder="Eind van inname">
						`,
					confirmButtonText: `<i class="fas fa-list-alt fa-sm p-0"></i> Voeg toe als journaalregel`,
					showCancelButton: true,
					cancelButtonText: `<i class="fas fa-times-circle"></i> Annuleer`,
					showCloseButton: true,
					showDenyButton: true,
					denyButtonText: "Voeg los toe",
					focusConfirm: false,
					preConfirm: () => {
						const medication = Swal.getPopup().querySelector<HTMLInputElement>("#medication").value
						const description = Swal.getPopup().querySelector<HTMLInputElement>("#description").value
						const dosage = Swal.getPopup().querySelector<HTMLInputElement>("#dosage").value
						const periodStart = Swal.getPopup().querySelector<HTMLInputElement>("#periodStart").value
						const periodEnd = Swal.getPopup().querySelector<HTMLInputElement>("#periodEnd").value

						if (!medication || !description || !dosage || !periodStart || !periodEnd) {
							Swal.showValidationMessage(`Vul a.u.b. alle velden in`)
						}
						return {
							medication: medication,
							description: description,
							dosage: dosage,
							periodStart: periodStart,
							periodEnd: periodEnd
						}
					},
					preDeny: () =>
					{
						const medication = Swal.getPopup().querySelector<HTMLInputElement>("#medication").value
						const description = Swal.getPopup().querySelector<HTMLInputElement>("#description").value
						const dosage = Swal.getPopup().querySelector<HTMLInputElement>("#dosage").value
						const periodStart = Swal.getPopup().querySelector<HTMLInputElement>("#periodStart").value
						const periodEnd = Swal.getPopup().querySelector<HTMLInputElement>("#periodEnd").value

						if (!medication || !description || !dosage || !periodStart || !periodEnd) {
							Swal.showValidationMessage(`Vul a.u.b. alle velden in`)
						}
						return {
							medication: medication,
							description: description,
							dosage: dosage,
							periodStart: periodStart,
							periodEnd: periodEnd
						}
					}
				}).then(result => {
					if (result.isDenied) {
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

						this.prescriptionService.create(prescriptionEntry).subscribe(prescription => {
							this.patient$.subscribe(patient => {
								patient.medicalrecord.prescriptions.push(prescription)
								this.medicalRecordService
									.update(patient.medicalrecord)
									.subscribe()
							})
						})
					}
					if (result.isConfirmed) {
						const prescriptionEntry: Prescription = {
							_id: undefined,
							description: result.value.description,
							dosage: result.value.dosage,
							periodStart: new Date(result.value.periodStart),
							periodEnd: new Date(result.value.periodEnd),
							publicationDate: new Date(),
							medication: medications.find(medication => medication._id == result.value.medication)
						}

						let ICPCOptions: string
						this.ICPCs.forEach(element => 
						{
							ICPCOptions = ICPCOptions + `<option>${element.IcpCode} ${element.IcpDescription}</option>`
						})

						Swal.fire(
							{
								title: "Journaalregel toevoegen",
								html:
									`<select type="text" id="episode" class="swal2-input px-1" placeholder="Episode">
									<option selected disabled>Kies een Episode...</option>
									${episodeOptions}
								</select>
								<input type="text" id="characteristics" class="swal2-input px-1" placeholder="Kenmerken">
								<input type="text" id="consult" class="swal2-input px-1" placeholder="Consult">
								<input list="ICPC" id="selectedICPC" class="swal2-input px-1" placeholder="ICPC Code">
								<datalist id="ICPC">
									${ICPCOptions}
								</datalist>
								`,
								showConfirmButton: true,
								confirmButtonText: `<i class="fas fa-check-circle"></i> Voeg toe`,
								showDenyButton: true,
								showCloseButton: true,
								denyButtonText: `<i class="fas fa-times-circle"></i> Annuleer`,
								focusDeny: false,
								focusConfirm: false,
								preConfirm: () => {
									const episode = Swal.getPopup().querySelector<HTMLInputElement>("#episode").value
									const characteristics = Swal.getPopup().querySelector<HTMLInputElement>("#characteristics").value
									const consult = Swal.getPopup().querySelector<HTMLInputElement>("#consult").value
									const ICPC = Swal.getPopup().querySelector<HTMLInputElement>("#selectedICPC").value
									return {
										episode: episode,
										characteristics: characteristics,
										consult: consult,
										ICPC: ICPC
									}
								}
							}).then(journalresult => 
							{
								if (journalresult.isConfirmed) {
									const medication = medications.find(medication => medication._id == result.value.medication)
									const journalEntry: Journal =
									{
										_id: undefined,
										ICPC: journalresult.value.ICPC,
										SOEP:
										{
											P: "Voorgeschreven medicatie: "+ medication.name + " " + medication.unit
										},
										characteristics: journalresult.value.characteristics,
										consult: journalresult.value.consult,
										publicationDate: new Date()
									}

									this.prescriptionService.create(prescriptionEntry).subscribe(prescription => {
										this.journalService.create(journalEntry).subscribe(journal => {
											this.patient$.subscribe(patient => {
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
							}
							)
					}
				})
			})
		})
	}
}