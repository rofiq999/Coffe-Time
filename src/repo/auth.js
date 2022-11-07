const bcrypt = require('bcrypt');
const JWTR = require('jwt-redis').default;
const client = require('../config/redis');
const db = require('../config/postgre');
// const jwt = require('jsonwebtoken');
module.exports = {
  login: (body) => {
    return new Promise((resolve, reject) => {
      const jwtr = new JWTR(client);
      const { email, password } = body;
      const getPasswordByEmailQuery = 'SELECT id, email, password, role FROM users WHERE email = $1';
      const getPasswordByEmailValues = [email];
      db.query(getPasswordByEmailQuery, getPasswordByEmailValues, (err, response) => {
        if (err) {
          console.log(err);
          return reject({ err });
        }
        if (response.rows.length === 0) return reject({ err: new Error('Email/Password is Wrong'), statusCode: 401 });
        const hashedPassword = response.rows[0].password;
        bcrypt.compare(password, hashedPassword, (err, isSame) => {
          if (err) {
            console.log(err);
            return reject({ err });
          }
          if (!isSame)
            return reject({
              err: new Error('Email/Password is Wrong!'),
              statusCode: 401,
            });

          const payload = {
            user_id: response.rows[0].id,
            name: response.rows[0].name,
            role: response.rows[0].role,
            email,
          };
          jwtr
            .sign(payload, process.env.SECRET_KEY, {
              expiresIn: '1h',
              issuer: process.env.ISSUER,
            })
            .then((token) => {
              // Token verification
              const sendRespon = {
                token: token,
                payload,
              };
              return resolve(sendRespon);
            });
          // jwt.sign(
          //   payload,
          //   process.env.SECRET_KEY,
          //   {
          //     expiresIn: '5m',
          //     issuer: process.env.ISSUER,
          //   },
          //   (err, token) => {
          //     if (err) {
          //       console.log(err);
          //       return reject({ err });
          //     }
          //     return resolve({ token, name: payload.name });
          //   }
          // );
        });
      });
    });
  },
  logout: (token) => {
    return new Promise((resolve, reject) => {
      const jwtr = new JWTR(client);
      jwtr.destroy(token.jti).then((res) => {
        if (!res) reject(new Error('Login First'));
        resolve();
      });
    });
  },
};
