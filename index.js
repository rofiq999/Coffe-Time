const express = require('express');
const server = express();

const PORT = 7070;

//import database yang ada
const postgreDB = require('./src/config/postgre.js');
//import mainRouter
const mainRouter = require('./src/routes/main.js');

postgreDB
  .connect()
  .then(() => {
    console.log('Database Connect');
    server.use(express.json());
    server.use(express.urlencoded({ extended: false }));

    //semua request ke server didelegasikan ke mainRouter
    server.use(mainRouter);
    //server siap menerima request di port
    server.listen(PORT, () => {
      console.log(`Server is running at port ${PORT}`);
    });
  })

  //menangkap jika dijalankan error
  .catch((err) => {
    console.log(err);
  });
