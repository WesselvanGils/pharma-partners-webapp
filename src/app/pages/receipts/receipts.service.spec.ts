import { TestBed } from '@angular/core/testing'

import { Observable, of } from 'rxjs'

import { HttpClient } from '@angular/common/http'
import { ReceiptService } from './receipts.service';
import { Receipt } from 'src/app/models/receipt.model';
import { Medication } from 'src/app/models/medication.model';

const medicationIbuprofen: Medication = 
    {
      _id: "61ba02f558e9383c03e2a9af",
      name: 'Ibuprofen',
      unit: '500 MG 20 ST',
      }

  const RECEIPTS: Receipt[] = [
    {
      _id: "61ba02f558e9383c03e2a9af",
      dosage: '5x per dag',
      preparation: '1201',
      publicationDate: new Date("1999-07-4"),
      daysToTake: 2,
      medication: medicationIbuprofen
      }]


describe('ReceiptService', () => {
  let ReceiptServices: ReceiptService
  let httpSpy: jasmine.SpyObj<HttpClient>;

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [{ provide: HttpClient, useValue: httpSpy }],
    });
    ReceiptServices = TestBed.inject(ReceiptService);
    httpSpy = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
  });

  it('should be created', () => {
    expect(ReceiptServices).toBeTruthy()
  })

  //
  //
  it('should return a list of movies', (done: DoneFn) => {
    httpSpy.get.and.returnValue(of(RECEIPTS));

    ReceiptServices.list().subscribe((receipts: Receipt[]) => {
      expect(receipts.length).toBe(1);
      expect(receipts[0]._id).toEqual(RECEIPTS[0]._id);
      done();
    });
  });
});
