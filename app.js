//npm requires
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");
const { static } = require("express");
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(static("public"));

//Sending main page of website to client
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

//getting from client data, storing it to the JSON string and sending it to the mailchimp.
app.post("/", function (req, res) {
  const fName = req.body.fName;
  const lName = req.body.lName;
  const email = req.body.email;
  //creating a object with right format (structure) for mailchimp
  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: { FNAME: fName, LNAME: lName },
      },
    ],
  };

  //Creating string from data in right format with JSON
  var jsonData = JSON.stringify(data);

  const url = "https://us10.api.mailchimp.com/3.0/lists/91a6271c38";
  const options = {
    method: "POST",
    auth: "************************myKey***************************",
  };

  const request = https.request(url, options, function (response) {
    response.on("data", function (data) {
      if (response.statusCode === 200)
        res.sendFile(__dirname + "/success.html");
      else res.sendFile(__dirname + "/failure.html");
    });
  });
  request.write(jsonData);
  request.end();
});

app.post("/failure.html", function (req, res) {
  res.redirect("/");
});

app.listen(process.env.PORT, function (req, res) {
  console.log("Server started port 3000");
});

//           eb7859110ccd6f34b65b3ad3073bab1f-us10
//           91a6271c38
