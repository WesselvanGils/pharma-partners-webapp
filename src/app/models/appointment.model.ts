import { Entity } from "./entity.model";
import { Patient } from "./patient.model";
import { User } from "./user.model";
import { CalendarEvent } from 'angular-calendar';

export class Appointment extends Entity
{
    employee: User
	patient: Patient
	meeting: CalendarEvent
	description: String
}