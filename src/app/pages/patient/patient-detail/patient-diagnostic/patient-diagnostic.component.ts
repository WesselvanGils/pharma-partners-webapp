import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core"
import { Measurement } from "src/app/models/measurement.model"
import Swal from "sweetalert2"
import { Diagnostic } from "src/app/models/diagnostic.model" 
import { DiagnosticService } from "./diagnostic.service"
import { Observable } from "rxjs"
import { Patient } from "src/app/models/patient.model"
import { MedicalRecordService } from "../medicalRecord.service"
import { MeasurementService } from "./measurement.service"

@Component({
	selector: "app-patient-diagnostic",
	templateUrl: "./patient-diagnostic.component.html",
	styleUrls: [ "./patient-diagnostic.component.css" ]
})
export class PatientDiagnosticComponent implements OnInit
{
	@Input() patient$: Observable<Patient>
	@Input() diagnostics$: Observable<Diagnostic[]>
	@Output() patient$Change = new EventEmitter<Observable<Patient>>()
	@Output() diagnostics$Change = new EventEmitter<Observable<Diagnostic[]>>()
	constructor
	(
		private diagnosticService: DiagnosticService,
		private medicalRecordService: MedicalRecordService,
		private measurementService: MeasurementService
	) { }

	ngOnInit(): void { }

	addMeasurement(diagnostic: Diagnostic)
	{
		Swal.fire({
			title: "Voeg waarde toe aan: ",
			html: `
				<h3 style="font-weight: normal; color: #004a91;">${diagnostic.name} (${diagnostic.unit})</h3>
				<p class='mt-4 mb-0 mr-4'>Datum:</p>
				<input type="date" id="date" class="swal2-input mt-1" placeholder="Datum">
				<input type="number" min="0" id="valueNumber" class="swal2-input" placeholder="Waarde (getal)">
				`,
			confirmButtonText: "Voeg toe",
			showCloseButton: true,
			showDenyButton: true,
			denyButtonText: "Annuleer",
			focusConfirm: false,
			preConfirm: () =>
			{
				const valueNumber = (Swal.getPopup().querySelector<
					HTMLInputElement
				>("#valueNumber").value as unknown) as number
				const date = (Swal.getPopup().querySelector<HTMLInputElement>(
					"#date"
				).value as unknown) as Date
				if (!valueNumber || !date)
				{
					Swal.showValidationMessage(`Vul a.u.b. alle velden in`)
				}
				return {
					valueNumber: valueNumber,
					date: date
				}
			}
		}).then(result =>
		{
			if (result.isConfirmed)
			{
				let entry: Measurement = {
					_id: undefined,
					valueNumber: result.value.valueNumber,
					date: result.value.date
				}

				this.measurementService.create(entry).subscribe(result =>
				{
					diagnostic.measurements.push(result)
					this.diagnosticService.update(diagnostic).subscribe()
				})
			}
		})
	}

	getMeasurementHistory(diagnostic: Diagnostic)
	{
		let measurementOptions: string = ""
		diagnostic.measurements.forEach(measurement =>
		{
			if (measurement)
			{
				measurementOptions += `<tr> <td>${measurement.valueNumber}</td> 
				 <td>${new Date(measurement.date).toLocaleDateString()}</td> </tr>`
			}
		})

		Swal.fire({
			title: `${diagnostic.name} (${diagnostic.unit})`,
			html: `<style>
						thead{
							position: sticky; 
							top: -2px; 
						}
					</style>
					<div style="max-height: 200px!important;"class="table-responsive">
					<table class="table table-sm">
						<thead class="thead-light">
							<tr>
								<th scope="col">Waarde</th>
								<th scope="col">Datum</th>
							</tr>
						</thead>
						<tbody>
							${measurementOptions}
						</tbody>
					</table>
				   </div>`,
			showCloseButton: true,
			focusConfirm: false
		})
	}

	addDiagnostic()
	{
		Swal.fire({
			title: "Voeg meting toe",
			html: `
		  <input type="text" id="name" class="swal2-input" placeholder="Naam">
		  <input type="number" min="0" id="valueNumber" class="swal2-input" placeholder="Waarde (getal)">
		  <input type="text" id="unit" class="swal2-input" placeholder="Eenheid">
		  <input type="date" id="date" class="swal2-input" placeholder="Datum">
		  `,
			confirmButtonText: "Voeg toe",
			showDenyButton: true,
			showCloseButton: true,
			denyButtonText: "Annuleer",
			focusDeny: false,
			focusConfirm: false,
			preConfirm: () =>
			{
				const name = Swal.getPopup().querySelector<HTMLInputElement>(
					"#name"
				).value
				const unit = Swal.getPopup().querySelector<HTMLInputElement>(
					"#unit"
				).value
				const valueNumber = (Swal.getPopup().querySelector<
					HTMLInputElement
				>("#valueNumber").value as unknown) as number
				const date = (Swal.getPopup().querySelector<HTMLInputElement>(
					"#date"
				).value as unknown) as Date
				if (!name || !unit || !valueNumber || !date)
				{
					Swal.showValidationMessage(`Vul a.u.b. alle velden in`)
				}
				return {
					name: name,
					unit: unit,
					valueNumber: valueNumber,
					date: date
				}
			}
		}).then(result =>
		{
			if (result.isConfirmed)
			{
				const measurementEntry: Measurement = {
					_id: undefined,
					valueNumber: result.value.valueNumber,
					date: result.value.date
				}

				const diagnosticEntry: Diagnostic = {
					_id: undefined,
					name: result.value.name,
					unit: result.value.unit
				}

				this.diagnosticService
					.create(diagnosticEntry)
					.subscribe(diagnostic =>
					{
						this.patient$.subscribe(patient =>
						{
							patient.medicalrecord.diagnostics.push(diagnostic)

							this.medicalRecordService
								.update(patient.medicalrecord)
								.subscribe(result =>
								{
									this.measurementService
										.create(measurementEntry)
										.subscribe(result =>
										{
											diagnostic.measurements.push(result)

											this.diagnosticService
												.update(diagnostic)
												.subscribe()
										})
								})
						})
					})
			}
		})
	}
}