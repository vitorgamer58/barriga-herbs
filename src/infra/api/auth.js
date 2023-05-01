const passport = require('passport');
const passportJwt = require('passport-jwt');
const findUser = require('../../domain/usecases/user/findUser');
require('dotenv').config();

const secret = process.env.JWT_SECRET;
const { Strategy, ExtractJwt } = passportJwt;

async function auth(app) {
  return new Promise((resolve) => {
    const params = {
      secretOrKey: secret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    };

    const strategy = new Strategy(params, async (payload, done) => {
      const findUserUsecase = findUser();
      await findUserUsecase.authorize();

      try {
        const ucResponse = await findUserUsecase.run({ id: payload.id.toString() });

        if (ucResponse.isOk) {
          return done(null, ucResponse.ok);
        }

        return done(null, false);
      } catch (err) {
        console.log(err);
        return done(err, false);
      }
    });

    passport.use(strategy);

    app.use(passport.initialize());

    const v1AuthMiddleware = (req, res, next) => {
      if (req.path.startsWith('/v1')) {
        passport.authenticate('jwt', { session: false })(req, res, next);
      } else {
        next();
      }
    };

    app.use(v1AuthMiddleware);

    resolve();
  });
}

module.exports = { auth };
