import { Entity } from "./entity.model";

export class User extends Entity
{
    firstName: string
    lastName: string
    email: string
    employeePrefix: string
    doctorPrefix: string
    token: string
    role: role
}

export enum role
{
    DOCTOR = "Doctor",
    ADMIN = "Administrator",
    ASSISTANT = "Assistant"
}