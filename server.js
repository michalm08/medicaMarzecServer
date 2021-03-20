const express = require("express");
const connectDB = require("./db.js");
const app = express();
const bodyParser = require("body-parser");

app.use(bodyParser.json({ limit: "10mb", extended: true }));
// app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
//cors
var cors = require("cors");
app.use(cors());

connectDB();

app.get("/", (req, res) => res.send("API Running :)"));
// app.use("/", (req, res) => res.send("API Running"));

//middleware czy jakos inaczej to nazwijj ale jest po to zeby moz brac rzeczy z req
app.use(express.json({ extended: false }));

//Define Routes
app.use("/api/patients", require("./routes/patients.js"));
app.use("/api/doctors", require("./routes/doctors.js"));
app.use("/api/users", require("./routes/users.js"));
app.use("/api/visits", require("./routes/visits.js"));
app.use("/api/clinic", require("./routes/clinic.js"));

app.get("/", (req, res) => {
  res.send("hollo in medicamarzec api");
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is working at ${PORT}`));
