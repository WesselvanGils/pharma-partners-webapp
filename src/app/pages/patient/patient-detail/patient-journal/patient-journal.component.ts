import { Component, EventEmitter, Input, Output } from "@angular/core"
import { Episode } from "src/app/models/episode.model"
import { Journal } from "src/app/models/journal.model"
import Swal from "sweetalert2"
import { EpisodeService } from "../episode.service"
import { JournalService } from "./journal.service"

@Component({
	selector: "app-patient-journal",
	templateUrl: "./patient-journal.component.html",
	styleUrls: [ "./patient-journal.component.css" ]
})
export class PatientJournalComponent
{
	@Input() journals: Journal[]
	@Input() episode: Episode
	@Input() show: boolean
	@Output() showChange = new EventEmitter<boolean>()
	@Output() episodeChange = new EventEmitter<Episode>()
	constructor
	( 
		private journalService: JournalService,
		private episodeService: EpisodeService 
	) { }

	emitClose ()
	{
		this.showChange.emit(false)
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
			confirmButtonText: "Voeg toe",
			showCloseButton: true,
			showDenyButton: true,
			denyButtonText: "Annuleer",
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
					Swal.showValidationMessage(`Vul a.u.b alle velden in`)
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
