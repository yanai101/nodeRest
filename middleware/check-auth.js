const jwt = require('jsonwebtoken');
const config = require('../appConfig');

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decoded = jwt.verify(token, config.JWT_KEY, null);
        req.userData = decoded;
        next();

    } catch (e) {
        return res.status(401).json({
            message: 'Auth failde'
        })
    }
}