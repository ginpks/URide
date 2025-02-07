import bcrypt from "bcryptjs";
//import dotenv from "dotenv";
import User from "../models/user.js";

const factoryResponse = (status, message) => ({ status, message });

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  if(!username || !email || !password){
    return res.status(400).json({ error:"all fields are required"});
  }

  if (await existsUser(username))
    return res.status(400).json(factoryResponse(400, "Username already taken"));
  if (await existsUser(email))
    return res.status(400).json(factoryResponse(400, "email already taken"));

  const hash = await bcrypt.hash(password, 10);
  await User.create({ username,email, password: hash });
  res.json(factoryResponse(200, "account created"));
  console.log("User registered successfully");
};


//can also add this to have google auth
// import express from "express"
// import passport from "../auth/passport.js";
// import{
//     register,
//     login, 
//     logout,
//     googleAuthcallBack,
//     getAdminArea,
//     getProfile
// }   from "../controler/controler.js"

// const router = express.Router()
// router.post("/register",register)
// router.post("/login",login);
// router.get("/logout", logout);

// router.get(
//     "/auth.google",
//     passport.authenticate("google", {scope: ["profile"]})
// );

// router.get(
//     "/auth/google/callback",
//     passport.authenticate("google",{failureRedirect: "/"}), googleAuthcallBack
// );

