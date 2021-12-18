import { Patient } from "../models/patient.model";

export const mockPatients: Patient[] =
[
    {
        _id: 1,
        BSN: "12345678912345",
        firstname:"testpatient",
        lastname:"last",
        adress:"street 123",
        prefix:"prefix",
        patientNumber:"5",
        gender:"male",
        dateofbirth:new Date('12-12-2021'),
        phonenumber:"+31612345678"
    }
]