import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientJournalComponent } from './patient-journal.component';

describe('PatientJournalComponent', () => {
  let component: PatientJournalComponent;
  let fixture: ComponentFixture<PatientJournalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientJournalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientJournalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
