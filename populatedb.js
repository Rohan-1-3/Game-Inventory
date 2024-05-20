#! /usr/bin/env node

console.log(
    'This script populates some test genres, awards, games, game instances, and developers to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );

  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);

  const Genre = require("./models/genre");
  const Award = require("./models/award");
  const Game = require("./models/game");
  const GameInstance = require("./models/gameinstance");
  const Developer = require("./models/developer");

  const genres = [];
  const awards = [];
  const games = [];
  const gameInstances = [];
  const developers = [];

  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false);

  const mongoDB = userArgs[0];

  main().catch((err) => console.log(err));

  async function main() {
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createGenres();
    await createAwards();
    await createDevelopers();
    await createGames();
    await createGameInstances();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }

  async function genreCreate(index, name) {
    const genre = new Genre({ name: name });
    await genre.save();
    genres[index] = genre;
    console.log(`Added genre: ${name}`);
  }

  async function awardCreate(index, name) {
    const award = new Award({ name: name });
    await award.save();
    awards[index] = award;
    console.log(`Added award: ${name}`);
  }

  async function developerCreate(index, name, founder, founded, headquarters) {
    const developer = new Developer({
      name: name,
      founder: founder,
      founded: founded,
      headquarters: headquarters,
    });
    await developer.save();
    developers[index] = developer;
    console.log(`Added developer: ${name}`);
  }

  async function gameCreate(
    index,
    title,
    yearReleased,
    developer,
    genre,
    awards,
    platform,
    summary,
    coverPage
  ) {
    const game = new Game({
      title: title,
      yearReleased: yearReleased,
      developer: developer,
      genre: genre,
      awards: awards,
      platform: platform,
      summary: summary,
      coverPage: coverPage,
    });
    await game.save();
    games[index] = game;
    console.log(`Added game: ${title}`);
  }

  async function gameInstanceCreate(index, game, status, due_back) {
    const gameInstance = new GameInstance({
      game: game,
      status: status,
      due_back: due_back,
    });
    await gameInstance.save();
    gameInstances[index] = gameInstance;
    console.log(`Added game instance for game: ${game.title}`);
  }

  async function createGenres() {
    console.log("Adding genres");
    await Promise.all([
        genreCreate(0, "Action"),
        genreCreate(1, "Adventure"),
        genreCreate(2, "RPG"),
        genreCreate(3, "Strategy"),
        genreCreate(4, "Simulation"),
        genreCreate(5, "Sports"),
        genreCreate(6, "Puzzle"),
    ]);
  }

  async function createAwards() {
    console.log("Adding awards");
    await Promise.all([
        awardCreate(0, "Game of the Year"),
        awardCreate(1, "Best Narrative"),
        awardCreate(2, "Best Multiplayer"),
        awardCreate(3, "Best Art Direction"),
        awardCreate(4, "Best Sound Design"),
        awardCreate(5, "Best Indie Game"),
        awardCreate(6, "Best Mobile Game"),
    ]);
  }

  async function createDevelopers() {
    console.log("Adding developers");
    await Promise.all([
        developerCreate(0, "Naughty Dog", "Jason Rubin", new Date(1984, 9, 1), "Santa Monica, California, USA"),
        developerCreate(1, "CD Projekt Red", "Michał Kiciński", new Date(1994, 3, 1), "Warsaw, Poland"),
        developerCreate(2, "Rockstar Games", "Sam Houser", new Date(1998, 12, 1), "New York City, New York, USA"),
        developerCreate(3, "Nintendo", "Fusajiro Yamauchi", new Date(1889, 9, 23), "Kyoto, Japan"),
        developerCreate(4, "Ubisoft", "Christian Guillemot", new Date(1986, 3, 28), "Montreuil, France"),
        developerCreate(5, "Blizzard Entertainment", "Allen Adham", new Date(1991, 2, 8), "Irvine, California, USA"),
        developerCreate(6, "Electronic Arts", "Trip Hawkins", new Date(1982, 5, 28), "Redwood City, California, USA"),
    ]);
  }
  async function createGames() {
    console.log("Adding games");
    await Promise.all([
      gameCreate(
        0,
        "The Last of Us Part II",
        new Date(2020, 5, 19),
        developers[0],
        [genres[0], genres[1]],
        [awards[0], awards[1]],
        ["PlayStation 4"],
        "A sequel to The Last of Us, players control two characters in a post-apocalyptic United States.",
        "https://example.com/cover_page_last_of_us_2.jpg"
      ),
      gameCreate(
        1,
        "Cyberpunk 2077",
        new Date(2020, 12, 10),
        developers[1],
        [genres[0], genres[2]],
        [awards[2]],
        ["PC", "PlayStation 4", "Xbox One"],
        "Set in a dystopian Night City, the story follows V, a mercenary outlaw after a one-of-a-kind implant that is the key to immortality.",
        "https://example.com/cover_page_cyberpunk_2077.jpg"
      ),
      gameCreate(
        2,
        "Red Dead Redemption 2",
        new Date(2018, 10, 26),
        developers[2],
        [genres[0], genres[1]],
        [awards[0], awards[1]],
        ["PlayStation 4", "Xbox One", "PC"],
        "Set in 1899, follow the story of outlaw Arthur Morgan and the Van der Linde gang as they rob, steal, and fight their way across the rugged heartland of America.",
        "https://example.com/cover_page_red_dead_redemption_2.jpg"
      ),
      // Add four more game creations here
      gameCreate(
        3,
        "The Legend of Zelda: Breath of the Wild",
        new Date(2017, 3, 3),
        developers[3],
        [genres[0], genres[1]],
        [awards[0], awards[2]],
        ["Nintendo Switch", "Wii U"],
        "Link awakens from a deep slumber to discover a mysterious voice beckoning him to the now-destroyed Kingdom of Hyrule. He sets out to uncover the truth behind his past and the calamity that threatens the kingdom.",
        "https://example.com/cover_page_zelda_breath_of_the_wild.jpg"
      ),
      gameCreate(
        4,
        "Assassin's Creed Valhalla",
        new Date(2020, 11, 10),
        developers[4],
        [genres[0], genres[2]],
        [awards[3], awards[4]],
        ["PC", "PlayStation 4", "PlayStation 5", "Xbox One", "Xbox Series X/S", "Google Stadia"],
        "Set in 873 AD, you play as Eivor, a Viking raider leading your clan from the harsh shores of Norway to a new home amid the lush farmlands of ninth-century England.",
        "https://example.com/cover_page_assassins_creed_valhalla.jpg"
      ),
      gameCreate(
        5,
        "Overwatch",
        new Date(2016, 5, 24),
        developers[5],
        [genres[0], genres[5]],
        [awards[2], awards[5]],
        ["PC", "PlayStation 4", "Xbox One", "Nintendo Switch"],
        "In a time of global crisis, an international task force of heroes banded together to restore peace to a war-torn world: OVERWATCH. It ended the crisis and helped to maintain peace in the decades that followed, inspiring an era of exploration, innovation, and discovery.",
        "https://example.com/cover_page_overwatch.jpg"
      ),
      gameCreate(
        6,
        "Portal 2",
        new Date(2011, 4, 19),
        developers[6],
        [genres[6], genres[1]],
        [awards[0], awards[1]],
        ["PC", "PlayStation 3", "Xbox 360"],
        "The game takes place in the Aperture Science Laboratories, and the player-character is Chell, a woman forced to undergo a series of tests within the Enrichment Center by a malicious artificial intelligence, GLaDOS, that controls the facility.",
        "https://example.com/cover_page_portal_2.jpg"
      ),
    ]);
  }

  async function createGameInstances() {
    console.log("Adding game instances");
    await Promise.all([
      gameInstanceCreate(0, games[0], "Available", null),
      gameInstanceCreate(1, games[1], "Available", null),
      // Add five more game instance creations here
      gameInstanceCreate(2, games[2], "Loaned", new Date(2024, 5, 20)),
      gameInstanceCreate(3, games[3], "Available", null),
      gameInstanceCreate(4, games[4], "Available", null),
      gameInstanceCreate(5, games[5], "Maintenance", new Date(2024, 5, 20)),
      gameInstanceCreate(6, games[6], "Available", null),
    ]);
  }
