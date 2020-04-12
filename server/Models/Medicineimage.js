const mongoose = require("mongoose");


const MedicineimageSchema = new mongoose.Schema({
  Image: {
    type: String
  },
 

});

module.exports = mongoose.model("Medicineimage", MedicineimageSchema);