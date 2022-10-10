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
    const query = 'insert into promo ( id_product, nama_voucher, minimal_price, maximal_price, start_voucher, end_voucher, discount, describe) values ($1,$2,$3,$4,$5,$6,$7,$8)';
    const { id_product, nama_voucher, minimal_price, maximal_price, start_voucher, end_voucher, discount, describe } = body;
    postgreDb.query(query, [id_product, nama_voucher, minimal_price, maximal_price, start_voucher, end_voucher, discount, describe], (err, queryResult) => {
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
        query += `${key} = $${idx + 1} where id_voucher = $${idx + 2}`;
        values.push(body[key], params.id_voucher);
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
    const query = 'delete from promo where id_voucher = $1';
    // OR => logika atau sql
    // "OR" => string OR
    postgreDb.query(query, [params.id_voucher], (err, result) => {
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
    const query = 'select * from promo where lower(nama_voucher) like lower($1) order by id_voucher asc ';
    const values = [`%${queryParams.nama_voucher}%`];
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
