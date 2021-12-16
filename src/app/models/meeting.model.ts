import { Entity } from "./entity.model";
import { Patient } from "./patient.model";
import { User } from "./user.model";

export class Meeting extends Entity
{
    startDate: Date
	endDate: Date
	subject: string
	employee: User
	patient: Patient
}