import { ComponentFixture, TestBed } from "@angular/core/testing"
import { Router } from "@angular/router"
import { of } from "rxjs"
import { role, User } from "src/app/models/user.model"
import { AuthService } from "../auth.service"

import { LoginComponent } from "./login.component"

describe("LoginComponent", () =>
{
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

	let authServiceSpy
	let routerSpy

	let component: LoginComponent
	let fixture: ComponentFixture<LoginComponent>

	beforeEach(async () =>
	{
		authServiceSpy = jasmine.createSpyObj("AuthService", [ "login", "getUserFromLocalStorage" ])
		routerSpy = jasmine.createSpyObj("Router", [ "navigate" ])

		await TestBed.configureTestingModule({
			declarations: [ LoginComponent ],
			imports: [],
			providers: 
			[
				{ provide: AuthService, useValue: authServiceSpy },
				{ provide: Router, useValue: routerSpy }
			]
		}).compileComponents()
	})

	beforeEach(() =>
	{
		authServiceSpy.currentUser$ = of(expectedUserData)
		authServiceSpy.getUserFromLocalStorage.and.returnValue(of(expectedUserData))

		fixture = TestBed.createComponent(LoginComponent)
		component = fixture.componentInstance
		fixture.detectChanges()
	})

	it("should create", () =>
	{
		expect(component).toBeTruthy()
	})
})
