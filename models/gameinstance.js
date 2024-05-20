const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const moment = require("moment");
const Schema = mongoose.Schema;

const GameInstanceSchema = new Schema({
    game: { type: Schema.Types.ObjectId, ref: 'Game' },
    status: {
        type: String,
        required: true,
        enum: ["Available", "Maintenance", "Loaned", "Reserved"],
        default: "Maintenance",
    },
    due_back: { type: Date, default: Date.now },
});

GameInstanceSchema.virtual("url").get(function(){
    return `/catalog/gameinstance/${this._id}`
});

GameInstanceSchema.virtual("due_back_yyyy_mm_dd").get(function(){
    return this.due_back ?  moment(this.due_back).format('YYYY-MM-DD') : "";
});

GameInstanceSchema.virtual("due_back_formatted").get(function () {
    return DateTime.fromJSDate(this.due_back).toLocaleString(DateTime.DATE_MED);
});

module.exports = mongoose.model("GameInstance", GameInstanceSchema);