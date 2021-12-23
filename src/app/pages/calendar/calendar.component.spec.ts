import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { Appointment } from 'src/app/models/appointment.model';
import { Patient } from 'src/app/models/patient.model';
import { role, User } from 'src/app/models/user.model';

import { CalendarComponent } from './calendar.component';
import { CalendarService } from './calendar.service';

describe('CalendarComponent', () =>
{
	const expectedMeetingData: Appointment[] =
	[
		{
			_id: "123",
			employee: undefined,
			patient: undefined,
			description: undefined,
			meeting: 
			{
				id: "456",
				title: "test",
				start: new Date(),
				end: new Date()
			}
		}
	]

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

	let calendarServiceSpy
	let authServiceSpy

	let component: CalendarComponent;
	let fixture: ComponentFixture<CalendarComponent>;

	beforeEach(async () =>
	{
		calendarServiceSpy = jasmine.createSpyObj("CalendarService", ["list"])
		authServiceSpy = jasmine.createSpyObj("AuthService", ["currentUser"])

		await TestBed.configureTestingModule({
			declarations: [ CalendarComponent ],
			providers: 
			[
				{ provide: CalendarService, useValue: calendarServiceSpy },
				{ provide: AuthService, useValue: authServiceSpy }
			]
		})
		.compileComponents();
	});

	beforeEach(() =>
	{
		authServiceSpy.currentUser$ = of(expectedUserData)
		authServiceSpy.currentUser$.value = of(expectedUserData)
		calendarServiceSpy.list.and.returnValue(of(expectedMeetingData))
		fixture = TestBed.createComponent(CalendarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () =>
	{
		expect(component).toBeTruthy();
	});
});
