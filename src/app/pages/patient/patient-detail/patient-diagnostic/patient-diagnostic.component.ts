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
	styleUrls: ["./patient-diagnostic.component.css"]
})
export class PatientDiagnosticComponent implements OnInit {
	@Input() diagnosticTypes: Diagnostic[]
	@Input() patient$: Observable<Patient>
	@Input() diagnostics$: Observable<Diagnostic[]>
	@Output() onDelete = new EventEmitter<string>()
	@Output() patient$Change = new EventEmitter<Observable<Patient>>()
	@Output() diagnostics$Change = new EventEmitter<Observable<Diagnostic[]>>()
	constructor
		(
			private diagnosticService: DiagnosticService,
			private medicalRecordService: MedicalRecordService,
			private measurementService: MeasurementService
		) { }

	ngOnInit(): void { }

	addMeasurement(diagnostic: Diagnostic) {
		Swal.fire({
			title: "Voeg waarde toe aan: ",
			html: `
				<h3 style="font-weight: normal; color: #004a91;">${diagnostic.name} (${diagnostic.unit})</h3>
				<p class='mt-4 mb-0 mr-4'>Datum:</p>
				<input type="date" id="date" class="swal2-input mt-1" placeholder="Datum">
				<input type="number" min="0" id="valueNumber" class="swal2-input" placeholder="Waarde (getal)">
				`,
			confirmButtonText: `<i class="fas fa-check-circle"></i> Voeg toe`,
			showCloseButton: true,
			showDenyButton: true,
			denyButtonText: `<i class="fas fa-times-circle"></i> Annuleer`,
			focusConfirm: false,
			preConfirm: () => {
				const valueNumber = (Swal.getPopup().querySelector<
					HTMLInputElement
				>("#valueNumber").value as unknown) as number
				const date = (Swal.getPopup().querySelector<HTMLInputElement>(
					"#date"
				).value as unknown) as Date
				if (!valueNumber || !date) {
					Swal.showValidationMessage(`Vul a.u.b. alle velden in`)
				}
				return {
					valueNumber: valueNumber,
					date: date
				}
			}
		}).then(result => {
			if (result.isConfirmed) {
				let entry: Measurement = {
					_id: undefined,
					valueNumber: result.value.valueNumber,
					date: result.value.date
				}

				this.measurementService.create(entry).subscribe(result => {
					diagnostic.measurements.push(result)
					this.diagnosticService.update(diagnostic).subscribe()
				})
			}
		})
	}

	getMeasurementHistory(diagnostic: Diagnostic) {
		let measurementOptions: string = ""
		diagnostic.measurements.forEach(measurement => {
			if (measurement) {
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

	addDiagnostic() {
		let diagnosticTypesOptions: string
		this.diagnosticTypes.forEach(element => {
			diagnosticTypesOptions = diagnosticTypesOptions + `<option value="${element.name}">${element.unit ? element.unit : "N.A"}</option>`
		})

		Swal.fire({
			title: "Voeg meting toe",
			html:
				`
				<input list="nameList" id="diagnostic" class="swal2-input" placeholder="Naam">
				<datalist id="nameList">
					${diagnosticTypesOptions}
				</datalist>
		  	`,
			confirmButtonText: `<i class="fas fa-check-circle"></i> Voeg toe`,
			showDenyButton: true,
			showCloseButton: true,
			denyButtonText: `<i class="fas fa-times-circle"></i> Annuleer`,
			focusDeny: false,
			focusConfirm: false,
			preConfirm: () => {
				const diagnosticName = Swal.getPopup().querySelector<HTMLInputElement>("#diagnostic").value
				let diagnostic = this.diagnosticTypes.find(element => element.name == diagnosticName)
				diagnostic.unit = diagnostic.unit ? diagnostic.unit : "N.A"
				// const unit = Swal.getPopup().querySelector<HTMLInputElement>("#unit").value
				// const valueNumber = (Swal.getPopup().querySelector<HTMLInputElement>("#valueNumber").value as unknown) as number
				// const date = (Swal.getPopup().querySelector<HTMLInputElement>("#date").value as unknown) as Date
				if (!diagnostic) {
					Swal.showValidationMessage(`Geef a.u.b aan welke meting U toe wilt voegen`)
				}
				return {
					diagnostic: diagnostic,
				}
			}
		}).then(result => {
			if (result.isConfirmed) {
				console.warn(result.value.diagnostic)

				this.diagnosticService.create(result.value.diagnostic).subscribe(diagnostic => {
					this.patient$.subscribe(patient => {
						patient.medicalrecord.diagnostics.push(diagnostic)
						this.medicalRecordService.update(patient.medicalrecord).subscribe(medicalRecord => {
							this.addMeasurement(diagnostic)
						})
					})
				})
			}
		})
	}

	removeDiagnostic(diagnostic: Diagnostic) {
		Swal.fire(
			{
				title: "Weet u het zeker?",
				showConfirmButton: true,
				confirmButtonText: `<i class="fas fa-check-circle"></i> Bevestig`,
				showDenyButton: true,
				denyButtonText: `<i class="fas fa-times-circle"></i> Annuleer`
			}).then(result => {
				if (result.isConfirmed) {
					this.patient$.subscribe(patient => {

						this.diagnosticService.delete(diagnostic._id).subscribe(resolve => {

							patient.medicalrecord.diagnostics.forEach((element, index) => {
								if (element._id == diagnostic._id)
									patient.medicalrecord.diagnostics.splice(index, 1)
							})

							this.medicalRecordService.update(patient.medicalrecord).subscribe()
							this.onDelete.emit(diagnostic._id)
						})
					})
				}
			})
	}

}