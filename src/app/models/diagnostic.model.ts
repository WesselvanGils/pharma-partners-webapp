import { Entity } from "./entity.model";
import { Measurement } from "./measurement.model";

export class Diagnostic extends Entity
{
    measurements?: Measurement[]
    name: string
    unit: string
    memoCode: string
    aolType: number
}