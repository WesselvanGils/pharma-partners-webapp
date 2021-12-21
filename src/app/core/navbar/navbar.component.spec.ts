import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { role, User } from 'src/app/models/user.model';
import { AuthService } from '../auth/auth.service';

import { NavbarComponent } from './navbar.component';

describe('NavbarComponent', () =>
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

	let component: NavbarComponent;
	let fixture: ComponentFixture<NavbarComponent>;

	beforeEach(async () =>
	{
		authServiceSpy = jasmine.createSpyObj("AuthService", [ "login", "getUserFromLocalStorage" ])
		await TestBed.configureTestingModule({
			declarations: [ NavbarComponent ],
			providers: 
			[
				{ provide: AuthService, useValue: authServiceSpy }
			]
		})
		.compileComponents();
	});

	beforeEach(() =>
	{
		authServiceSpy.getUserFromLocalStorage.and.returnValue(of(expectedUserData))

		fixture = TestBed.createComponent(NavbarComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () =>
	{
		expect(component).toBeTruthy();
	});
});
