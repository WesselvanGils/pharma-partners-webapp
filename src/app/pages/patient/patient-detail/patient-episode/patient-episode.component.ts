import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core"
import { Observable } from "rxjs"
import { Episode } from "src/app/models/episode.model"
import Swal from "sweetalert2"
import { EpisodeService } from "./episode.service"
import { MedicalRecordService } from "../medicalRecord.service"
import { Journal } from "src/app/models/journal.model"
import { Patient } from "src/app/models/patient.model"
import { ICPC } from "src/app/models/ICPC.model"

@Component({
	selector: "app-patient-episode",
	templateUrl: "./patient-episode.component.html",
	styleUrls: [ "./patient-episode.component.css" ]
})
export class PatientEpisodeComponent implements OnInit
{
	@Input() episodes$: Observable<Episode[]>
	@Input() patient$: Observable<Patient>
	@Input() ICPCs: ICPC[]
	@Output() patient$Change = new EventEmitter<Observable<Patient>>()
	@Output() episodes$Change = new EventEmitter<Observable<Episode[]>>()
	constructor
	(
		private episodeService: EpisodeService,
		private medicalRecordService: MedicalRecordService
	) { }

	ngOnInit(): void { }

	setJournal(journals: Journal[], episode: Episode)
	{
		this.episodeService.changeJournal(journals, episode)
	}

	addEpisode()
	{
		let ICPCOptions: string
		this.ICPCs.forEach(element =>
		{
			ICPCOptions = ICPCOptions + `<option>${element.IcpCode} ${element.IcpDescription}</option>`
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
			<input type="text" id="description" class="swal2-input" placeholder="Omschrijving">
			<p class='mt-2 mb-0 mr-4'>Datum:</p>
			<input type="date" id="startDate" class="swal2-input mt-1" placeholder="Start Datum">
			<input list="ICPC" id="selectedICPC" class="swal2-input px-1" placeholder="ICPC Code">
			<datalist id="ICPC">
				${ICPCOptions}
			</datalist>
			<br>
			<input type="checkbox" id="priority" class="swal2-checkbox mt-3">
			<label class="form-check-label" for="priority">
				Prioriteit
			</label>    
			`,
			confirmButtonText: `<i class="fas fa-check-circle"></i> Voeg toe`,
			showDenyButton: true,
			showCloseButton: true,
			denyButtonText: `<i class="fas fa-times-circle"></i> Annuleer`,
			focusDeny: false,
			focusConfirm: false,
			preConfirm: () =>
			{
				const description = Swal.getPopup().querySelector<
					HTMLInputElement
				>("#description").value
				const startDate = (Swal.getPopup().querySelector<
					HTMLInputElement
				>("#startDate").value as unknown) as Date
				const ICPC = Swal.getPopup().querySelector<HTMLInputElement>(
					"#selectedICPC"
				).value
				const priorityInput = <HTMLInputElement>(
					document.getElementById("priority")
				)
				const priority = priorityInput.checked
				if (!description || !startDate || !ICPC)
				{
					Swal.showValidationMessage(`Vul a.u.b. alle velden in`)
				}
				return {
					description: description,
					startDate: startDate,
					ICPC: ICPC,
					priority: priority
				}
			}
		}).then(result =>
		{
			if (result.isConfirmed)
			{
				const entry: Episode = {
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
						this.medicalRecordService
							.update(patient.medicalrecord)
							.subscribe()
					})
				})
			}
		})
	}
}