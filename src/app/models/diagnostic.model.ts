import { Entity } from "./entity.model";

export class Diagnostic extends Entity
{
    measurement?: string[]
    name: string
    unit: string
}