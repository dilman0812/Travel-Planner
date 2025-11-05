const express = require("express");
const pg = require("pg-promise")();
const parser = require("body-parser"); //To Read Form Data
const app = express();

app.use(parser.urlencoded({ extended: true })); //To Use Parser
app.set("view engine", "ejs"); //To Use EJS



var username = null;
var name = null;
var userType = null;

//DATABASE CONNECTION URL
const connectionURL =
  "postgresql://retool:JQPjB74gCWVS@ep-aged-queen-a672m1l1.us-west-2.retooldb.com/retool?sslmode=require";
const database = pg(connectionURL); //Connect to DB

app.use(express.static(__dirname + "/public")); // Public Folder To Store Files like JS CSS

app.listen(3000, (req, res) => {
  console.log("SERVER LISTENING AT http://localhost:3000/");
});

app.get("/:state/:name", (req, res) => {
  res.sendFile(__dirname + "/" + req.params.state + "/" + req.params.name); //Open Location
});

app.get("/", (req, res) => {
  //Home Page
  console.log(req.session);
  res.render(__dirname + "/index.ejs");
});

app.get("/plan", (req, res) => {
  //Planner
  console.log(username);
  res.render(__dirname + "/planner.ejs");
});

app.post("/plan", (req, res) => {
  // ON SUBMITTION OF PLANNER FORM
  database
    .multiResult(
      "SELECT * FROM guides WHERE city ILIKE '" +
        req.body.location +
        "' OR state ILIKE '" +
        req.body.location +
        "'; SELECT * FROM locations WHERE city ILIKE '" +
        req.body.location +
        "' OR state ILIKE '" +
        req.body.location +
        "';"
    )
    .then((results) => {
      res.render(__dirname + "/result.ejs", {
        startDate: req.body.start,
        endDate: req.body.end,
        destination: req.body.location,
        guides: results[0]["rows"],
        attractions: results[1]["rows"],
      });
    });
});

app.post(
  "/book::id&email::guideemail&name::guidename&start::startDate&end::endDate",
  (req, res) => {
    //Book Guide
    if (username) {
      database
        .multi(
          "UPDATE guides SET booking_requests = '" +
            username +
            "," +
            name +
            "," +
            req.params.startDate +
            "," +
            req.params.endDate +
            ",Pending Approval;' where aadharno = '" +
            req.params.id +
            "'; UPDATE users SET bookings = '" +
            req.params.guideemail +
            "," +
            req.params.guidename +
            "," +
            req.params.startDate +
            "," +
            req.params.endDate +
            ",Pending Approval;' where email = '" +
            username +
            "';"
        )
        .then(res.redirect("/useraccount"));
    } else {
      res.redirect("/login");
    }
  }
);

app.get("/place::name", (req, res) => {
  // Search For Place
  database
    .query(
      "SELECT * FROM locations WHERE attraction = '" + req.params.name + "'; "
    )
    .then((result) => {
      res.render(__dirname + "/place.ejs", { placeData: result[0] });
    });
});

app.get("/recommendations/:folder/:file", (req, res) => {
  //Open Recommendation Page
  res.sendFile(
    __dirname + "/recommendations/" + req.params.folder + "/" + req.params.file
  );
});

app.get("/login-?:guide?", (req, res) => {
  //User and Guide Login
  if (!req.params.guide) {
    if (!username) {
      //if username empty, ask for login else redirect to accounts page
      res.render(__dirname + "/login.ejs");
    } else {
      res.render(__dirname + "/user.ejs");
    }
  } else {
    if (!username) {
      res.render(__dirname + "/guidelogin.ejs");
    } else {
      res.redirect("/guideaccount");
    }
  }
});

app.post("/guide-register", (req, res) => {
  //Guide Registration
  database
    .query(
      "INSERT INTO guides  (aadharno, guidename,email,password,contactno,languagespoken,availability, charges, state, city) VALUES ('" +
        req.body.aadhar +
        "','" +
        req.body.name +
        "','" +
        req.body.email +
        "','" +
        req.body.password +
        "','" +
        req.body.contact +
        "','" +
        req.body.language +
        "','Available'," +
        req.body.charges +
        ",'" +
        req.body.state +
        "', '" +
        req.body.city +
        "');"
    )
    .catch((error) => {
      console.log(error);
    })
    .then(res.redirect("/login-GUIDE-LOGIN"));
});

app.post("/guide-login", (req, res) => {
  //Render Guide Login
  database
    .query(
      "SELECT password FROM guides WHERE email = '" + req.body.email + "';"
    )
    .then((result) => {
      if (result[0].password == req.body.password) {
        username = req.body.email;
        userType = "guide";
        res.redirect("/guideaccount");
      } else {
        res.redirect("/login-GUIDE-LOGIN");
      }
    });
});

app.get("/guideaccount", (req, res) => {
  //Guide Account Page
  if (username) {
    database
      .query("SELECT * FROM guides WHERE email = '" + username + "';")
      .then((result) => {
        result = result[0];
        res.render(__dirname + "/guide.ejs", {
          guideEmail: result.email,
          name: result.guidename,
          number: result.contactno,
          city: result.city,
          state: result.state,
          aadhar: result.aadharno,
          languageSpoken: result.languagespoken,
          charge: result.charges,
          requests: result.booking_requests,
        });
      });
  } else {
    res.redirect("/login-guide");
  }
});

app.post("/user-register", (req, res) => {
  // Register User Form
  database
    .query(
      "INSERT INTO users  (name,email,password) VALUES ('" +
        req.body.name +
        "','" +
        req.body.email +
        "','" +
        req.body.password +
        "');"
    )
    .catch((error) => {
      console.log(error);
    })
    .then(res.redirect("/login"));
});

app.post("/user-login", (req, res) => {
  //Login User
  database
    .query(
      "SELECT password,name FROM users WHERE email = '" + req.body.email + "';"
    )
    .then((result) => {
      console.log(result);
      if (result[0].password == req.body.password) {
        username = req.body.email;
        name = result[0].name;
        userType = "user";
        res.redirect("/useraccount");
      } else {
        res.redirect("/login");
      }
    });
});

app.get("/account", (req, res) => {
  if (userType == "user") {
    res.redirect("/useraccount");
  } else if (userType == "guide") {
    res.redirect("/guideaccount");
  } else {
    res.redirect("/login");
  }
});

app.get("/useraccount", (req, res) => {
  //Open user Account
  if (username) {
    database
      .query("SELECT * FROM users WHERE email = '" + username + "';")
      .then((result) => {
        result = result[0];
        res.render(__dirname + "/user.ejs", {
          username: result.name,
          userEmail: result.email,
          requests: result.bookings,
        });
      });
  } else {
    res.redirect("/login");
  }
});

app.post("/logout", (req, res) => {
  username = null;
  name = null;
  userType = null;
  res.redirect("/login");
});

app.post("/approveRequest::useremail::guideemail", (req, res) => {
  database
    .multi(
      "SELECT booking_requests FROM guides WHERE email = '" +
        req.params.guideemail +
        "'; SELECT bookings FROM users WHERE email = '" +
        req.params.useremail +
        "';"
    )
    .then((result) => {
      console.log("INSIDE");
      var guidesValues = result[0][0].booking_requests;
      var usersValues = result[1][0].bookings;
      var guideOutput;
      var userOutput;

      guidesValues = guidesValues.split(";");
      for (var i = 0; i < guidesValues.length - 1; i++) {
        values = guidesValues[i].split(",");
        if (req.params.useremail === values[0]) {
          values[4] = "Approved";
          var temp = values.join(",");
          guidesValues[i] = temp;
          guideOutput = guidesValues.join(";");
          break;
        }
      }

      usersValues = usersValues.split(";");

      for (var i = 0; i < usersValues.length - 1; i++) {
        values = usersValues[i].split(",");

        if (req.params.guideemail === values[0]) {
          values[4] = "Approved";
          var temp = values.join(",");
          console.log(temp);
          usersValues[i] = temp;
          userOutput = usersValues.join(";");
          break;
        }
      }
      database
        .multi(
          "UPDATE users SET bookings = '" +
            userOutput +
            "' WHERE email='" +
            req.params.useremail +
            "'; UPDATE guides SET  booking_requests='" +
            guideOutput +
            "' WHERE email = '" +
            req.params.guideemail +
            "'; UPDATE guides SET availability = 'Booked' WHERE email = '" +
            req.params.guideemail+ "';"
        )
        .then(res.redirect("/account"));
    });
});
