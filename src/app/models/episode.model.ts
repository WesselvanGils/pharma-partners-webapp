import { Entity } from "./entity.model";
import { Journal } from "./journal.model";

export class Episode extends Entity
{
    publicationDate: Date
    description: string
    priority: boolean
    ICPC: string
    startDate: Date
    journals?: Journal[]
}