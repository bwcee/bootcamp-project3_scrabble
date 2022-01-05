import BaseController from "./baseCtrl.mjs";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const { SALT } = process.env;

export default class SignInUpController extends BaseController {
  constructor(db, model) {
    super(db, model);
  }

  async getStart(req, res) {
    try {
      res.render("main");
    } catch (err) {
      return this.errorHandler(err, res);
    }
  }

  async doSignIn(req, res) {
    const { email, password } = req.body;
    try {
      const user = await this.model.findOne({
        where: {
          email: email,
        },
        raw: true,
      });
      console.log("Sign-in query result", user);
      if (!user) {
        res.send("null");
      } else {
        const logInSuccess = await bcrypt.compare(password, user.password);

        if (logInSuccess) {
          const payload = { id: user.id, user: user.user };
          const token = jwt.sign(payload, SALT, { expiresIn: "6h" });
          
          res.send(token);
        } else {
          res.send("null");
        }
      }
    } catch (err) {
      this.errorHandler(err, res);
    }
  }

  async doLogOut(req, res) {
    res.clearCookie("loggedIn");
    res.clearCookie("userID");
    res.send(
      "this doesn't work, but think need to end w a res.send to end transaction?"
    );
  }
}

// //////////////////////////////////
// // sign up controllers
// //////////////////////////////////
// export const goSignup = (req, res) => {
//   res.render("pages/signup");
// };

// export const doSignup = (req, res) => {
//   const arr = Object.values(req.body); // email, password, business name
//   const hashedPass = getHash(arr[1]);
//   arr.splice(1, 1, hashedPass);
//   const usersArr = arr.slice(0, 2);
//   const coArr = arr.slice(2);
//   const newSignup = `INSERT INTO users (email, password) VALUES ($1, $2) RETURNING *`;
//   const newCo = `INSERT INTO companies (name) VALUES ($1) RETURNING *`;
//   const insertCo = `UPDATE users SET co_id=$1 WHERE id=$2 RETURNING *`;
//   const defaultCat = `INSERT INTO categories (category, co_id) VALUES ('Nil category', $1)`;
//   let user_id = "";
//   pool
//     .query(newSignup, usersArr)
//     .then((result) => {
//       user_id = result.rows[0].id;
//       res.cookie("loggedIn", true);
//       res.cookie("userID", user_id);
//       return pool.query(newCo, coArr);
//     })
//     .then((result) => {
//       const usersCoArr = [result.rows[0].id];
//       usersCoArr.push(user_id);
//       return pool.query(insertCo, usersCoArr);
//     })
//     .then((result) => {
//       pool.query(defaultCat, [result.rows[0].co_id]);
//       return res.redirect(301, "/admin/dash");
//     })
//     .catch((err) => {
//       const text =
//         "Sorry there is an error, probably cos email alr taken. Go back to Home page and try again.";
//       userErrorHandler(err, res, text);
//     });
// };

// //////////////////////////////////
// // sign in controllers
// //////////////////////////////////
// export const goSignin = (req, res) => {
//   res.render("pages/signin");
// };

// export const doSignin = (req, res) => {
//   const arr = Object.values(req.body); // email, password
//   const selectUser = "SELECT * FROM users WHERE email=$1";
//   pool
//     .query(selectUser, [arr[0]])
//     .then((result) => {
//       if (result.rows.length === 0) {
//         throw "The doofus tried a non-existent email";
//       }
//       const user = result.rows[0];
//       const hashedPass = getHash(arr[1]);
//       // const hashedEmail = getHash(arr[0]);
//       if (hashedPass === user.password) {
//         res.cookie("loggedIn", true);
//         // res.cookie("hashedID", hashedEmail);
//         res.cookie("userID", user.id);
//         user.role_id === 1
//           ? res.redirect(301, "/admin/dash")
//           : res.redirect(301, "/sales/cashier");
//       } else {
//         throw "The doofus used a wrong password";
//       }
//     })
//     .catch((err) => {
//       const text = "Sorry, login fail. Please try again.";
//       userErrorHandler(err, res, text);
//     });
// };

// //////////////////////////////////
// // log out controllers
// //////////////////////////////////
// export const doLogout = (req, res) => {
//   res.clearCookie("loggedIn");
//   // res.clearCookie("hashedID");
//   res.clearCookie("userID");
//   return res.redirect(301, "/index");
// };

// //////////////////////////////////
// // set password controllers
// //////////////////////////////////
// export const goSetpass = (req, res) => {
//   res.render("pages/setpass");
// };

// export const doSetpass = (req, res) => {
//   const arr = Object.values(req.body); //email, old_pass, new_pass
//   const hashedOldPass = getHash(arr[1]);
//   const hashedNewPass = getHash(arr[2]);
//   arr.splice(1, 2, hashedNewPass);
//   const getUser = `SELECT * FROM users WHERE email='${arr[0]}'`;
//   const updatePass = `UPDATE users SET password=$2 WHERE email=$1`;
//   pool
//     .query(getUser)
//     .then((result) => {
//       const user = result.rows[0];
//       if (user.password === null) {
//         pool.query(updatePass, arr);
//         res.cookie("loggedIn", true);
//         res.cookie("userID", user.id);
//         user.role_id === 1
//           ? res.redirect(301, "/admin/dash")
//           : res.redirect(301, "/pos/cashier");
//       } else if (user.password === hashedOldPass) {
//         pool.query(updatePass, arr);
//         res.cookie("loggedIn", true);
//         res.cookie("userID", user.id);
//         user.role_id === 1
//           ? res.redirect(301, "/admin/dash")
//           : res.redirect(301, "/sales/cashier");
//       } else {
//         throw "The doofus made an error";
//       }
//     })
//     .catch((err) => {
//       const text = "Sorry there is an error. Go back to Home page and try again.";
//       userErrorHandler(err, res, text);
//     });
