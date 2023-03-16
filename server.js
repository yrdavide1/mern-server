require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5002;
const db = require("./app/models");
const Role = db.role;
const RolesLength = db.ROLES.length;
const Country = db.country;
const CountriesLength = db.COUNTRIES.length;

db.mongoose.set('strictQuery', false);
db.mongoose
  .connect(process.env.CONN_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initRoles();
    initCountries();
  })
  .catch(err => {
    console.error("Connection error.", err);
    process.exit();
  });

require("./app/routes/auth.routes")(app);
require("./app/routes/record.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/country.routes")(app);

app.listen(port, () => {
  console.log(`Server is running on port ${port}.`);
});

module.exports = app;

const initRoles = () => {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count !== RolesLength) {
            console.log('Initializing Roles collection.');
            Role.deleteMany({}, () => {
                Role.insertMany(
                    [
                        { name: 'user' },
                        { name: 'admin' }
                    ],
                    () => {
                        console.log('Roles collection initialized.');
                    }
                );
            });
        } else if (!err && count > 0) {
            console.log('Roles collection already initialized.');
        }
    });
};

const initCountries = () => {
  Country.estimatedDocumentCount((err, count) => {
    if (!err && count !== CountriesLength) {
      console.log('Initializing Countries collection.');
      Country.deleteMany({}, () => {
        Country.insertMany(
          db.COUNTRIES,
          () => {
            console.log('Countries collection initialized.');
          }
        );
      });
    } else if (!err && count > 0) {
      console.log('Countries collection already initialized.');
    }
  });
};