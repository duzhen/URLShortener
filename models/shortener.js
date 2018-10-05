const mongoose = require("mongoose");

var shortenerSchema = new mongoose.Schema({
    base: String,
    original: String,
    code: String
});

var model = mongoose.model('shortener', shortenerSchema);

module.exports = model;