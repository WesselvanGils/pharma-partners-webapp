import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { role, User } from 'src/app/models/user.model';
import { CalendarService } from '../calendar.service';

import { AppointmentComponent } from './appointment.component';
import { AppointmentService } from './appointment.service';


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

describe('AppointmentComponent', () => {
  let CalendarServiceSpy;
  let AppointmentServiceSpy;
  let authServiceSpy;

  let component: AppointmentComponent;
  let fixture: ComponentFixture<AppointmentComponent>;

  beforeEach(async () => {
    AppointmentServiceSpy = jasmine.createSpyObj("AppointmentService", ["list"])
		CalendarServiceSpy = jasmine.createSpyObj("CalendarService", ["list"])
		authServiceSpy = jasmine.createSpyObj("AuthService", ["currentUser"])
	

    await TestBed.configureTestingModule({
      declarations: [AppointmentComponent],
      providers:
			[
				{ provide: AppointmentService, useValue: AppointmentServiceSpy },
				{ provide:  CalendarService, useValue: CalendarServiceSpy },
        { provide: AuthService, useValue: authServiceSpy }
			]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppointmentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
