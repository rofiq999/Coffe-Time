const postgreDb = require('../config/postgre');

const getTransactions = () => {
  return new Promise((resolve, reject) => {
    const query =
      'select product.product_name, product.price, product.size, product.category, promo.code, promo.discount, users.display_name, users.addres, transactions.qty, transactions.shiping, transactions.tax, transactions.total, transactions.payment, transactions.status from transactions join product on transactions.product_id = product.id join promo on transactions.promo_id = promo.id join users on transactions.user_id = users.id';
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
    const query = 'insert into transactions (user_id, product_id, promo_id, qty, shiping, tax, total, payment, status) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)';
    // for loop query += ",($5,$6,$7,$8)";
    const { user_id, product_id, promo_id, qty, shiping, tax, total, payment, status } = body;
    postgreDb.query(query, [user_id, product_id, promo_id, qty, shiping, tax, total, payment, status], (err, queryResult) => {
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

const deleteTransactions = (params) => {
  return new Promise((resolve, reject) => {
    const query = 'delete from transactions where id = $1';
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
const repoTransaction = {
  getTransactions,
  createTransactions,
  editTransactions,
  deleteTransactions,
};

module.exports = repoTransaction;
