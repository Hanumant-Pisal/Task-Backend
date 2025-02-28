import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
   
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "default_secret");
    req.user = decoded; 
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};

export default authMiddleware;
