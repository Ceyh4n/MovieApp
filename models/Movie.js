// model names to start capital letter
// creating and layour for databse data
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieSchema = new Schema({
  director_id: Schema.Types.ObjectId,
  title: {
    type: String,
    required: [true, "{PATH} filed cannot be empty"],
    maxlength: [50, "{PATH} field cannot be more than {MANLENGTH} characters"],
    minlength: [2, "{PATH} field cannot be less than {MINLENGTH} characters"],
  },
  category: {
    type: String,
    maxlength: 30,
    minlength: 3,
  },
  country: {
    type: String,
    maxlength: 50,
    minlength: 3,
  },
  year: {
    type: Number,
    maxlength: 1850,
    minlength: 2100,
  },
  imdb_score: {
    type: Number,
    maxlength: 0,
    minlength: 10,
  },
  created: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("movie", movieSchema);
