import { ComponentFixture, TestBed } from "@angular/core/testing"
import { of } from "rxjs"
import { Medication } from "src/app/models/medication.model"
import { MedicalRecordService } from "../medicalRecord.service"
import { MedicationService } from "./medication.service"

import { PatientPrescriptionComponent } from "./patient-prescription.component"
import { PrescriptionService } from "./prescription.service"

describe("PatientPrescriptionComponent", () =>
{
	let prescriptionServiceSpy
	let medicationServiceSpy
	let medicalRecordServiceSpy: jasmine.SpyObj<MedicalRecordService>

	let component: PatientPrescriptionComponent
	let fixture: ComponentFixture<PatientPrescriptionComponent>

	const expectedMedication: Medication =
	{
		_id: undefined,
		name: undefined,
		unit: undefined
	}

	beforeEach(async () =>
	{
		prescriptionServiceSpy = jasmine.createSpyObj("PrescriptionService", ["list"])
		medicationServiceSpy = jasmine.createSpyObj("MedicationService", ["list"])
		medicalRecordServiceSpy = jasmine.createSpyObj("MedicalRecordService", ["list"])

		await TestBed.configureTestingModule({
			declarations: [ PatientPrescriptionComponent ],
			providers:
			[
				{ provide: PrescriptionService, useValue: prescriptionServiceSpy },
				{ provide: MedicationService, useValue: medicationServiceSpy },
				{ provide: MedicalRecordService, useValue: medicalRecordServiceSpy }
			]
		}).compileComponents()
	})

	beforeEach(() =>
	{
		medicationServiceSpy.list.and.returnValue(of(expectedMedication))

		fixture = TestBed.createComponent(PatientPrescriptionComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () =>
	{
		expect(component).toBeTruthy()
	})
})
