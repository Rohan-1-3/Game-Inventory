const Game = require("../models/game");
const Developer = require("../models/developer");
const Award = require("../models/award");
const Genre = require("../models/genre");
const GameInstance = require("../models/gameinstance");
const { body, validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");

exports.index = asyncHandler(async (req,res, next)=>{
    const [numGames,
        numDevelopers,
        numAwards,
        numGenres,
        numGameInstances
    ] = await Promise.all([
        Game.countDocuments({}).exec(),
        Developer.countDocuments({}).exec(),
        Award.countDocuments({}).exec(),
        Genre.countDocuments({}).exec(),
        GameInstance.countDocuments({}).exec()
    ]);

    res.render("index", {
        title: "The Ultimate Game Collection",
        game_count : numGames,
        developer_count : numDevelopers,
        award_count : numAwards,
        genre_count : numGenres,
        gameinstance_count : numGameInstances
    })
})

exports.game_list = asyncHandler(async (req, res, next)=>{
    const allGames = await Game.find({})
                                .sort({title: 1})
                                .populate("developer")
                                .populate("genre")
                                .populate("awards").exec();

    console.log(allGames[0])
    res.render("game_list", {
        title: "Game List",
        game_list: allGames
    });
});