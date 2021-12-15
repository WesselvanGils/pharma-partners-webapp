import { ComponentFixture, TestBed } from "@angular/core/testing"
import { LoggingService } from "src/app/shared/logging.service"

import { HomepageComponent } from "./homepage.component"

describe("HomepageComponent", () =>
{
	let loggingServiceSpy

	let component: HomepageComponent
	let fixture: ComponentFixture<HomepageComponent>

	beforeEach(async () =>
	{
		loggingServiceSpy = jasmine.createSpyObj("LoggingService", [ "log" ])

		await TestBed.configureTestingModule({
			declarations: [ HomepageComponent ],
			imports: [],
			providers: 
			[ 
				{ provide: LoggingService, useValue: loggingServiceSpy}
			]
		}).compileComponents()
	})

	beforeEach(() =>
	{
		fixture = TestBed.createComponent(HomepageComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () =>
	{
		expect(component).toBeTruthy()
	})
})
