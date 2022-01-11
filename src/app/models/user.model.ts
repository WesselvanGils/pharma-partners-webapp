import { Entity } from "./entity.model";

export class User extends Entity
{
    firstName: string
    lastName: string
    email: string
    employeeCode: string
    doctorCode: string
    token: string
    role: role
	authToken: any;
}

export enum role
{
    DOCTOR = "Doctor",
    ADMIN = "Administrator",
    ASSISTANT = "Assistant"
}