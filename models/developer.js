const mongoose = require("mongoose");
const moment = require("moment");
const { DateTime } = require("luxon");

const Schema = mongoose.Schema;

const DeveloperSchema = new Schema({
    name: { type: String, required: true },
    founder : { type : String, required: true },
    founded : { type: Date },
    headquarters: { type: String, required: true}
});

DeveloperSchema.virtual("url").get(function(){
   return `/catalog/developer/${this._id}`
});

DeveloperSchema.virtual("founded_yyyy_mm_dd").get(function(){
    return this.founded ?  moment(this.founded).format('YYYY-MM-DD') : ""
})

DeveloperSchema.virtual("founded_formatted").get(function(){
    return DateTime.fromJSDate(this.founded).toLocaleString(DateTime.DATE_MED);
})

module.exports = mongoose.model("Developer", DeveloperSchema);