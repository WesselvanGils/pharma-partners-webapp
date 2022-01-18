import { ComponentFixture, TestBed } from "@angular/core/testing"
import { MedicalRecordService } from "../medicalRecord.service"
import { JournalService } from "../patient-journal/journal.service"
import { EpisodeService } from "./episode.service"
import { PatientEpisodeComponent } from "./patient-episode.component"

describe("PatientEpisodeComponent", () =>
{
	let episodeServiceSpy
	let journalServiceSpy
	let medicalRecordServiceSpy

	let component: PatientEpisodeComponent
	let fixture: ComponentFixture<PatientEpisodeComponent>

	beforeEach(async () =>
	{
		episodeServiceSpy = jasmine.createSpyObj("EpisodeService", ["list"])
		journalServiceSpy = jasmine.createSpyObj("JournalService", ["list"])
		medicalRecordServiceSpy = jasmine.createSpyObj("MedicalRecordService", ["list"])

		await TestBed.configureTestingModule({
			declarations: [ PatientEpisodeComponent ],
			providers: 
			[
				{ provide: EpisodeService, useValue: episodeServiceSpy },
				{ provide: JournalService, useValue: journalServiceSpy },
				{ provide: MedicalRecordService, useValue: medicalRecordServiceSpy}
			]	
		}).compileComponents()
	})

	beforeEach(() =>
	{
		fixture = TestBed.createComponent(PatientEpisodeComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () =>
	{
		expect(component).toBeTruthy()
	})
})
