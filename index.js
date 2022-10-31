const express = require('express');
require('dotenv').config();
require('./src/config/redis');
const server = express();
const morgan = require('morgan');
const PORT = 7070;

// cors untuk menerima perizin preflights
const cors = require('cors');
// const corsOptions = {
//    "Access-Control-Allow-Origin": "*",
//    credentials: true,
//    optionsSuccesssStatus: 200,
// };

//import database yang ada
const postgreDB = require('./src/config/postgre.js');
//import mainRouter
const mainRouter = require('./src/routes/main.js');

postgreDB
  .connect()
  .then(() => {
    console.log('Database Connect');
    server.use(express.json());
    server.use(cors());
    server.use(express.urlencoded({ extended: false }));
    server.use(express.static('./public'));
    server.use(morgan(':method :url :status :res[content-length] - :response-time ms'));
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
