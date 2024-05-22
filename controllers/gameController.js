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

exports.game_detail = asyncHandler(async (req, res, next)=>{
    const [game, gameinstance] = await Promise.all([
        Game.findById(req.params.id)
            .populate("developer")
            .populate("genre")
            .populate("awards").exec(),
        GameInstance.find({game: req.params.id}).exec(),
    ]);

    if(game === null){
        const err = new Error("Game not Found");
        err.status = 404;
        return next(err);
    }

    res.render("game_detail", {
        title: game.title,
        game: game,
        gameinstances: gameinstance

    });
});

exports.game_create_get = asyncHandler(async (req, res, next)=>{
    const [allDevelopers, allAwards, allGenres] = await Promise.all([
        Developer.find().sort({name: 1}).exec(),
        Award.find().sort({name: 1}).exec(),
        Genre.find().sort({name: 1}).exec(),
    ]);

    const platforms = [
        { name: "Nintendo Switch", id: "4" },
        { name: "PlayStation", id: "5" },
        { name: "Xbox", id: "6" },
        { name: "Mobile", id: "7" },
        { name: "PC" ,id : "2"}
      ];

      console.log(platforms)
    res.render("game_form",{
        title: "Game Form",
        developers_list: allDevelopers,
        awards_list: allAwards,
        genres_list: allGenres,
        platforms_list: platforms
    });
});