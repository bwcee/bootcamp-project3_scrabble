const { SALT } = process.env;
import jwt from "jsonwebtoken";

export default function verifyToken  (req, res, next)  {
  try {
    const userToken = req.header("Authorization").replace("Bearer ", "");

    /* if verified, function below return payload, else will throw error */
    jwt.verify(userToken, SALT);

    next();
  } catch (err) {
    return res.status(403).json({ err });
  }
};
