import { Entity } from "./entity.model";
import { MedicalRecord } from "./medicalRecord.model";

export class Patient extends Entity
{
    BSN: string
    firstName: string
    lastName: string
    adress: string
    prefix: string
    patientNumber: string
    gender: string
    dateofbirth: Date
    phonenumber: string
    medicalrecord: MedicalRecord 
}