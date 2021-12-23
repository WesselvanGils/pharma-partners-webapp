import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientEpisodeComponent } from './patient-episode.component';

describe('PatientEpisodeComponent', () => {
  let component: PatientEpisodeComponent;
  let fixture: ComponentFixture<PatientEpisodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatientEpisodeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
