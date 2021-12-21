import { Diagnostic } from "./diagnostic.model";
import { Entity } from "./entity.model";
import { Episode } from "./episode.model";
import { Prescription } from "./prescription.model";

export class MedicalRecord extends Entity
{
    prescriptions: Prescription[]
    episodes: Episode[]
    diagnostics: Diagnostic[]
}