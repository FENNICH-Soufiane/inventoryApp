const asyncHandler = require("express-async-handler");
const sharp = require("sharp");
const fs = require("fs");
const cloudinary = require("cloudinary").v2;

const Product = require("../models/productModel");
const { fileSizeFormater } = require("../utils/fileUpload");

// @desc    Create Product
// @route   POST /api/products/
// @access  Private
const createProduct = asyncHandler(async (req, res) => {
  const { name, sku, category, quantity, price, description, image } = req.body;

  // Handle Image upload
  let fileData = {};
  if (req.file) {
    const filePath = req.file.path;
    const parts = filePath.split("\\");
    const filename = parts[parts.length - 1];

    // Generate a new filename for the compressed image
    const compressedFilename = `compressed-${filename}`;

    // Compress and resize the image
    await sharp(req.file.path)
      .resize(500, 500) // Resize the image to 500x500 pixels
      .jpeg({ quality: 80 }) // Compress the image with the specified quality (adjust as needed)
      .toFile(`uploads/${compressedFilename}`); // Save the compressed and resized image to the specified path

    // Get the file size of the compressed image
    const stats = fs.statSync(`uploads/${compressedFilename}`);
    const fileSizeInBytes = stats.size;
    const fileSizeFormatted = fileSizeFormater(fileSizeInBytes, 2);

    let uploadedFile;

    try {
      // Upload the compressed image to Cloudinary
      uploadedFile = await cloudinary.uploader.upload(
        `uploads/${compressedFilename}`,
        { folder: "InventoryDashboard", resource_type: "image" }
      );
    } catch (error) {
      res.status(500);
      throw new Error("Image could not be uploaded");
    }

    fileData = {
      fileName: req.file.originalname,
      // filePath: `uploads/${compressedFilename}`, // Use the new compressed image path
      filePath: uploadedFile.secure_url,
      fileType: req.file.mimetype,
      fileSize: fileSizeFormatted,
    };

    console.log(req.file); // Juste pour voir le rendu du req.file
    // console.log(req.file.size) => 4141057
    // console.log(fileSizeFormater(req.file.size, 2)) => 4.14 MB
  }

  // Create Product
  const product = await Product.create({
    user: req.user._id,
    name,
    sku,
    category,
    quantity,
    price,
    description,
    image: fileData,
  });
  if (!product) {
    return res.status(500).send("An Error occurred");
  }
  res.status(201).json(product);
});

// @desc   Get All Products
// @route  GET /api/products/
// @access Private
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ user: req.user._id }).sort(
    "-createdAt"
  );
  if (products.length === 0) {
    return res.status(200).send("There is no products now");
  }
  return res.status(200).json(products);
});

// @desc   Get specific product
// @route  GET /api/products/:id
// @access Private
// Method One 👀
const getProductM1 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const product = await Product.findOne({ _id: id, user: userId });
  if (!product) {
    res.status(404);
    throw new Error(`There is no product for this id : ${id}`);
  }
  return res.status(200).json(product);
});

// Method Two 👀
const getProductM2 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await Product.findById(id);

  if (!product) {
    res.status(404);
    throw new Error(`There is no product for this id : ${id}`);
  }
  if (product.user.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("User not authorized");
  }
  return res.status(200).json(product);
});

// @desc   Delete a Specific Product
// @route  DELETE /api/products/:id
// @access public
// Method One 👀
const deleteProductM1 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const deleteProduct = await Product.deleteOne({ _id: id, user: userId });
  
  // Check if the product was deleted
  if (deleteProduct.deletedCount === 0) {
    return res.status(400).json({ msg: "Product already deleted" });
  }
  if (!deleteProduct) {
    res.status(404);
    throw new Error(`There is no product for this id : ${id}`);
  }
  res.status(204).send("product deleted successfully" );
});

// Method Two 👀
const deleteProductM2 = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const deleteProduct = await Product.findOneAndDelete({ _id: id, user: userId });
  
  if (!deleteProduct) {
    res.status(404);
    throw new Error(`There is no product for this id : ${id}`);
  }
  res.status(204).send("product deleted successfully" );
});



module.exports = {
  createProduct,
  getProducts,
  getProductM1,
  getProductM2,
  deleteProductM1,
  deleteProductM2,
};
