const jwt = require("jsonwebtoken");

const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "15d",
  });

  res.cookie("jwt", token, {
<<<<<<< HEAD
    maxAge: 15 * 24 * 60 * 1000, // 15 days
    httpOnly: true,
    sameSite: "strict",
  });
};

module.exports = generateToken;

=======
    maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days in milliseconds
    httpOnly: true, // Prevents JavaScript access to the cookie
    secure: process.env.NODE_ENV === "production", // Use HTTPS only in production
    sameSite: "None", // Needed for cross-site cookies (set to "Lax" or "Strict" if not needed)
  });
};

module.exports = generateToken;
>>>>>>> 5f6bc658b3e2539eaf6b98885abf58925575ab45
