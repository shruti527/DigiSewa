const jwt = require("jsonwebtoken");

module.exports = function auth(requiredRole) {
  return function (req, res, next) {
    try {
      const header = req.headers.authorization || "";
      const token = header.startsWith("Bearer ") ? header.slice(7) : null;
      if (!token) return res.status(401).json({ message: "Missing token" });

      const payload = jwt.verify(token, process.env.JWT_SECRET);
      req.user = payload;

      if (requiredRole && payload.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden" });
      }
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }
  };
};
