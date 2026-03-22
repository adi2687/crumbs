import User from "../models/User.js";
import express from "express";

const router = express.Router();

router.get("/all", async (req, res) => {
  try {
    const users = await User.find();
    res.json({ users });
  } catch (error) {
    res.json({success:false,msg:"couldnt find useers"})
  }
});
export default router;
