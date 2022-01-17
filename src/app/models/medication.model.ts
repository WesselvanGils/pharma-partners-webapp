import { Entity } from "./entity.model";

export class Medication extends Entity
{
    name: string
    unit: string
    amount: number
    index: number
}