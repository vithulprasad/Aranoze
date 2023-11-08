const express=require('express')
const multer=require('multer')
const path = require('path')
const fs=require('fs')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../public/admin/img'));
    },
    filename: function (req, file, cb) {
      const name = file.originalname;
      cb(null, name);
    },
  });
// const upload=multer({storage:storage})
// const storeimage=upload.array('proImage',3)
const upload = multer({ storage: storage }).array('proImage', 3);
const upload2 = multer({ storage: storage }).single('image');


// module.exports={storeimage}
module.exports={upload,
upload2
}
