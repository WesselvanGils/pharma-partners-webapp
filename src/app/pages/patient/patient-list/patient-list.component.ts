import { Component, OnInit, ViewChild } from "@angular/core"
import { ActivatedRoute, Router } from "@angular/router"
import { DataTableDirective } from "angular-datatables"
import { Observable, Subject } from "rxjs"
import { Patient } from "src/app/models/patient.model"
import { PatientService } from "../patient.service"

@Component({
	selector: "app-patient-list",
	templateUrl: "./patient-list.component.html",
	styleUrls: [ "./patient-list.component.css" ]
})
export class PatientListComponent implements OnInit
{
	@ViewChild(DataTableDirective, {static: false})
	dtElement: DataTableDirective
	dtOptions: DataTables.Settings = {}
	dtTrigger: Subject<any> = new Subject<any>()

	patients$!: Observable<Patient[]>
	patients: Patient[] = []
	selectedId = 0

	batchSize = 100
	batchNmbr = 0

	constructor
	(
		private patientService: PatientService
	) { }

	ngOnInit(): void
	{
		this.dtOptions = {
			pagingType: "full_numbers",
			pageLength: 10
		}

		this.patientService.batch(this.batchSize, this.batchNmbr).subscribe(data =>
		{
			this.patients = data
			// Calling the DT trigger to manually render the table
			this.dtTrigger.next(this.patients)
		})
	}

	loadNextBatch(): void
	{
		this.batchNmbr += 1
		this.patientService.batch(this.batchSize, this.batchNmbr).subscribe(data =>
		{
			this.patients = this.patients.concat(data)
			// Calling the DT trigger to manually render the table
			this.dtElement.dtInstance.then((dtInstance: DataTables.Api) =>
			{
				dtInstance.destroy()
				this.dtTrigger.next(this.patients)
			})
		})
	}

	ngOnDestroy(): void
	{
		// Do not forget to unsubscribe the event
		this.dtTrigger.unsubscribe()
	}
}