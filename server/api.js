const User = require("./Models/User");
const UserSession = require('./Models/Usersession');
const Medicine = require('./Models/Medicine');
const Medicineimage = require('./Models/Medicineimage');
const PORT = 4000;
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const path = require('path');

app.use(express.static(__dirname + './public/'));


var Storage = multer.diskStorage({
  destination: './public/Uploads/',

  filename: function (req, file, callback) {

    callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
})

var upload = multer({
  storage: Storage
}).single('Image');

app.use(express.json());
app.use(cors());
app.use(bodyParser.json());


app.listen(PORT, function () {
  console.log("Server is running on Port: " + PORT);
});

mongoose.connect('mongodb://127.0.0.1:27017/User', {
  useNewUrlParser: true
});
const connection = mongoose.connection;

connection.once('open', function () {
  console.log("MongoDB database connection established successfully");
})

/// Image Upload ///

app.post('/api/upload', upload, function (req, res, next) {

  var imageFile = req.file.filename;
  var success = req.file.filename + "Uploaded Successfully";



            res.sendStatus(201);
            

  var imageDetails = new Medicineimage({
    Image: imageFile
  });

  imageDetails.save(function (err, doc) {

      if (err) {throw err};

     return res.json( doc
            =>
        console(doc)
              );
    
    })

  
});






app.post("/api/account/signup", (req, res, next) => {
  const {
    body
  } = req;
  const {
    firstName,
    lastName,
    password
  } = body;
  let {
    email
  } = body; // needs to be mutable unlike above

  if (!firstName) {
    return res.send({
      success: false,
      mes: "Error: First name cannot be blank."
    });
  }

  if (!lastName) {
    return res.send({
      success: false,
      mes: "Error: Last name cannot be blank."
    });
  }

  if (!email) {
    return res.send({
      success: false,
      mes: "Error: Email name cannot be blank."
    });
  }

  if (!password) {
    return res.send({
      success: false,
      mes: "Error: Password name cannot be blank."
    });
  }

  email = email.toLowerCase(); // email should always go in db in lowercase form

  /**
   * Steps:
   * 1. Verify email doesn't exists
   * 2. Save
   */
  User.find({
      email
    },
    (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          mes: "Error: Server error."
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          mes: "Error: Account already exists."
        });
      }

      // Save the new user
      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName;
      newUser.lastName = lastName;
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            mes: "Error: Server error."
          });
        }

        return res.send({
          success: true,
          mes: "Signed up."
        });
      });
    }
  );
});

app.post("/api/account/signin", (req, res, next) => {
  const {
    body
  } = req;
  const {
    password
  } = body;
  let {
    email
  } = body; // needs to be mutable unlike above

  if (!email) {
    return res.send({
      success: false,
      mes: "Error: Email name cannot be blank."
    });
  }

  if (!password) {
    return res.send({
      success: false,
      mes: "Error: Password name cannot be blank."
    });
  }

  email = email.toLowerCase();

  /**
   * Find the user in the DB with the given email
   */
  User.find({
      email
    },
    (err, users) => {
      if (err) {
        return res.send({
          success: false,
          mes: "Error: Server error #0."
        });
      }
      // if there are zero users found (there cannot be more than one user found--it's impossible)
      if (users.length != 1) {
        return res.send({
          success: false,
          mes: "Error: Invalid"
        });
      }

      /**
       * Check the user's password
       */
      const user = users[0];
      // if invalid password
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          mes: "Error: Invalid"
        });
      }

      // otherwise, create user session
      /**
       * Everytime users log in, they will get a token.
       * The token is generated using the _id property of the new document created on the server.
       * This will verify that they have already successfully logged in.
       * If you feel you need to revoke their access, mark their document to `isDeleted: true`
       */
      let userSession = new UserSession();
      userSession.userId = user._id;
      userSession.save((err, doc) => {
        if (err) {
          return res.send({
            success: false,
            mes: "Error: Server error #1."
          });
        }

        return res.send({
          success: true,
          mes: "Valid sign in.",
          token: doc._id // the _id property that Mongo gives each document by default
        });
      });
    }
  );
});

app.post("/api/account/verify", (req, res, next) => {
  /**
   * 1. Get the token
   * 2. Verify the token is one of a kind and is not deleted
   */

  // get token
  const {
    query
  } = req;
  const {
    token
  } = query; //?token=test

  // Verify the token is one of a kind and is not deleted
  UserSession.find({
      _id: token,
      isDeleted: false
    },
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          mes: "Error: Server error"
        });
      }

      if (sessions.length != 1) {
        return res.send({
          success: false,
          mes: "Error: Invalid"
        });
      } else {
        return res.send({
          success: true,
          mes: "Good"
        });
      }
    }
  );
});

app.post("/api/account/logout", (req, res, next) => {
  const {
    query
  } = req;
  const {
    token
  } = query; //?token=test

  // Verify the token is one of a kind and is not deleted
  UserSession.findOneAndUpdate({
      _id: token,
      isDeleted: false
    }, {
      $set: {
        isDeleted: true
      }
    },
    null,
    (err, sessions) => {
      if (err) {
        return res.send({
          success: false,
          mes: "Error: Server error."
        });
      }

      // if there aren't any documents found by that token
      if (sessions.length != 1) {
        return res.send({
          success: false,
          mes: "Error: Invalid token."
        });
      }

      // otherwise, everything went fine 
      return res.send({
        success: true,
        mes: "Good"
      });
    }
  );
});