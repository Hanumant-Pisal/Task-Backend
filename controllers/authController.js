import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";




export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: "Invalid credentials" });

   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "default_secret", { expiresIn: "1h" });

    res.json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
