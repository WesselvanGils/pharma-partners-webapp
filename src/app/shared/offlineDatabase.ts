import Dexie, { Table } from "dexie";

export class OfflineDatabase extends Dexie
{
	patientTable!: Table<any, number>

	constructor()
	{
		super("ngdexieliveQuery")
		this.version(3).stores(
			{
				patient: "++id, BSN, adress, prefix, patientNubmer, gender, dateofbirth, phonenumber, firstName, lastName"
			})
		this.on("populate", () => this.populate())
	}

	async populate()
	{
		console.warn("hey we're populating")
		await db.patientTable.add(
		{
			"BSN": "d5ac4ff43edd7efd6f3593ead15d52e8:ec034b02b6b3da07240d9295d26fd67f",
			"adress": "4703dfd4526dd50d0bf0a7245591d461:57be201c00767ec6550f4995a36ba746",
			"prefix": "Dhr",
			"patientNumber": "14",
			"gender": "male",
			"dateofbirth": {
				"$date": "1984-01-01T00:00:00.000Z"
			},
			"phonenumber": "d56da6e0a0be50d9a91895c90fa87ede:3388d4853217bf1c292418076fec4abf",
			"firstName": "Hanzo",
			"lastName": "Shimada",
			"__enc_BSN": true,
			"__enc_phonenumber": true,
			"__enc_adress": true,
			"__v": 0
		})
	}

	async resetDatabase()
	{
		await db.transaction("rw", "patientTable", () =>
		{
			this.patientTable.clear()
		})
	}
}

export const db = new OfflineDatabase()