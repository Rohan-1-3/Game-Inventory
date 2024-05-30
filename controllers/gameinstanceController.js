const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const Gameinstance = require("../models/gameinstance");
const Game = require("../models/game");

exports.gameinstance_list = asyncHandler(async (req, res, next)=>{
    const gameinstances = await Gameinstance.find({})
                            .populate("game")
                            .exec();


    res.render("gameinstances_list",{
        title : "Game Copies",
        gameinstances : gameinstances
    })
});

exports.gameinstance_detail = asyncHandler(async (req, res, next)=>{
    const gameinstance = await Gameinstance.findById(req.params.id).populate("game").exec();

    if(gameinstance == null){
        res.redirect("/gameinstances");
    }

    res.render("gameinstance_detail",{
        title : "Game Copy",
        gameinstance : gameinstance
    });
})

exports.gameinstance_create_get = asyncHandler(async (req, res, next)=>{
    const games = await Game.find({}).exec();

    res.render("gameinstance_form", {
        title: "Create Game Copy",
        games : games
    })
})

exports.gameinstance_create_post = [
    body("game", "Game must be specified").trim().isLength({ min: 1 }).escape(),
    body("status").escape(),
    body("due_back", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    asyncHandler(async (req, res, next)=>{
        const errors = validationResult(req);

        const gameinstance = new Gameinstance({
            game: req.body.game,
            status: req.body.status,
            due_back : req.body.due_back
        })

        if(!errors.isEmpty()){
            const games = await Game.find({}).exec();

            res.render("gameinstance_form", {
                title: "Create Game Copy",
                games : games,
                gameinstance: gameinstance,
                errors: errors.array()
            })
            return;
        }else{
            await gameinstance.save();
            res.redirect(gameinstance.url);
        }
    })
]

exports.gameinstance_delete_get = asyncHandler(async (req, res, next)=>{
    const gameinstance = await Gameinstance.findById(req.params.id).exec();

    if(gameinstance === null){
        res.redirect("/catalog/gameinstances");
    }

    res.render("gameinstance_delete", {
        title: "Delete Game Copy",
        gameinstance: gameinstance
    })
})

exports.gameinstance_delete_post = asyncHandler(async (req, res, next)=>{
    await Gameinstance.findByIdAndDelete(req.body.id);
    res.redirect("/catalog/gameinstances");
})

exports.gameinstance_update_get = asyncHandler(async (req, res, next)=>{
    const [gameinstance, games] = await Promise.all([
        Gameinstance.findById(req.params.id),
        Game.find({}).exec()
    ])

    if(gameinstance === null){
        res.redirect("/catalog/gameinstances");
    }

    res.render("gameinstance_form", {
        title: "Update Game Copy",
        gameinstance: gameinstance,
        games: games
    })
})

exports.gameinstance_update_post = [
    body("game", "Game must be specified").trim().isLength({ min: 1 }).escape(),
    body("status").escape(),
    body("due_back", "Invalid date")
        .optional({ values: "falsy" })
        .isISO8601()
        .toDate(),

    asyncHandler(async (req, res, next)=>{
        const errors = validationResult(req);

        const gameinstance = new Gameinstance({
            game: req.body.game,
            status: req.body.status,
            due_back : req.body.due_back,
            _id: req.params.id
        })

        if(!errors.isEmpty()){
            const games = await Game.find({}).exec();

            res.render("gameinstance_form", {
                title: "Create Game Copy",
                games : games,
                gameinstance: gameinstance,
                errors: errors.array()
            })
            return;
        }else{
            const updatedGameInstance = await Gameinstance.findByIdAndUpdate(req.params.id, gameinstance, {});
            res.redirect(updatedGameInstance.url);
        }
    })
]