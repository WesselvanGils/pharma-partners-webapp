import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientPrescriptionComponent } from './patient-prescription.component';

describe('PatientPrescriptionComponent', () => {
  let component: PatientPrescriptionComponent;
  let fixture: ComponentFixture<PatientPrescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientPrescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientPrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
