import { Entity } from "./entity.model";


export class Episode extends Entity
{
    publicationDate: Date
    description: string
    priority: boolean
    ICPC: string
    startDate: Date
}