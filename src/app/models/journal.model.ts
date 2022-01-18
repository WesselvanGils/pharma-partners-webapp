import { Entity } from "./entity.model";
import { User } from "./user.model";

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
    author: User
}