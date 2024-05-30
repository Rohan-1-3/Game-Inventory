const express = require("express");
const router = express.Router();

// Require controller modules.
const gameController = require("../controllers/gameController");
const developerController = require("../controllers/developerController");
const genreController = require("../controllers/genreController");
const gameInstanceController = require("../controllers/gameinstanceController");
const awardController = require("../controllers/awardController")

/// GAME ROUTES ///

// GET catalog home page.
router.get("/", gameController.index);

// GET request for creating a Game. NOTE This must come before routes that display Game (uses id).
router.get("/game/create", gameController.game_create_get);

// POST request for creating Game.
router.post("/game/create", gameController.game_create_post);


// GET request to delete Game.
router.get("/game/:id/delete", gameController.game_delete_get);

// POST request to delete Game.
router.post("/game/:id/delete", gameController.game_delete_post);

// GET request to update Game.
router.get("/game/:id/update", gameController.game_update_get);

// POST request to update Game.
router.post("/game/:id/update", gameController.game_update_post);

// GET request for list of all Game items.
router.get("/games", gameController.game_list);

// GET request for one Game.
router.get("/game/:id", gameController.game_detail);


// /// Developer ROUTES ///

// GET request for creating Developer. NOTE This must come before route for id (i.e. display Developer).
router.get("/developer/create", developerController.developer_create_get);

// POST request for creating Developer.
router.post("/developer/create", developerController.developer_create_post);

// GET request to delete Developer.
router.get("/developer/:id/delete", developerController.developer_delete_get);

// POST request to delete Developer.
router.post("/developer/:id/delete", developerController.developer_delete_post);

// GET request to update Developer.
router.get("/developer/:id/update", developerController.developer_update_get);

// POST request to update Developer.
router.post("/developer/:id/update", developerController.developer_update_post);

// GET request for one Developer.
router.get("/developer/:id", developerController.developer_detail);

// GET request for list of all Developers.
router.get("/developers", developerController.developer_list);

// /// GENRE ROUTES ///

// GET request for creating a Genre. NOTE This must come before route that displays Genre (uses id).
router.get("/genre/create", genreController.genre_create_get);

//POST request for creating Genre.
router.post("/genre/create", genreController.genre_create_post);

// GET request to delete Genre.
router.get("/genre/:id/delete", genreController.genre_delete_get);

// POST request to delete Genre.
router.post("/genre/:id/delete", genreController.genre_delete_post);

// GET request to update Genre.
router.get("/genre/:id/update", genreController.genre_update_get);

// POST request to update Genre.
router.post("/genre/:id/update", genreController.genre_update_post);

// GET request for one Genre.
router.get("/genre/:id", genreController.genre_detail);

// GET request for list of all Genre.
router.get("/genres", genreController.genre_list);

// /// GameInstance ROUTES ///

// GET request for creating a GameInstance. NOTE This must come before route that displays GameInstance (uses id).
router.get(
  "/gameinstance/create",
  gameInstanceController.gameinstance_create_get,
);

// POST request for creating GameInstance.
router.post(
  "/gameinstance/create",
  gameInstanceController.gameinstance_create_post,
);

// GET request to delete GameInstance.
router.get(
  "/gameinstance/:id/delete",
  gameInstanceController.gameinstance_delete_get,
);

// POST request to delete GameInstance.
router.post(
  "/gameinstance/:id/delete",
  gameInstanceController.gameinstance_delete_post,
);

// GET request to update GameInstance.
router.get(
  "/gameinstance/:id/update",
  gameInstanceController.gameinstance_update_get,
);

// POST request to update GameInstance.
router.post(
  "/gameinstance/:id/update",
  gameInstanceController.gameinstance_update_post,
);

// GET request for one GameInstance.
router.get("/gameinstance/:id", gameInstanceController.gameinstance_detail);

// GET request for list of all GameInstance.
router.get("/gameinstances", gameInstanceController.gameinstance_list);

// // AWARDS

// GET request for list of all Awards.
router.get("/award/create", awardController.award_create_get);

// POST request for creating Award.
router.post("/award/create", awardController.award_create_post);

// GET request to delete Award.
router.get("/award/:id/delete", awardController.award_delete_get);

// POST request to delete Award.
router.post("/award/:id/delete", awardController.award_delete_post);

// GET request to update Award.
router.get("/award/:id/update", awardController.award_update_get);

// POST request to update Award.
router.post("/award/:id/update", awardController.award_update_post);

// GET request for one Award.
router.get("/award/:id", awardController.award_detail);

// GET request for list of all Award.
router.get("/awards", awardController.award_list);

module.exports = router;
