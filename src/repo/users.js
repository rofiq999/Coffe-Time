const postgreDb = require('../config/postgre');
const bcrypt = require('bcrypt');
const getUsers = () => {
  return new Promise((resolve, reject) => {
    const query = 'select * from users';
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};
const createUsers = (body) => {
  return new Promise((resolve, reject) => {
    const query = 'insert into users ( email, password, phone_number) values ($1,$2,$3) returning id,email';
    const { email, password, phone_number } = body;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      postgreDb.query(query, [email, hashedPassword, phone_number], (err, queryResult) => {
        console.log(query);
        if (err) {
          console.log(err);
          return reject(err);
        }
        resolve(queryResult);
      });
    });
  });
};
const editUsers = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = 'update users set ';
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id = $${idx + 2}`;
        values.push(body[key], params.id);
        return;
      }
      query += `${key} = $${idx + 1},`;
      values.push(body[key]);
    });
    postgreDb
      .query(query, values)
      .then((response) => {
        resolve(response);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
};
const editPassword = (body) => {
  return new Promise((resolve, reject) => {
    const { old_password, new_password, user_id } = body;
    const getPwdQuery = 'select password from users where id = $1';
    const getPwdValues = [user_id];
    postgreDb.query(getPwdQuery, getPwdValues, (err, response) => {
      if (err) {
        console.log(err);
        return reject({ err });
      }
      const hashedPassword = response.rows[0].password;
      bcrypt.compare(old_password, hashedPassword, (err, isSame) => {
        if (err) {
          console.log(err);
          return reject({ err });
        }
        if (!isSame)
          return reject({
            err: new Error('Old Password is Wrong!'),
            statusCode: 403,
          });
        bcrypt.hash(new_password, 10, (err, newHashedPassword) => {
          if (err) {
            console.log(err);
            return reject({ err });
          }
          const editPwdQuery = 'update users set password = $1 where id = $2';
          const editPwdValues = [newHashedPassword, user_id];
          postgreDb.query(editPwdQuery, editPwdValues, (err, response) => {
            if (err) {
              console.log(err);
              return reject({ err });
            }
            return resolve(response);
          });
        });
      });
    });
  });
};
const deleteUsers = (params) => {
  return new Promise((resolve, reject) => {
    const query = 'delete from users where id = $1';
    // OR => logika atau sql
    // "OR" => string OR
    postgreDb.query(query, [params.id], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(result);
    });
  });
};
const repousers = {
  getUsers,
  createUsers,
  editPassword,
  editUsers,
  deleteUsers,
};

module.exports = repousers;
