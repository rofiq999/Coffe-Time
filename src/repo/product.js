const postgreDb = require('../config/postgre');

const createProduct = (body, file) => {
  return new Promise((resolve, reject) => {
    const { product_name, price, stock, size, category, description } = body;
    const query = 'insert into product (product_name, price, stock, size, category, image, description) values ($1,$2,$3,$4,$5,$6,$7) returning *';
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

const searchProduct = (queryparams, hostAPI) => {
  return new Promise((resolve, reject) => {
    let query = 'select product.*, promo.code, promo.discount from product full join promo on promo.product_id = product.id ';

    let queryLimit = '';
    let link = `${hostAPI}/coffe_time/product/?`;

    // Search name product
    if (queryparams.search) {
      query += `where lower(product_name) like lower('%${queryparams.search}%')`;
      link += `product_name=${queryparams.search}&`;
    }

    // Filter category
    if (queryparams.category) {
      if (queryparams.search) {
        query += `and lower(category) like lower('${queryparams.category}')`;
        link += `category=${queryparams.category}&`;
      } else {
        query += `where lower(category) like lower('${queryparams.category}')`;
        link += `category=${queryparams.category}&`;
      }
    }

    if (queryparams.sort == 'low') {
      query += 'order by price asc';
      link += `sort=${queryparams.sort}&`;
    }
    if (queryparams.sort == 'high') {
      query += 'order by price desc';
      link += `sort=${queryparams.sort}&`;
    }
    if (queryparams.sort == 'newest') {
      query += 'order by created_at asc';
      link += `sort=${queryparams.sort}&`;
    }
    if (queryparams.sort == 'lates') {
      query += 'order by created_at desc';
      link += `sort=${queryparams.sort}&`;
    }
    if (queryparams.sort == 'favorite') {
      // query = 'select product.*, transactions.qty from product inner join transactions on transactions.product_id = product.id order by transactions.qty desc';
      query =
        'select pr.*,p.code,p.valid,p.discount,COALESCE(sum(tr.qty),0) as sold from product pr left join promo p on pr.id = p.product_id left join transactions tr on pr.id = tr.product_id GROUP BY pr.id,p.code,p.valid,p.discount ORDER by sold desc';
      link += `sort=${queryparams.sort}&`;
    }

    // const page = Number(queryparams.page);
    // const limit = Number(queryparams.limit);
    // const offset = (page - 1) * limit;
    // query += ` limit ${limit} offset ${offset}`;

    let values = [];
    if (queryparams.page && queryparams.limit) {
      let page = parseInt(queryparams.page);
      let limit = parseInt(queryparams.limit);
      let offset = (page - 1) * limit;
      queryLimit = query + ` limit $1 offset $2`;
      values.push(limit, offset);
    } else {
      queryLimit = query;
    }
    postgreDb.query(query, (err, result) => {
      postgreDb.query(queryLimit, values, (err, queryresult) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        console.log(queryresult);
        console.log(queryLimit);
        if (queryresult.rows.length == 0) return reject(new Error('Product Not Found'));
        let resNext = null;
        let resPrev = null;
        if (queryparams.page && queryparams.limit) {
          let page = parseInt(queryparams.page);
          let limit = parseInt(queryparams.limit);
          let start = (page - 1) * limit;
          let end = page * limit;
          let next = '';
          let prev = '';
          const dataNext = Math.ceil(result.rowCount / limit);
          if (start <= result.rowCount) {
            next = page + 1;
          }
          if (end > 0) {
            prev = page - 1;
          }
          if (parseInt(next) <= parseInt(dataNext)) {
            resNext = `${link}page=${next}&limit=${limit}`;
          }
          if (parseInt(prev) !== 0) {
            resPrev = `${link}page=${prev}&limit=${limit}`;
          }
          let sendResponse = {
            dataCount: result.rowCount,
            next: resNext,
            prev: resPrev,
            totalPage: Math.ceil(result.rowCount / limit),
            data: queryresult.rows,
          };
          return resolve(sendResponse);
        }
        let sendResponse = {
          dataCount: result.rowCount,
          next: resNext,
          prev: resPrev,
          totalPage: null,
          data: queryresult.rows,
        };
        return resolve(sendResponse);
      });
    });

    // postgreDb.query(query, (err, result) => {
    //   if (err) {
    //     console.log(err);
    //     return reject(err);
    //   }
    //   return resolve(result);
    // });
  });
};

const getIdProduct = (params) => {
  return new Promise((resolve, reject) => {
    const query = 'select * from product where id = $1';
    postgreDb.query(query, [params.id], (err, queryResult) => {
      if (err) {
        console.log(err);
        return reject(err);
      }
      return resolve(queryResult);
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
  getIdProduct,
  // searchProduct,
  // shorthProduct,
  // filterProduct,
};

module.exports = repoProduct;
