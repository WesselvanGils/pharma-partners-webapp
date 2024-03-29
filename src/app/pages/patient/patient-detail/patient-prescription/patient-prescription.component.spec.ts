import { ComponentFixture, TestBed } from "@angular/core/testing"
import { of } from "rxjs"
import { AuthService } from "src/app/core/auth/auth.service"
import { Medication } from "src/app/models/medication.model"
import { MedicalRecordService } from "../medicalRecord.service"
import { EpisodeService } from "../patient-episode/episode.service"
import { JournalService } from "../patient-journal/journal.service"

import { PatientPrescriptionComponent } from "./patient-prescription.component"
import { PrescriptionService } from "./prescription.service"

describe("PatientPrescriptionComponent", () =>
{
	let prescriptionServiceSpy
	let medicationServiceSpy
	let journalRecordServiceSpy
	let episodeServiceSpy
	let medicalRecordServiceSpy: jasmine.SpyObj<MedicalRecordService>
	let authServiceSpy

	let component: PatientPrescriptionComponent
	let fixture: ComponentFixture<PatientPrescriptionComponent>

	const expectedMedication: Medication =
	{
		_id: undefined,
		name: undefined,
		unit: undefined,
		amount: undefined,
		index: undefined
	}

	beforeEach(async () =>
	{
		prescriptionServiceSpy = jasmine.createSpyObj("PrescriptionService", ["list"])
		medicationServiceSpy = jasmine.createSpyObj("MedicationService", ["list"])
		medicalRecordServiceSpy = jasmine.createSpyObj("MedicalRecordService", ["list"])
		journalRecordServiceSpy = jasmine.createSpyObj("MedicalRecordService", ["list"])
		episodeServiceSpy = jasmine.createSpyObj("episodeService", ["list"])
		authServiceSpy = jasmine.createSpyObj("authService", ["currentUser"])

		await TestBed.configureTestingModule({
			declarations: [ PatientPrescriptionComponent ],
			providers:
			[
				{ provide: PrescriptionService, useValue: prescriptionServiceSpy },
				{ provide: MedicalRecordService, useValue: medicalRecordServiceSpy },
				{ provide: JournalService, useValue: journalRecordServiceSpy },
				{ provide: EpisodeService, useValue: episodeServiceSpy },
				{ provide: AuthService, useValue: authServiceSpy }
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
