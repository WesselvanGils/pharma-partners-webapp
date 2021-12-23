import { ComponentFixture, TestBed } from "@angular/core/testing"
import { Router } from "@angular/router"
import { of } from "rxjs"
import { AuthService } from "src/app/core/auth/auth.service"
import { Appointment } from "src/app/models/appointment.model"
import { Patient } from "src/app/models/patient.model"
import { role, User } from "src/app/models/user.model"
import { CalendarService } from "../calendar/calendar.service"

import { HomepageComponent } from "./homepage.component"

const expectedUserData: User =
{
	_id: "123",
	doctorCode: "",
	email: "test@test.nl",
	employeeCode: "",
	firstName: "test",
	lastName: "test",
	role: role.ADMIN,
	token: "123"
}

const expectedPatientData: Patient =
{
	_id: "123",
	BSN: "666",
	adress: "Teststraat 44",
	dateofbirth: new Date("25-06-2020"),
	firstName: "Test",
	lastName: "Straat",
	prefix: "Dhr",
	gender: "Male",
	patientNumber: "222",
	phonenumber: "0626969696",
	medicalrecord: undefined

}

const expectedMeetingData: Appointment[] =
[
	{
		_id: "123",
		employee: expectedUserData,
		patient: expectedPatientData,
		description: "Buikpijn",
		meeting: 
		{
			id: "456",
			title: "test",
			start: new Date(),
			end: new Date()
		}
	}
]


describe("HomepageComponent", () =>
{
	let authServiceSpy
	let calendarServiceSpy
	let routerSpy

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
				{ provide: Router, useValue: routerSpy },
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: CalendarService, useValue: calendarServiceSpy }
			]
		}).compileComponents()
	
	})

	beforeEach(() =>
	{
		authServiceSpy.currentUser$ = of(expectedUserData)
		authServiceSpy.currentUser$.value = of(expectedUserData)
		calendarServiceSpy.list.and.returnValue(of(expectedMeetingData))
		fixture = TestBed.createComponent(HomepageComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	})

	it("should create", () =>
	{
		expect(component).toBeTruthy()
	})
})
