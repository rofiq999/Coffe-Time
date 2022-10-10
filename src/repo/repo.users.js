const postgreDb = require('../config/postgre');

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
    const query = 'insert into users ( email, password, contact) values ($1,$2,$3)';
    // for loop query += ",($5,$6,$7,$8)";
    const { email, password, contact } = body;
    postgreDb.query(query, [email, password, contact], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(queryResult);
    });
  });
};
const editUsers = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = 'update users set ';
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id_user = $${idx + 2}`;
        values.push(body[key], params.id_user);
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
const deleteUsers = (params) => {
  return new Promise((resolve, reject) => {
    const query = 'delete from users where id_user = $1';
    // OR => logika atau sql
    // "OR" => string OR
    postgreDb.query(query, [params.id_user], (err, result) => {
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
  editUsers,
  deleteUsers,
};

module.exports = repousers;
