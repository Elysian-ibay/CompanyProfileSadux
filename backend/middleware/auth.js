const jwt = require('jsonwebtoken');

/**
 * Verify a JWT from the Authorization header ("Bearer <token>").
 * On success attaches the decoded payload to req.user and calls next().
 * On failure responds 401 (missing/invalid token).
 *
 * Tokens are issued by authController.login and signed with process.env.JWT_SECRET.
 */
const verifyToken = (req, res, next) => {
    const header = req.headers.authorization || req.headers.Authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7).trim() : null;

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: 'Server auth misconfigured (JWT_SECRET missing)' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // { id, role, iat, exp }
        next();
    } catch (err) {
        return res.status(401).json({ message: 'Invalid or expired token' });
    }
};

/**
 * Require the authenticated user to have the 'admin' role.
 * Must be used after verifyToken.
 */
const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        return next();
    }
    return res.status(403).json({ message: 'Admin access required' });
};

module.exports = { verifyToken, isAdmin };
