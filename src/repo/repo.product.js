const postgreDb = require('../config/postgre');

const getProduct = () => {
  return new Promise((resolve, reject) => {
    const query = 'select * from product';
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const createProduct = (body) => {
  return new Promise((resolve, reject) => {
    const query = 'insert into product (name_product, picture_product, category, price, stock, size, describe, create_at) values ($1,$2,$3,$4,$5,$6,$7,$8)';
    // for loop query += ",($5,$6,$7,$8)";
    const { name_product, picture_product, category, price, stock, size, describe, create_at } = body;
    postgreDb.query(query, [name_product, picture_product, category, price, stock, size, describe, create_at], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(queryResult);
    });
  });
};

const editProduct = (body, params) => {
  return new Promise((resolve, reject) => {
    let query = 'update product set ';
    const values = [];
    Object.keys(body).forEach((key, idx, array) => {
      if (idx === array.length - 1) {
        query += `${key} = $${idx + 1} where id_product = $${idx + 2}`;
        values.push(body[key], params.id_product);
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

const deleteProduct = (params) => {
  return new Promise((resolve, reject) => {
    const query = 'delete from product where id_product = $1';
    // OR => logika atau sql
    // "OR" => string OR
    postgreDb.query(query, [params.id_product], (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      resolve(result);
    });
  });
};

const searchProduct = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query = 'select * from product where lower(name_product) like lower($1) order by id_product asc ';
    const values = [`%${queryParams.name_product}%`];
    postgreDb.query(query, values, (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(queryResult);
    });
  });
};

const shorthProduct = (queryParams) => {
  return new Promise((resolve, reject) => {
    let query = 'select * from product ';
    if (queryParams.sort == 'low') {
      query += 'order by price asc';
    }
    if (queryParams.sort == 'high') {
      query += 'order by price desc';
    }
    if (queryParams.sort == 'creat_at_asc') {
      query += 'order by product asc';
    }
    if (queryParams.sort == 'creat_at_desc') {
      query += 'order by product desc';
    }
    if (queryParams.sort == 'favorite') {
      query = 'select product.*, transactions.quanty from product inner join transactions on transactions.id_product = product.id_product order by transactions.quanty asc';
    }
    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};

const filterProduct = (queryParams) => {
  return new Promise((resolve, reject) => {
    const query = 'select * from product where lower(category) like lower($1) order by id_product asc ';
    const values = [`%${queryParams.category}%`];
    postgreDb.query(query, values, (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(queryResult);
    });
  });
};

const repoProduct = {
  getProduct,
  createProduct,
  editProduct,
  deleteProduct,
  searchProduct,
  shorthProduct,
  filterProduct,
};

module.exports = repoProduct;
