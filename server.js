require('dotenv').config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

const db = require("./app/models");
const Role = db.role;
const RolesLength = db.ROLES.length;

db.mongoose.set('strictQuery', false);
db.mongoose
  .connect(process.env.CONN_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Successfully connected to MongoDB.");
    initRoles();
  })
  .catch(err => {
    console.error("Connection error.", err);
    process.exit();
  });

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}.`);
});

const initRoles = () => {
    Role.estimatedDocumentCount((err, count) => {
        if (!err && count !== RolesLength) {
            console.log('Initializing Roles collection.');
            Role.deleteMany({}, () => {
                Role.insertMany(
                    [
                        { name: 'user' },
                        { name: 'admin' },
                        { name: 'moderator' }
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
}