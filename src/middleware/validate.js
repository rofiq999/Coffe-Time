module.exports = {
  body: (...allowedKeys) => {
    return (req, res, next) => {
      const { body } = req;
      const sanitizeKey = Object.keys(body).filter((key) => allowedKeys.includes(key));
      const newBody = {};
      for (let key of sanitizeKey) {
        Object.assign(newBody, { [key]: body[key] });
      }
      req.body = newBody;
      next();
      if (Object.keys(newBody).length === 0) return res.status(400).json({ msg: 'Nothing insert' });
      // apakah setiap value sesuai dengan tipe data yang diinginkan
      if (Object.keys(newBody).length !== allowedKeys.length) return res.status(400).json({ msg: 'input does not match key' });
    };
  },
  params: (...allowedKeys) => {
    return (req, res, next) => {
      const { params } = req;
      const sanitizedKey = Object.keys(params).filter((key) => allowedKeys.includes(key));
      const newParams = {};
      for (let key of sanitizedKey) {
        Object.assign(newParams, { [key]: params[key] });
      }
      req.params = newParams;
      next();
    };
  },

  // img: () => {
  //   return (req, res, next) => {
  //     let { file } = req;
  //     if (!file) {
  //       file = null;
  //     }
  //     next();
  //   };
  // },
  // email: (...allowedKeys) => {
  //   return (req, res, next) => {
  //     const { body } = req;
  //     const sanitizedKey = Object.keys(body).filter((key) =>
  //       allowedKeys.includes(key)
  //     );
  //     const newBody = {};
  //     for (let key of sanitizedKey) {
  //       if (key == "email" && typeof key == "string") {
  //         let symbolAdd = body[key].indexOf("@");
  //         let dots = body[key].lastIndexOf(".");
  //         if (symbolAdd < 1 || dots < symbolAdd + 2 || dots + 2 >= body[key].length) {
  //           return res
  //             .status(400)
  //             .json({ msg: "Error Input Data Email!", data: null });
  //         }
  //       }
  //       if (key == "phone") {
  //         let regexPhone =
  //           /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
  //         if (!regexPhone.test(body[key])) {
  //           return res
  //             .status(400)
  //             .json({ msg: "wrong input number phone", data: null });
  //         }
  //       }
  //     req.body = newBody;
  //     next();
  //   };
  // },
};
