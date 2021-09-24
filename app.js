const express = require("express");
const cors = require("cors");
const connectDB = require("./config/DBConfig");

const app = express();
const PORT = process.env.PORT || 5000;

if(process.env.NODE_ENV === "development") {
    require("dotenv").config();
}

connectDB();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use("/api/users", require("./routes/user.route"));
app.use("/api/auth", require("./routes/auth.route"));
// app.use("/api/contacts", require("./routes/contact.route"));

app.get("/", (req, res) => {
    res.json({message: "Working Fine"});
})

app.listen(PORT, () => {
    console.log(`Server Running at ${PORT} PORT`);
});