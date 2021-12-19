import { Entity } from "./entity.model";


export class Episode extends Entity
{
    publicationDate: Date
    description: String
    priority: boolean
    ICPC: String
    startDate: Date
}