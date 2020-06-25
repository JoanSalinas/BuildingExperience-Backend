const config = require('config.json');

module.exports = jwt;

function jwt() {
    const { secret } = config;
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate'
        ]
    });
}

async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    // revoke token if user no longer exists
    if (!user) {
        return done(null, true);
    }

    done();
};