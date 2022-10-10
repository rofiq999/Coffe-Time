const postgreDb = require('../config/postgre');

const getTransactions = () => {
  return new Promise((resolve, reject) => {
    const query = 'select * from transactions';
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const createTransactions = (body) => {
  return new Promise((resolve, reject) => {
    const query = 'insert into transactions (id_product, id_voucher, id_user, quantity, subtotal, shiping, tax, total, payment, order_time) values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)';
    // for loop query += ",($5,$6,$7,$8)";
    const { id_product, id_voucher, id_user, quantity, subtotal, shiping, tax, total, payment, order_time } = body;
    postgreDb.query(query, [id_product, id_voucher, id_user, quantity, subtotal, shiping, tax, total, payment, order_time], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(queryResult);
    });
  });
};

const editTransactions = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = 'update transactions set ';
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id_transactions = $${idx + 2}`;
        values.push(body[key], params.id_transactions);
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

const deleteTransactions = (params) => {
  return new Promise((resolve, reject) => {
    const query = 'delete from transactions where id_transactions = $1';
    // OR => logika atau sql
    // "OR" => string OR
    postgreDb.query(query, [params.id_transactions], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(result);
    });
  });
};
const repoTransaction = {
  getTransactions,
  createTransactions,
  editTransactions,
  deleteTransactions,
};

module.exports = repoTransaction;
