//  import express framework
import express from "express";
//  import utility libs
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// import db
import db from "./models/index.js";
//  import routes & controllers
import signInUpRoutes from "./routes/sign_routes.mjs";
import SignInUpController from "./controllers/signCtrl.mjs";
import gameRoutes from "./routes/game_routes.mjs";
import GameController from "./controllers/gameCtrl.mjs";
// initiate/create instance of controllers
const signInUpControl = new SignInUpController(db, db.User);
const gameControl = new GameController(db, db.Game);

// __dirname not supported in ESM module format, hence haf to define it
const __dirname = dirname(fileURLToPath(import.meta.url));

// initialise express instance
const app = express();

// set view engine as ejs
app.set("view engine", "ejs");

// define path to common folders
app.use(express.static(join(__dirname, "/public")));
app.use(express.static(join(__dirname, "/src")));

// middlewares to use
app.use(express.urlencoded({ extended: false })); // handle req.body from form requests
app.use(express.json()); // handle json from axios post requests
app.use(methodOverride("_method"));
app.use(cookieParser());

// make use of defined routes
app.use("/", signInUpRoutes(signInUpControl));
app.use("/game", gameRoutes(gameControl));

// app.get("/", (req, res)=>{
//   res.render( "main")
// })

const PORT = process.env.PORT || 3004;
app.listen(PORT);