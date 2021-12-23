import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDiagnosticComponent } from './patient-diagnostic.component';

describe('PatientDiagnosticComponent', () => {
  let component: PatientDiagnosticComponent;
  let fixture: ComponentFixture<PatientDiagnosticComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientDiagnosticComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDiagnosticComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
