const jwt = require('jsonwebtoken');
const RequestUser = require('./RequestUserAccessModel');

const protectRoutes = async (req, res, next) => {
  let token;

  try {
    // 1. Check for token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // 2. Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 3. Fetch user and attach to req
      req.user = await RequestUser.findById(decoded.id).select('-password');

      // 4. Check user exists
      if (!req.user) {
        return res.status(401).json({ message: "User not found" });
      }

      // 5. Proceed to route
      return next();
    }

    // 6. No token found
    return res.status(401).json({ message: "No token, authorization denied" });

  } catch (err) {
    return res.status(401).json({ message: "Not authorized", error: err.message });
  }
};

module.exports = protectRoutes;
