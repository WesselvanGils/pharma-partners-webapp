import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MedicalRecordService } from "../medicalRecord.service"
import { DiagnosticService } from "./diagnostic.service"
import { MeasurementService } from "./measurement.service"
import { PatientDiagnosticComponent } from "./patient-diagnostic.component"

describe("PatientDiagnosticComponent", () =>
{
	let diagnosticServiceSpy
	let medicalRecordServiceSpy
	let measurementServiceSpy

	let component: PatientDiagnosticComponent
	let fixture: ComponentFixture<PatientDiagnosticComponent>

	beforeEach(async () =>
	{
		diagnosticServiceSpy = jasmine.createSpyObj("DiagnosticService", ["list"])
		medicalRecordServiceSpy = jasmine.createSpyObj("MedicalRecordService", ["list"])
		measurementServiceSpy = jasmine.createSpyObj("MeasurementService", ["list"])

		await TestBed.configureTestingModule({
			declarations: [ PatientDiagnosticComponent ],
			providers:
			[
				{ provide: DiagnosticService, useValue: diagnosticServiceSpy },
				{ provide: MedicalRecordService, useValue: medicalRecordServiceSpy },
				{ provide: MeasurementService, useValue: measurementServiceSpy },
			]
		}).compileComponents()
	})

	beforeEach(() =>
	{
		fixture = TestBed.createComponent(PatientDiagnosticComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () =>
	{
		expect(component).toBeTruthy()
	})
})
