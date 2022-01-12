import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core"
import { Observable } from "rxjs"
import { Episode } from "src/app/models/episode.model"
import { Journal } from "src/app/models/journal.model"
import Swal from "sweetalert2"
import { EpisodeService } from "../patient-episode/episode.service"
import { JournalService } from "./journal.service"

@Component({
	selector: "app-patient-journal",
	templateUrl: "./patient-journal.component.html",
	styleUrls: [ "./patient-journal.component.css" ]
})
export class PatientJournalComponent implements OnInit, OnDestroy
{
	journals: Journal[]
	episode: Episode

	constructor
	( 
		private journalService: JournalService,
		private episodeService: EpisodeService 
	) { }

	
	ngOnDestroy(): void {
		this.episodeService.changeJournal(undefined, undefined)
	}

	ngOnInit(): void 
	{
		this.episodeService.currentJournal.subscribe( journals => this.journals = journals)	
		this.episodeService.currentEpisode.subscribe( episode => this.episode = episode)
	}

	close()
	{
		this.episodeService.changeJournal(undefined, undefined)
	}

	addJournal()
	{
		const ICPC: string[] = [ "B81", "C80", "A55", "C11", "F22" ]
		let ICPCOptions: string
		ICPC.forEach(element =>
		{
			ICPCOptions = ICPCOptions + `<option>${element}</option>`
		})
		Swal.fire({
			title: "Voeg journal toe",
			html: `
			<input type="text" id="S" class="swal2-input px-1" placeholder="S">
			<input type="text" id="O" class="swal2-input px-1" placeholder="O">
			<input type="text" id="E" class="swal2-input px-1" placeholder="E">
			<input type="text" id="P" class="swal2-input px-1" placeholder="P">
			<input type="text" id="characteristics" class="swal2-input px-1" placeholder="Kenmerken">
			<input type="text" id="consult" class="swal2-input px-1" placeholder="Consult">
			<select type="text" id="ICPC" class="swal2-input" placeholder="ICPC">
				<option selected disabled>Kies een ICPC code...</option>
				${ICPCOptions}
			</select>
			<input type="date" id="date" class="swal2-input px-1">`,
			confirmButtonText: `<i class="fas fa-check-circle"></i> Voeg toe`,
			showCloseButton: true,
			showDenyButton: true,
			denyButtonText: `<i class="fas fa-times-circle"></i> Annuleer`,
			focusConfirm: false,
			preConfirm: () =>
			{
				const S = Swal.getPopup().querySelector<HTMLInputElement>("#S").value
				const O = Swal.getPopup().querySelector<HTMLInputElement>("#O").value
				const E = Swal.getPopup().querySelector<HTMLInputElement>("#E").value
				const P = Swal.getPopup().querySelector<HTMLInputElement>("#P").value
				const characteristics = Swal.getPopup().querySelector<HTMLInputElement>("#characteristics").value
				const consult = Swal.getPopup().querySelector<	HTMLInputElement>("#consult").value
				const ICPC = Swal.getPopup().querySelector<	HTMLInputElement>("#ICPC").value
				const date = Swal.getPopup().querySelector<	HTMLInputElement>("#date").value as unknown as Date

				if (!characteristics || !consult || !ICPC || !date)
				{
					Swal.showValidationMessage(`Vul a.u.b. alle velden in`)
				}
				const returnJournal: Journal =
				{
					_id: undefined,
					SOEP:
					{
						S: S,
						O: O,
						E: E,
						P: P
					},
					ICPC: ICPC,
					characteristics: characteristics,
					consult: consult,
					publicationDate: date
				}
				return returnJournal
			}
		}).then(result =>
		{
			if (result.isConfirmed)
			{
				this.journalService.create(result.value).subscribe(result =>
				{
					this.episode.journals.push(result)
					this.episodeService.update(this.episode).subscribe()
				})
			}
		})
	}
}
