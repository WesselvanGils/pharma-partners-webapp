import { Entity } from "./entity.model";
import { Medication } from "./medication.model";

export class Prescription extends Entity
{
    description: string
    dosage: string
    publicationDate: Date
    periodStart: Date
    periodEnd: Date
    medication: Medication
}