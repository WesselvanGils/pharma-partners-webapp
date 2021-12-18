import { TestBed } from '@angular/core/testing'
import { Observable, of } from 'rxjs'
import { HttpClient } from '@angular/common/http'
import { Receipt } from 'src/app/models/receipt.model';
import { Medication } from 'src/app/models/medication.model';
import { MedicationService } from './medication.service';

const MEDICATIONS: Medication[]  = [
    {
      _id: "61ba02f558e9383c03e2a9af",
      name: 'Ibuprofen',
      unit: '500 MG 20 ST',
}]




describe('ReceiptService', () => {
  let medicationService: MedicationService
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    medicationService = TestBed.inject(MedicationService);
    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(medicationService).toBeTruthy()
  })

  //
  //
  it('should return a list of movies', (done: DoneFn) => {
    httpSpy.get.and.returnValue(of(MEDICATIONS));

    medicationService.list().subscribe((medications: Medication[]) => {
      expect(medications.length).toBe(1);
      expect(medications[0]._id).toEqual(MEDICATIONS[0]._id);
      done();
    });
  });
});