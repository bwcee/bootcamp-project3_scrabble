/* haf to import dotenv or SALT returns undefined!! */
import dotenv from 'dotenv'
dotenv.config()
const { SALT } = process.env;
import jwt from "jsonwebtoken";

const verifyToken = () => async (req, res, next) => {
  try {
    const userToken = req.header("Authorization").replace("Bearer ", "");
    
    /* if verified, function below return payload, else will throw error */
    const payload = jwt.verify(userToken, SALT);
    
    next();
  } catch (err) {
    return res.status(403).json({ err });
  }
};

export { verifyToken as default };
