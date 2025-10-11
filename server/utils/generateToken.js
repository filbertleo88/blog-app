import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    {
      userId: userId, // Make sure this matches what your middleware expects
      id: userId, // Add this for compatibility
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export default generateToken;
