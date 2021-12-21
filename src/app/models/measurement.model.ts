import { Entity } from "./entity.model";

export class Measurement extends Entity
{
    valueNumber: Number
    date: Date
    unit: string
}