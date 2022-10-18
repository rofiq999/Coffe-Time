const postgreDb = require('../config/postgre');

const getvoucher = () => {
  return new Promise((resolve, reject) => {
    const query = 'select * from promo';
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};
const createvoucher = (body) => {
  return new Promise((resolve, reject) => {
    const query = 'insert into promo ( product_id, code, valid, discount) values ($1,$2,$3,$4)';
    const { product_id, code, valid, discount } = body;
    postgreDb.query(query, [product_id, code, valid, discount], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(queryResult);
    });
  });
};
const editvoucher = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = 'update promo set ';
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
const deletevoucher = (params) => {
  return new Promise((resolve, reject) => {
    const query = 'delete from promo where id = $1';
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
const searchvoucher = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query = 'select * from promo where lower(code) like lower($1) order by id asc ';
    const values = [`%${queryParams.code}%`];
    postgreDb.query(query, values, (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(queryResult);
    });
  });
};
const repovoucher = {
  getvoucher,
  createvoucher,
  editvoucher,
  deletevoucher,
  searchvoucher,
};

module.exports = repovoucher;
