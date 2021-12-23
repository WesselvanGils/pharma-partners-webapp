import { ComponentFixture, TestBed } from "@angular/core/testing"
import { ActivatedRoute, convertToParamMap } from "@angular/router"
import { of } from "rxjs"
import { AuthService } from "src/app/core/auth/auth.service"
import { Patient } from "src/app/models/patient.model"
import { CalendarService } from "../../calendar/calendar.service"
import { PatientService } from "../patient.service"
import { DiagnosticService } from "./patient-diagnostic/diagnostic.service" 
import { EpisodeService } from "./patient-episode/episode.service" 
import { MeasurementService } from "./patient-diagnostic/measurement.service" 
import { MedicalRecordService } from "./medicalRecord.service"
import { MedicationService } from "./patient-prescription/medication.service"

import { PatientDetailComponent } from "./patient-detail.component"
import { PrescriptionService } from "./patient-prescription/prescription.service"

describe("PatientDetailComponent", () =>
{
	const PATIENTS: Patient[] = [
		{
			_id: 'some_id',
			prefix: 'mw',
			firstName: 'Jane',
			lastName: 'Doe',
			BSN: '123456789',
			adress: 'Straatnaam 1',
			patientNumber: '2173624',
			gender: 'Vrouw',
			dateofbirth: new Date(),
			phonenumber: '+3612345678',
			medicalrecord: undefined
		},
	];

	let component: PatientDetailComponent
	let fixture: ComponentFixture<PatientDetailComponent>

	let patientServiceSpy
	let authServiceSpy
	let CalendarServiceSpy

	beforeEach(async () =>
	{
		patientServiceSpy = jasmine.createSpyObj("PatientService", ["list"])

		await TestBed.configureTestingModule({
			declarations: [ PatientDetailComponent ],
			providers: [
				{ provide: PatientService, useValue: patientServiceSpy },
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: CalendarService, useValue: CalendarServiceSpy },
				{ provide: ActivatedRoute, useValue: {
					paramMap: of(
						convertToParamMap({_id: "some_id"})
					)
				}}
			]
		}).compileComponents()
	})

	beforeEach(() =>
	{
		fixture = TestBed.createComponent(PatientDetailComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () =>
	{
		expect(component).toBeTruthy()
	})
})
