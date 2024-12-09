import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import StudentModel from "./models/Student.js";

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

mongoose.connect(
  "mongodb+srv://likeam99:asd123@cluster0.0f2dc.mongodb.net/school"
);

app.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  StudentModel.create({ name, email, password })
    .then((user) => res.json(user))
    .catch((err) => res.json(err));
});

app.post("/login", (req, res) => {
  const { email, password } = req.body;
  StudentModel.findOne({ email })
    .then((user) => {
      if (user) {
        if (user.password === password) {
          const accessToken = jwt.sign(
            { email: email },
            "jwt-access-token-secret",
            { expiresIn: "1m" }
          );
          const refreshToken = jwt.sign(
            { email: email },
            "jwt-refresg-token-secret",
            { expiresIn: "5m" }
          );

          res.cookie("accessToken", accessToken, { maxAge: 60000 });
          res.cookie("refreshToken", refreshToken, {
            maxAge: 300000,
            httpOnly: true,
            secure: true,
            sameSite: "strict",
          });
          res.json({ Login: true });
        } else {
          res.json("Enter Correct Password");
        }
      } else {
        res.json({ Login: false, Message: "No Record Exist" });
      }
    })
    .catch((err) => res.json(err));
});

const verifyUser = (req, res, next) => {
  const accesstoken = req.cookies.accessToken;
  if (!accesstoken) {
    if (condition) {
    }
  } else {
    jwt.verify(accesstoken, "jwt-access-token-secret", (err, decoded) => {
      if (err) {
        return res.json({ valid: false, message: "Invalid Token" });
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

const renewToken = (req, res) => {
  const refreshtoken = req.cookies.refreshToken;
  let exist = false;
  if (!refreshtoken) {
    return res.json({ valid: false, message: "No Refresh Token" });
  } else {
    jwt.verify(refreshtoken, "jwt-refresg-token-secret", (err, decoded) => {
      if (err) {
        return res.json({ valid: false, message: "Invalid Refresh Token" });
      } else {
        const accessToken = jwt.sign({ email: decoded.email });
      }
    });
  }
};

app.get("/dashboard", (req, res) => {
  return res.json({ valid: true, message: "Authorized" });
});

app.listen(3001, () => {
  console.log("Server is Running on Port: 3001");
});
