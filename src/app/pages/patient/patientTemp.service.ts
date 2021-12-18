import { Injectable } from "@angular/core";
import { map, Observable, of } from 'rxjs'
import { mockPatients } from "src/app/mocks/patient.mock";
import { Patient } from "src/app/models/patient.model";

@Injectable({
    providedIn: 'root',
})

export class PatientTempService {

    getPatients(): Observable<Patient[]> {
        console.log('patientTempService: fetched patients')
        return of(mockPatients)
    }

    getPatient(id: number | string ) {
        console.log('patientTempService: getPatient')
        return this.getPatients().pipe(
            // (+) before `id` turns the string into a number
            map((patients: Patient[]) => patients.find((patient) => patient._id === +id)!))
    }
}