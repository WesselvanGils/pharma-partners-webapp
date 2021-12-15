import { role, User } from "../models/user.model";

export const mockUsers: User[] =
[
    {
        _id: "0",
        doctorPrefix: "",
        email: "test@test.nl",
        employeePrefix: "",
        firstName: "test",
        lastName: "test",
        role: role.ADMIN,
        token: "12345"
    }
]