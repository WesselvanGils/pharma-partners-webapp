import { Entity } from "./entity.model";
import { Medication } from "./medication.model";

export class Receipt extends Entity
{
    preparation: string
    dosage: string
    publicationDate: Date
    daysToTake: String
    medication?: Medication
}