import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Appointment } from 'src/app/models/appointment.model';
import { Patient } from 'src/app/models/patient.model';
import Swal from "sweetalert2"
import { CalendarService } from '../calendar.service';

@Component({
	selector: 'app-appointment',
	templateUrl: './appointment.component.html',
	styleUrls: [ './appointment.component.css' ]
})

export class AppointmentComponent implements OnInit
{
	patient$: Observable<Patient>
	@Input() focusedMeeting: Observable<Appointment>
	@Output() onDelete = new EventEmitter<boolean>()
	constructor(
		private authService: AuthService,
		private calendarService: CalendarService
	) { }
	
	ngOnInit(): void 
	{

	}

	deleteAppointment(focusedMeeting: Appointment)
	{
		Swal.fire(
		{
			title: "Weet je het zeker?",
			showConfirmButton: true,
			showDenyButton: true
		}).then(result =>
		{
			if (result.isConfirmed)
			{
				this.onDelete.emit(true)
			}
		})
	}

	editAppointment(focusedMeeting: Appointment)
	{
		const oldDate = focusedMeeting.meeting.start.toString().slice(0,10)
		// const oldStartTime = focusedMeeting.meeting.start.getHours() + ":" + focusedMeeting.meeting.start.getMinutes()
		const test = focusedMeeting.meeting.start.toString()
		console.warn(test)
		Swal.fire({
			title: "Wijzig afspraak",
			html: `
			<input type="text" id="title" class="swal2-input" placeholder="Afspraak naam" value="${focusedMeeting.meeting.title}">
			<input type="text" id="description" class="swal2-input" placeholder="Afspraak Omschrijving" value="${focusedMeeting.description}">
			<p class='mt-2 mb-0 mr-4'>Datum:</p>
			<input type="date" id="date" class="swal2-input mt-1" placeholder="Datum" value="${oldDate}">
			<br>
			<label for="startTime">Start tijd:</label>
			<input type="time" id="startTime" class="swal2-input mx-1" placeholder="Begin tijd">
			<br>
			<label for="endTime">Eind tijd:</label>
			<input type="time" id="endTime" class="swal2-input mx-1" placeholder="Eind tijd">
			`,
			confirmButtonText: `<i class="fas fa-check-circle"></i> Pas aan`,
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

				console.warn(startTime ? startTime : 'aaa')
				if (!title || !date || !description)
				{
					Swal.showValidationMessage(`Vul a.u.b. alle velden in`)
				}
				return {
					title: title,
					description: description,
					date: date,
					startTime: startTime ? startTime : 'empty',
					endTime: endTime ? endTime : 'empty'
				}
			}
		}).then(result =>
		{
			if (result.isConfirmed)
			{
				// this.patient$.subscribe(patient =>
				// {
					let formattedStart
					if(result.value.startTime == 'empty'){
						formattedStart = focusedMeeting.meeting.start
					} else {
						formattedStart = new Date(
							`${result.value.date}T${result.value.startTime}`
							)
					}
						
					let formattedEnd
					if(result.value.endTime == 'empty'){
						formattedEnd = focusedMeeting.meeting.end
					} else {
						formattedEnd = new Date(
							`${result.value.date}T${result.value.endTime}`
							)
					}

					console.warn(formattedStart + formattedEnd)
					
					const entry: Appointment = {
						_id: focusedMeeting._id,
						employee: this.authService.currentUser$.value,
						patient: focusedMeeting.patient,
						description: result.value.description,
						meeting: {
							title: result.value.title,
							start: formattedStart,
							end: formattedEnd
						}
					}

					this.calendarService.list(this.authService.currentUser$.value._id).subscribe(appointments =>
					{
						let appointmentStartDates: Date[] = []
						let appointmentEndDates: Date[] = []
						appointments.forEach(appointment => 
						{
							appointmentStartDates.push(new Date(appointment.meeting.start))
							appointmentEndDates.push(new Date(appointment.meeting.end))
						})
						// Check if there's no overlapping times between the current appointments
						// and the new entry that is being inserted
						// returns true if there is an overlap otherwise returns false
						if (appointmentStartDates.some(appointmentStart =>
							{
								// Checks if the appointment start is before the new entry's start
								if (appointmentStart <= entry.meeting.start)
								{
									// If the appointment starts before the new entry's start is before the end of the appointment
									return appointmentEndDates.some(appointmentEnd =>
									{
										if (appointmentEnd <= entry.meeting.start)
											return false
										else
											return true
									})
								}
								else
								{
									// If the appoinment starts after the new entry starts 
									// check if the end doesn't end before the appointment does
									return appointmentEndDates.some(appointmentEnd =>
									{
										if (entry.meeting.end <= appointmentEnd)
											return true
										else
											return false
									})
								}
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
									console.warn("isConfirmed")
									// this.calendarService.create(entry).subscribe()
								}
								if (answer.isDenied)
								{
									console.warn("isDenied")
									// this.editAppointment(entry)
								}
							})
						}
						else
						{
							console.warn("else")
							// this.calendarService.update(entry).subscribe()
						}
					})
				// })
			}
		})
	}
}
