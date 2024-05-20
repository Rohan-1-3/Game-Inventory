const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AwardSchema = new Schema({
    name : {type: String, required: true, minLength: 10, maxLength: 100},
});

AwardSchema.virtual("url").get(function(){
    return `/catalog/award/${this._id}`;
});

module.exports = mongoose.model("Award", AwardSchema);