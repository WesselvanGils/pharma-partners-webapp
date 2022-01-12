import { Component, OnInit } from "@angular/core"
import { ActivatedRoute, ParamMap } from "@angular/router"
import { Observable, of, switchMap } from "rxjs"
import { Patient } from "src/app/models/patient.model"
import { Prescription } from "src/app/models/prescription.model"
import Swal from "sweetalert2"
import { PatientService } from "../patient.service"
import { Episode } from "src/app/models/episode.model"
import { Diagnostic } from "src/app/models/diagnostic.model"
import { Appointment } from "src/app/models/appointment.model"
import { AuthService } from "src/app/core/auth/auth.service"
import { CalendarService } from "../../calendar/calendar.service"

@Component({
	selector: "app-patient-detail",
	templateUrl: "./patient-detail.component.html",
	styleUrls: [ "./patient-detail.component.css" ]
})
export class PatientDetailComponent implements OnInit
{
	patient$: Observable<Patient>
	prescriptions$: Observable<Prescription[]>
	episodes$: Observable<Episode[]>
	diagnostics$: Observable<Diagnostic[]>

	constructor(
		private route: ActivatedRoute,
		private patientService: PatientService,
		private authService: AuthService,
		private calendarService: CalendarService
	) { }

	ngOnInit()
	{
		this.route.paramMap
			.pipe(
				switchMap((params: ParamMap) =>
					this.patientService.read(params.get("_id")!)
				)
			)
			.subscribe(result =>
			{
				this.patient$ = of(result)
				this.prescriptions$ = of(result.medicalrecord.prescriptions)
				this.episodes$ = of(result.medicalrecord.episodes)
				this.diagnostics$ = of(result.medicalrecord.diagnostics)
			})
	}

	addAppointment()
	{
		Swal.fire({
			title: "Voeg afspraak toe",
			html: `
			<input type="text" id="title" class="swal2-input" placeholder="Afspraak naam">
			<input type="text" id="description" class="swal2-input" placeholder="Afspraak Omschrijving">
			<p class='mt-2 mb-0 mr-4'>Datum:</p>
			<input type="date" id="date" class="swal2-input mt-1" placeholder="Datum">
			<br>
			<label for="startTime">Start tijd:</label>
			<input type="time" id="startTime" class="swal2-input mx-1" placeholder="Begin tijd">
			<br>
			<label for="endTime">Eind tijd:</label>
			<input type="time" id="endTime" class="swal2-input mx-1" placeholder="Eind tijd">
			`,
			confirmButtonText: `<i class="fas fa-check-circle"></i> Voeg toe`,
			showDenyButton: true,
			showCloseButton: true,
			denyButtonText: `<i class="fas fa-times-circle"></i> Annuleer`,
			focusDeny: false,
			focusConfirm: false,
			preConfirm: () =>
			{
				const title = Swal.getPopup().querySelector<HTMLInputElement>("#title").value
				const description = Swal.getPopup().querySelector<HTMLInputElement>("#description").value
				const date = Swal.getPopup().querySelector<HTMLInputElement>("#date").value
				const startTime = Swal.getPopup().querySelector<HTMLInputElement>("#startTime").value
				const endTime = Swal.getPopup().querySelector<HTMLInputElement>("#endTime").value

				if (!title || !description || !date || !startTime || !endTime)
				{
					Swal.showValidationMessage(`Vul a.u.b. alle velden in`)
				}
				return {
					title: title,
					description: description,
					date: date,
					startTime: startTime,
					endTime: endTime
				}
			}
		}).then(result =>
		{
			if (result.isConfirmed)
			{
				this.patient$.subscribe(patient =>
				{
					const formattedStart: Date = new Date(
						`${result.value.date}T${result.value.startTime}`
					)
					const formattedEnd: Date = new Date(
						`${result.value.date}T${result.value.endTime}`
					)

					const entry: Appointment = {
						_id: undefined,
						employee: this.authService.currentUser$.value,
						patient: patient,
						description: result.value.description,
						meeting: {
							title: result.value.title,
							start: formattedStart,
							end: formattedEnd
						}
					}

					this.calendarService.list(this.authService.currentUser$.value._id).subscribe(appointments =>
					{
						let appointmentStartAndEnds: [{startTime: Date, endTime: Date}] = [{startTime: undefined, endTime: undefined}]

						appointments.forEach(item =>
						{
							const startToBeAdded = new Date(item.meeting.start)
							const endToBeAdded = new Date(item.meeting.end)
							if (startToBeAdded.getDate() == formattedStart.getDate() && endToBeAdded.getDate() == formattedEnd.getDate())
								appointmentStartAndEnds.push({startTime: startToBeAdded, endTime: endToBeAdded})
						})
						
						// Check if there's no overlapping times between the current appointments
						// and the new entry that is being inserted
						// returns true if there is an overlap otherwise returns false
						if (appointmentStartAndEnds.some(item =>
						{
							if ((item.startTime <= entry.meeting.start && entry.meeting.start <= item.endTime) ||
								(item.startTime <= entry.meeting.end && entry.meeting.end <= item.endTime))
								return true
							else
								return false
						}))
						{
							Swal.fire(
							{
								title: "Wacht even!",
								html: `<span>Je hebt al een afspraak op deze tijd staan</span>`,
								showDenyButton: true,
								denyButtonText: `<i class="fas fa-times-circle"></i> Annuleer`,
								showConfirmButton: true,
								confirmButtonText: "Toch inplannen"
							}).then(answer =>
							{
								if (answer.isConfirmed)
								{
									this.calendarService.create(entry).subscribe()
								}
								if (answer.isDenied)
								{
									this.addAppointment()
								}
							})
						}
						else
						{
							this.calendarService.create(entry).subscribe()
						}
					})
				})
			}
		})
	}
}
