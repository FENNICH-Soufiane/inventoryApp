const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductM1,
  getProductM2,
  deleteProductM1,
  deleteProductM2,
} = require("../controllers/productController");
const protect = require("../middleware/authMiddleware");
const { upload } = require("../utils/fileUpload");

router.post("/", protect, upload.single("image"), createProduct);
router.get("/", protect, getProducts);
router.get("/M1/:id", protect, getProductM1);
router.get("/M2/:id", protect, getProductM2);
router.delete("/M1/:id", protect, deleteProductM1);
router.delete("/M2/:id", protect, deleteProductM2);


module.exports = router;
