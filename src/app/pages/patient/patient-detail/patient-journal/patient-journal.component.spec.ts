import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EpisodeService } from '../episode.service';
import { JournalService } from './journal.service';

import { PatientJournalComponent } from './patient-journal.component';

describe('PatientJournalComponent', () => {
  let component: PatientJournalComponent;
  let fixture: ComponentFixture<PatientJournalComponent>;
  let JournalServiceSpy;
  let EpisodeServiceSpy;

  beforeEach(async () => {
  
    await TestBed.configureTestingModule({
      declarations: [ PatientJournalComponent ],
      providers: [
				{ provide: JournalService, useValue: JournalServiceSpy },
				{ provide: EpisodeService, useValue: EpisodeServiceSpy },
      ],
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
