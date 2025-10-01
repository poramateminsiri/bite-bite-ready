/**
 * Authentication Middleware
 * Protects routes that require admin authentication
 */

const { auth } = require('../auth');

/**
 * Middleware to require authentication
 * Checks if user is logged in via BetterAuth session
 */
async function requireAuth(req, res, next) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers
    });
    
    if (!session) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized - Please login to access this resource'
      });
    }
    
    // Attach user and session to request for use in route handlers
    req.user = session.user;
    req.session = session;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      error: 'Authentication failed'
    });
  }
}

/**
 * Middleware to require specific role
 * @param {string} role - Required role (e.g., 'admin', 'staff')
 */
function requireRole(role) {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized'
      });
    }
    
    // Admin role has access to everything
    if (req.user.role !== role && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Forbidden - Insufficient permissions'
      });
    }
    
    next();
  };
}

module.exports = { requireAuth, requireRole };
