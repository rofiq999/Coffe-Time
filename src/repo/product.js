const postgreDb = require('../config/postgre');

const createProduct = (body, file) => {
  return new Promise((resolve, reject) => {
    const query = 'insert into product (product_name, price, stock, size, category, image, description) values ($1,$2,$3,$4,$5,$6,$7) returning *';
    const { product_name, price, stock, size, category, description } = body;
    postgreDb.query(query, [product_name, price, stock, size, category, file, description], (err, queryResult) => {
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
        query += `${key} = $${idx + 1} where id = $${idx + 2} returning *`;
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

const deleteProduct = (params) => {
  return new Promise((resolve, reject) => {
    const query = 'delete from product where id = $1';
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

const searchProduct = (queryparams) => {
  return new Promise((resolve, reject) => {
    let query = 'select product.*, promo.code, promo.discount from product full join promo on promo.product_id = product.id ';

    // Search name product
    if (queryparams.search) {
      query += `where lower(product_name) like lower('%${queryparams.search}%1')`;
    }

    // Filter category
    if (queryparams.category) {
      if (queryparams.search) {
        query += `and lower(category) like lower('${queryparams.category}')`;
      } else {
        query += `where lower(category) like lower('${queryparams.category}')`;
      }
    }

    if (queryparams.sort == 'low') {
      query += 'order by price asc';
    }
    if (queryparams.sort == 'high') {
      query += 'order by price desc';
    }
    if (queryparams.sort == 'newest') {
      query += 'order by created_at asc';
    }
    if (queryparams.sort == 'lates') {
      query += 'order by created_at desc';
    }
    if (queryparams.sort == 'favorite') {
      query = 'select product.*, transactions.quantity from product inner join transactions on transactions.product_id = product.id order by transactions.quantity desc';
    }

    const page = Number(queryparams.page);
    const limit = Number(queryparams.limit);
    const offset = (page - 1) * limit;
    query += ` limit ${limit} offset ${offset}`;

    postgreDb.query(query, (err, result) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(result);
    });
  });
};
// const searchProduct = (queryParams) => {
//   return new Promise((resolve, reject) => {
//     const query = 'select * from product where lower(name_product) like lower($1) order by id_product asc ';
//     const values = [`%${queryParams.name_product}%`];
//     postgreDb.query(query, values, (err, queryResult) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       return resolve(queryResult);
//     });
//   });
// };

// const shorthProduct = (queryParams) => {
//   return new Promise((resolve, reject) => {
//     let query = 'select * from product ';
//     if (queryParams.sort == 'low') {
//       query += 'order by price asc';
//     }
//     if (queryParams.sort == 'high') {
//       query += 'order by price desc';
//     }
//     if (queryParams.sort == 'creat_at_asc') {
//       query += 'order by product asc';
//     }
//     if (queryParams.sort == 'creat_at_desc') {
//       query += 'order by product desc';
//     }
//     if (queryParams.sort == 'favorite') {
//       query = 'select product.*, transactions.quanty from product inner join transactions on transactions.id_product = product.id_product order by transactions.quanty asc';
//     }
//     postgreDb.query(query, (err, result) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       return resolve(result);
//     });
//   });
// };

// const filterProduct = (queryParams) => {
//   return new Promise((resolve, reject) => {
//     const query = 'select * from product where lower(category) like lower($1) order by id_product asc ';
//     const values = [`%${queryParams.category}%`];
//     postgreDb.query(query, values, (err, queryResult) => {
//       if (err) {
//         console.log(err);
//         return reject(err);
//       }
//       return resolve(queryResult);
//     });
//   });
// };

const repoProduct = {
  createProduct,
  editProduct,
  deleteProduct,
  searchProduct,
  // searchProduct,
  // shorthProduct,
  // filterProduct,
};

module.exports = repoProduct;
