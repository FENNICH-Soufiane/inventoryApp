import axios from "axios";
import { toast } from "react-toastify";

const backend_url = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${backend_url}/api/products/`

export const createProduct = async (userData) => {
    const response = await axios.post(API_URL, userData)
    return response.data
};

const productService = {
  createProduct
}

export default productService
