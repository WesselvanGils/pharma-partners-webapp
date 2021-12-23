import { ComponentFixture, TestBed } from "@angular/core/testing"
import { of } from "rxjs"
import { Episode } from "src/app/models/episode.model"
import { Journal } from "src/app/models/journal.model"
import { EpisodeService } from "../patient-episode/episode.service"
import { JournalService } from "./journal.service"

import { PatientJournalComponent } from "./patient-journal.component"

describe("PatientJournalComponent", () =>
{
	let component: PatientJournalComponent
	let fixture: ComponentFixture<PatientJournalComponent>
	let journalServiceSpy
	let episodeServiceSpy

	const expectedJournal: Journal[] =
	[{
		_id: undefined,
		ICPC: undefined,
		SOEP:
		{
			S: undefined,
			O: undefined,
			E: undefined,
			P: undefined
		},
		characteristics: undefined,
		consult: undefined,
		publicationDate: undefined
	}]

	const expectedEpisode: Episode =
	{
		_id: undefined,
		ICPC: undefined,
		description: undefined,
		priority: undefined,
		publicationDate: undefined,
		startDate: undefined,
		journals: undefined
	}

	beforeEach(async () =>
	{
		journalServiceSpy = jasmine.createSpyObj("JournalService", ["currentJournal"])
		episodeServiceSpy = jasmine.createSpyObj("EpisodeService", ["currentEpisode"])

		await TestBed.configureTestingModule({
			declarations: [ PatientJournalComponent ],
			providers: [
				{ provide: JournalService, useValue: journalServiceSpy },
				{ provide: EpisodeService, useValue: episodeServiceSpy }
			]
		}).compileComponents()
	})

	beforeEach(() =>
	{
		episodeServiceSpy.currentJournal = of(expectedJournal)
		episodeServiceSpy.currentEpisode = of(expectedEpisode)

		fixture = TestBed.createComponent(PatientJournalComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () =>
	{
		expect(component).toBeTruthy()
	})
})
