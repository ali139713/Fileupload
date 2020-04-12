const mongoose = require("mongoose");


const MedicineSchema = new mongoose.Schema({
  Name: {
    type: String
  },
  Price: {
    type: String
  },
  Availability: {
    type: String
  },
  Image: {
    type: String
  }

});

module.exports = mongoose.model("Medicine", MedicineSchema);