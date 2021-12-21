import { ComponentFixture, TestBed } from "@angular/core/testing"
import { AuthService } from "src/app/core/auth/auth.service"
import { CalendarService } from "../calendar/calendar.service"

import { HomepageComponent } from "./homepage.component"

describe("HomepageComponent", () =>
{
	let authServiceSpy
	let calendarServiceSpy

	let component: HomepageComponent
	let fixture: ComponentFixture<HomepageComponent>

	beforeEach(async () =>
	{
		authServiceSpy = jasmine.createSpyObj("AuthService", ["currentUser"])
		calendarServiceSpy = jasmine.createSpyObj("CalendarService", ["list"])

		await TestBed.configureTestingModule({
			declarations: [ HomepageComponent ],
			imports: [],
			providers: 
			[ 
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: CalendarService, useValue: calendarServiceSpy }
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
