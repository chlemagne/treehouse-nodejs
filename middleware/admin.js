
module.exports = function(req, res, next) {
    const roles = req.user.roles;
    const isAdmin = roles.findIndex(r => r === 'admin') >= 0;
    if (!isAdmin) return res.status(403).send('Access denied.');

    next();
};
