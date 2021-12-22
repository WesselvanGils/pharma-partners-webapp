//
// This server will be started by Protractor in end-to-end tests.
// Add your API mocks for your specific project in this file.
//
const { on } = require("events");
const express = require("express");
const port = 3000;

let app = express();
let routes = require("express").Router();


const validEmployeeData = {
    employee: {"_id" :"61b9dcc2b763b8affa81d034","email":"testy@test.nl","roles":"Huisarts","firstName":"Test","lastName":"McTest","doctorCode":"D1","employeeCode":"M1"},
    token:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYWNkNmY1ODZjNjQwMzQ4NDY2MDJlNSIsImlhdCI6MTYzODc5NDM5NCwiZXhwIjoxNjM4ODgwNzk0fQ.oHSyf_cArcgjS9SP6qHjOZQu9fDMrzg6fQKLU9zHISw",
  };


const mockMeeting = [
  {
    _id: "61ba030058e9383c03e2a9b1",
    employee: "61b9dcc2b763b8affa81d034",
    patient: "61ba02f558e9383c03e2a9af",
    meeting: {
      title: "Test Meeting",
      start: { $date: "2021-12-20T09:30:00.000Z" },
      end: { $date: "2021-12-20T10:30:00.000Z" },
    },
  },
];

// Add CORS headers so our external Angular app is allowed to connect
app.use(function (req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", true);
  next();
});

routes.post("/api/authentication/login", (req, res, next) => {
  res.status(200).json(validEmployeeData);
});

routes.post("/api/authentication/validate/:id", (req, res, next) => {
    res.status(200).json(validEmployeeData);
  });

routes.get("/api/meetings", (req, res, next) => {
  res.status(200).json(mockMeeting);
});

//
// Write your own mocking API endpoints here.
//

// Finally add your routes to the app
app.use(routes);

app.use("*", function (req, res, next) {
  next({
    error: "Non-existing endpoint",
  });
});

app.use((err, req, res, next) => {
  res.status(400).json(err);
});

app.listen(port, () => {
  console.log("Mock backend server running on port", port);
});

process.on("uncaughtException", (err) => {
  console.log("There was an uncaught error", err);
  process.exit(1); //mandatory (as per the Node.js docs)
});
