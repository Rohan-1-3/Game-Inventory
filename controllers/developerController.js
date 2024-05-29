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

exports.developer_create_get = (req, res, next)=>{
    res.render("developer_form", {title: "Developer Form"});
}

exports.developer_create_post = [
    body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Name has non-alphanumeric characters.'),
  body('founder')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Founder must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Founder has non-alphanumeric characters.'),
  body('headquarters')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Headquarters must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Headquarters has non-alphanumeric characters.'),
  body('founded', 'Invalid founded date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  body("logo").optional({ checkFalsy: true }).trim().isURL(),

  asyncHandler(async (req, res,next)=>{
    const errors = validationResult(req);

    const developer = new Developer({
        name: req.body.name,
        founder: req.body.founder,
        founded: req.body.founded,
        headquarters: req.body.headquarters,
        logo: req.body.logo
    })

    if(!errors.isEmpty()){
        res.render("developer_form",{
            title : "Create Developer",
            developer: developer,
            errors: errors.array()
        });
        return;
    }else{
        await developer.save();
        res.redirect(developer.url);
    }
  })
];


exports.developer_delete_get = asyncHandler(async (req, res, next)=>{
    const [developer, allGames] = await Promise.all([
        Developer.findById(req.params.id).exec(),
        Game.find({developer: req.params.id}).exec()
    ])

    if(developer === null){
        res.redirect("/catalog/developers");
    }

    res.render("developer_delete",{
        title: "Delete Developer",
        developer: developer,
        games: allGames
    })
})

exports.developer_delete_post = asyncHandler(async (req, res, next)=>{
    const [developer, allGames] = await Promise.all([
        Developer.findById(req.params.id).exec(),
        Game.find({developer: req.params.id}).exec()
    ])

    if(allGames.length > 0){
        res.render("developer_delete",{
            title: "Delete Developer",
            developer: developer,
            games: allGames
        });
        return;
    }else{
        await Developer.findByIdAndDelete(req.body.id);
        res.redirect("/catalog/developers");
    }
})

exports.developer_update_get = asyncHandler(async (req, res, next)=>{
    const developer = await Developer.findById(req.params.id);

    if(developer === null){
        const error = new Error("No Developer found");
        error.status = 404;
        return next(error);
    }

    res.render("developer_form", {
        title : "Update Developer",
        developer: developer
    })
})

exports.developer_update_post = [
    body('name')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Name must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Name has non-alphanumeric characters.'),
  body('founder')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Founder must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Founder has non-alphanumeric characters.'),
  body('headquarters')
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage('Headquarters must be specified.')
    .isAlphanumeric('en-US', { ignore: ' ' })
    .withMessage('Headquarters has non-alphanumeric characters.'),
  body('founded', 'Invalid founded date')
    .optional({ values: 'falsy' })
    .isISO8601()
    .toDate(),
  body("logo").optional({ checkFalsy: true }).trim().isURL(),

  asyncHandler(async (req, res,next)=>{
    const errors = validationResult(req);

    const developer = new Developer({
        name: req.body.name,
        founder: req.body.founder,
        founded: req.body.founded,
        headquarters: req.body.headquarters,
        logo: req.body.logo,
        _id: req.params.id
    })

    if(!errors.isEmpty()){
        res.render("developer_form",{
            title : "Create Developer",
            developer: developer,
            errors: errors.array()
        });
        return;
    }else{
        const updatedDeveloper = await Developer.findByIdAndUpdate(req.params.id, developer, {});
        res.redirect(updatedDeveloper.url);
    }
  })
];