import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CalendarEvent } from 'angular-calendar';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Appointment } from 'src/app/models/appointment.model';
import { Patient } from 'src/app/models/patient.model';
import Swal from "sweetalert2"
import { CalendarService } from '../calendar.service';
import { AppointmentService } from './appointment.service';

@Component({
	selector: 'app-appointment',
	templateUrl: './appointment.component.html',
	styleUrls: [ './appointment.component.css' ]
})

export class AppointmentComponent implements OnInit
{
	patient$: Observable<Patient>
	@Input() focusedMeeting: Observable<Appointment>
	@Output() onDelete = new EventEmitter<string>()
	@Output() onUpdate = new EventEmitter<Appointment>()
	constructor(
		private authService: AuthService,
		private calendarService: CalendarService,
		private appointmentService: AppointmentService,
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
				this.appointmentService.delete(focusedMeeting._id).subscribe(resolve => 
				{
					this.onDelete.emit(focusedMeeting._id)
				})
			}
		})
	}

	editAppointment(focusedMeeting: Appointment)
	{
		const oldDate = focusedMeeting.meeting.start.toString().slice(0,10)
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
						formattedStart = new Date(focusedMeeting.meeting.start)
					} else {
						formattedStart = new Date(
							`${result.value.date}T${result.value.startTime}`
							)
					}
						
					let formattedEnd
					if(result.value.endTime == 'empty'){
						formattedEnd = new Date(focusedMeeting.meeting.end)
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
										this.appointmentService.update(entry).subscribe(resolve =>
										{
											this.onUpdate.emit(focusedMeeting)
										})
									}
									if (answer.isDenied)
									{
										this.editAppointment(focusedMeeting)
									}
								})
							}
							else
							{
								this.appointmentService.update(entry).subscribe(resolve =>
								{
									this.onUpdate.emit(focusedMeeting)
								})
							}
						})
				// })
			}
		})
	}
}
