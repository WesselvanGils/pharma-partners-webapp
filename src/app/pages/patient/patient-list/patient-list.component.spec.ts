import { Directive, HostListener, Input } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { DataTablesModule } from 'angular-datatables';
import { of } from 'rxjs';
import { Patient } from 'src/app/models/patient.model';
import { PatientService } from '../patient.service';
import { PatientListComponent } from './patient-list.component';
@Directive({
	selector: '[routerLink]',
})
export class RouterLinkStubDirective
{
	@Input('routerLink') linkParams: any;
	navigatedTo: any = null;
	@HostListener('click')
	onClick(): void
	{
		this.navigatedTo = this.linkParams;
	}
}
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
describe('PatientListComponent', () =>
{
	let component: PatientListComponent;
	let fixture: ComponentFixture<PatientListComponent>;
	let patientServiceSpy
	let routerSpy
	beforeEach(() =>
	{
		patientServiceSpy = jasmine.createSpyObj('PatientService', [ 'list' ])
		routerSpy = jasmine.createSpyObj('Router', [ 'navigateByUrl' ])
		TestBed.configureTestingModule({
			declarations: [
				PatientListComponent,
				RouterLinkStubDirective
			],
			imports: [
				NgbNavModule,
				DataTablesModule
			],
			providers: [
				{ provide: Router, useValue: routerSpy },
				{ provide: PatientService, useValue: patientServiceSpy },
				{
					provide: ActivatedRoute,
					useValue: {
						paramMap: of(
							convertToParamMap({
								_id: 'some_id'
							})
						)
					}
				}
			]
		}).compileComponents();
		fixture = TestBed.createComponent(PatientListComponent);
		component = fixture.componentInstance;
	});
	afterEach(() =>
	{
		fixture.destroy()
	})
	it('should create', () =>
	{
		expect(component).toBeTruthy();
	});
	it('should have a list of patients', (done) =>
	{
		patientServiceSpy.list.and.returnValue(of(PATIENTS));
		fixture.detectChanges();
		expect(component).toBeTruthy();
		patientServiceSpy.list().subscribe((patient) => expect(patient).toEqual(PATIENTS))
		done();
	})
});