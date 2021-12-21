import { role, User } from "../models/user.model";

export const mockUsers: User[] =
[
    {
        _id: "0",
        doctorCode: "",
        email: "test@test.nl",
        employeeCode: "",
        firstName: "test",
        lastName: "test",
        role: role.ADMIN,
        token: "12345"
    }
]