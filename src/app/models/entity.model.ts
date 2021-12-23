export abstract class Entity
{
	readonly _id!: string

	constructor(values: any)
	{
		this._id = values ? values._id : undefined;
	}
}