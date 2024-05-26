const mongoose = require("mongoose");
const moment = require("moment");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: {type: String, required: true},
    yearReleased: {type: Date, require: true},
    developer : {type: Schema.Types.ObjectId, ref: "Developer", required: true},
    genre: [{type: Schema.Types.ObjectId, ref: "Genre"}],
    awards: [{type: Schema.Types.ObjectId, ref: "Award"}],
    platform: [{type: String, required: true}],
    summary: {type: String, required: true},
    coverPage: {type: String},
});

GameSchema.virtual("url").get(function(){
    return `/catalog/game/${this._id}`
});

GameSchema.virtual("year_yyyy_mm_dd").get(function(){
    return this.yearReleased ?  moment(this.yearReleased).format('YYYY-MM-DD') : ""
});

GameSchema.virtual("year_formatted").get(function(){
    return DateTime.fromJSDate(this.yearReleased).toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model("Game", GameSchema);