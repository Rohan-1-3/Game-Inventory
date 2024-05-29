const Award = require("../models/award");
const Game = require("../models/game");
const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");

// Display list of all Awards.
exports.award_list = asyncHandler(async (req, res, next) => {
  const allAwardList = await Award.find().sort({ name: 1 }).exec();

  res.render("award_list", {
    title: "Award List",
    allAwardList: allAwardList,
  });
});

// Display detail page for a specific Award.
exports.award_detail = asyncHandler(async (req, res, next) => {
  // Get details of award and all associated games (in parallel)
  const [award, gamesInAward] = await Promise.all([
    Award.findById(req.params.id).exec(),
    Game.find({ awards: req.params.id }).exec(),
  ]);

  if (award === null) {
    // No results.
    const err = new Error("Award not found");
    err.status = 404;
    return next(err);
  }
  console.log(gamesInAward);
  res.render("award_detail", {
    title: "Award Detail",
    award: award,
    award_games: gamesInAward,
  });
});

// Display Award create form on GET.
exports.award_create_get = (req, res, next) => {
  res.render("award_form", { title: "Create Award" });
};

// Handle Award create on POST.
exports.award_create_post = [
  // Validate and sanitize the name field.
  body("name", "Award name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an award object with escaped and trimmed data.
    const award = new Award({ name: req.body.name });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("award_form", {
        title: "Create Award",
        award: award,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Award with same name already exists.
      const awardExists = await Award.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (awardExists) {
        // Award exists, redirect to its detail page.
        res.redirect(awardExists.url);
      } else {
        await award.save();
        // New award saved. Redirect to award detail page.
        res.redirect(award.url);
      }
    }
  }),
];

// Display Award delete form on GET.
exports.award_delete_get = asyncHandler(async (req, res, next) => {
  const [award, allGames] = await Promise.all([
    Award.findById(req.params.id).exec(),
    Game.find({ awards: req.params.id }).exec(),
  ]);

  if (award === null) {
    res.redirect('/catalog/awards');
  }

  res.render("award_delete", {
    title: "Delete Award",
    award: award,
    games: allGames,
  });
});

// Handle Award delete on POST.
exports.award_delete_post = asyncHandler(async (req, res, next) => {
  const [award, allGames] = await Promise.all([
    Award.findById(req.params.id).exec(),
    Game.find({ awards: req.params.id }).exec(),
  ]);

  if (allGames.length > 0) {
    res.render("award_delete", {
      title: "Delete Award",
      award: award,
      games: allGames,
    });
  } else {
    await Award.findByIdAndDelete(req.body.awardid).exec();
    res.redirect('/catalog/awards');
  }
});

// Display Award update form on GET.
exports.award_update_get = asyncHandler(async (req, res, next) => {
  const award = await Award.findById(req.params.id).exec();

  if (award === null) {
    const err = new Error("Award not found");
    err.status = 404;
    return next(err);
  }

  res.render("award_form", {
    title: "Update Award",
    award: award,
  });
});

// Handle Award update on POST.
exports.award_update_post = [
  // Validate and sanitize the name field.
  body("name", "Award name must contain at least 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create an award object with escaped and trimmed data.
    const award = new Award({
      name: req.body.name,
      _id: req.params.id, // This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render("award_form", {
        title: "Update Award",
        award: award,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Award with same name already exists.
      const awardExists = await Award.findOne({ name: req.body.name })
        .collation({ locale: "en", strength: 2 })
        .exec();
      if (awardExists) {
        // Award exists, redirect to its detail page.
        res.redirect(awardExists.url);
      } else {
        const updatedAward = await Award.findByIdAndUpdate(req.params.id, award, {});
        res.redirect(updatedAward.url);
      }
    }
  }),
];
