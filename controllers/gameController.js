const Game = require("../models/game");
const Developer = require("../models/developer");
const Award = require("../models/award");
const Genre = require("../models/genre");
const GameInstance = require("../models/gameinstance");
const { body, validationResult} = require("express-validator");
const asyncHandler = require("express-async-handler");

const platforms = [
    { name: "Nintendo Switch", id: "4" },
    { name: "PlayStation", id: "5" },
    { name: "Xbox", id: "6" },
    { name: "Mobile", id: "7" },
    { name: "PC" ,id : "2"}
];

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

    res.render("game_form",{
        title: "Game Form",
        developers_list: allDevelopers,
        awards_list: allAwards,
        genres_list: allGenres,
        platforms_list: platforms
    });
});

exports.game_create_post = [
    (req, res, next) => {
        if(!Array.isArray(req.body.genre)){
            req.body.genre = typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        if(!Array.isArray(req.body.award)){
            req.body.award = typeof req.body.award === "undefined" ? [] : [req.body.award];
        }
        if(!Array.isArray(req.body.platform)){
            req.body.platform = typeof req.body.platform === "undefined" ? [] : [req.body.platform];
        }
        next();
    },

    body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('yearReleased', 'Year Released must not be empty and should be a valid date.')
        .trim()
        .isISO8601().toDate(),
    body('developer', 'Developer must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('genre.*').escape(),
    body('summary', 'Summary must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('award.*').escape(),
    body('coverPage').optional({ checkFalsy: true }).trim().isURL(),
    body('platform.*').escape(),

    asyncHandler(async (req, res, next)=>{
        const errors = validationResult(req);

        const game = new Game({
            title : req.body.title,
            yearReleased: req.body.yearReleased,
            developer : req.body.developer,
            genre: req.body.genre,
            awards: req.body.awards,
            platform : req.body.platform,
            summary : req.body.summary,
            coverPage: req.body.coverPage
        })

        if(!errors.isEmpty()){

            const [allDevelopers, allAwards, allGenres] = await Promise.all([
                Developer.find().sort({name: 1}).exec(),
                Award.find().sort({name: 1}).exec(),
                Genre.find().sort({name: 1}).exec(),
            ]);

            for(const genre of allGenres){
                if(game.genre.includes(genre._id)){
                    genre.checked = "true";
                }
            }

            for(const award of allAwards){
                if(game.awards.includes(genre._id)){
                    award.checked = "true";
                }
            }

            res.render("game_form", {
                title: "Game Form",
                developers_list: allDevelopers,
                awards_list: allAwards,
                genres_list: allGenres,
                errors: errors.array()
            });
        }else{
            await game.save();
            res.redirect(game.url);
        }
    })
];

exports.game_delete_get = asyncHandler(async (req, res,next)=>{
    const [game, allGameInstance] = await Promise.all([
        Game.findById(req.params.id).exec(),
        GameInstance.find({game: req.params.id}).exec()
    ])

    if(game === null){
        res.redirect("/catalog/games");
    }

    res.render("delete_game",{
        title: "Delete Game",
        game: game,
        gameinstance_list : allGameInstance,
    });
});

exports.game_delete_post = asyncHandler(async (req, res, next)=>{
    const [game, allGameInstance] = await Promise.all([
        Game.findById(req.params.id).exec(),
        GameInstance.find({game: req.params.id}).exec()
    ])

    if(allGameInstance.length > 0){
        res.render("book_delete", {
            title: "Delete Game",
            game: game,
            gameinstance_list : allGameInstance,
        });
    }else{
        await Game.findByIdAndDelete(req.body.gameid);
        res.redirect("/catalog/games");
    }
});

exports.game_update_get = asyncHandler(async (req, res, next)=>{
    const [game ,allDevelopers, allAwards, allGenres] = await Promise.all([
        Game.findById(req.params.id).populate("developer").exec(),
        Developer.find().sort({name: 1}).exec(),
        Award.find().sort({name: 1}).exec(),
        Genre.find().sort({name: 1}).exec(),
    ]);

    if (game === null) {
        // No results.
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
      }

      // Mark our selected genres as checked.
      allGenres.forEach((genre) => {
        if (game.genre.includes(genre._id)) genre.checked = "true";
      });

      allAwards.forEach((award) => {
        if (game.awards.includes(award._id)) award.checked = "true";
      })


    res.render("game_form",{
        title: "Game Form",
        game: game,
        developers_list: allDevelopers,
        awards_list: allAwards,
        genres_list: allGenres,
        platforms_list: platforms
    });
})

exports.game_update_post = [
    (req, res, next) => {
        if(!Array.isArray(req.body.genre)){
            req.body.genre = typeof req.body.genre === "undefined" ? [] : [req.body.genre];
        }
        if(!Array.isArray(req.body.award)){
            req.body.award = typeof req.body.award === "undefined" ? [] : [req.body.award];
        }
        if(!Array.isArray(req.body.platform)){
            req.body.platform = typeof req.body.platform === "undefined" ? [] : [req.body.platform];
        }
        next();
    },

    body('title', 'Title must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('yearReleased', 'Year Released must not be empty and should be a valid date.')
        .trim()
        .isISO8601().toDate(),
    body('developer', 'Developer must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('genre.*').escape(),
    body('summary', 'Summary must not be empty.')
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body('award.*').escape(),
    body('coverPage').optional({ checkFalsy: true }).trim().isURL(),
    body('platform.*').escape(),

    asyncHandler(async (req, res, next)=>{
        const errors = validationResult(req);

        const game = new Game({
            title : req.body.title,
            yearReleased: req.body.yearReleased,
            developer : req.body.developer,
            genre: req.body.genre,
            awards: req.body.awards,
            platform : req.body.platform,
            summary : req.body.summary,
            coverPage: req.body.coverPage,
            _id: req.params.id
        })

        if(!errors.isEmpty()){

            const [allDevelopers, allAwards, allGenres] = await Promise.all([
                Developer.find().sort({name: 1}).exec(),
                Award.find().sort({name: 1}).exec(),
                Genre.find().sort({name: 1}).exec(),
            ]);

            for(const genre of allGenres){
                if(game.genre.includes(genre._id)){
                    genre.checked = "true";
                }
            }

            for(const award of allAwards){
                if(game.awards.includes(genre._id)){
                    award.checked = "true";
                }
            }

            res.render("game_form", {
                title: "Game Form",
                developers_list: allDevelopers,
                awards_list: allAwards,
                genres_list: allGenres,
                errors: errors.array()
            });
        }else{
            const updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});
            res.redirect(updatedGame.url)
        }
    })
];