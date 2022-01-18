import { Entity } from "./entity.model";
import { Episode } from "./episode.model";
import { Patient } from "./patient.model";

export class Journal extends Entity
{
    publicationDate: Date
    SOEP: 
    {
        S?: string
        O?: string
        E?: string
        P?: string
    }
    characteristics: string
    ICPC: string
    consult: string
    isArchived: boolean
    patient?: Patient
    episode: Episode
}