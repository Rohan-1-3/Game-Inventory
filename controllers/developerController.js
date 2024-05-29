const Game = require("../models/game");
const Developer = require("../models/developer");
const Award = require("../models/award");
const Genre = require("../models/genre");
const GameInstance = require("../models/gameinstance");
const { body, validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.developer_list = asyncHandler(async (req,res,next)=>{
    const allDevelopers = await Developer.find({}).sort({name: 1});

    res.render("developer_list",{
        title: "Developers List",
        developers: allDevelopers,
    });
});

exports.developer_detail = asyncHandler(async (req, res, next)=>{
    const [developer, games] = await Promise.all([
        Developer.findById(req.params.id).exec(),
        Game.find({developer: req.params.id}).exec(),
    ])

    if(developer === null){
        const err = new Error("Developer not found");
        err.status = 404;
        return next(err);
    }

    res.render("developer_detail",{
        name: developer.name,
        developer: developer,
        games: games,
    });
});

