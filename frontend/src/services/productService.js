import axios from "axios";
import { toast } from "react-toastify";

const backend_url = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${backend_url}/api/products/`

export const createProduct = async (userData) => {
    const response = await axios.post(API_URL, userData)
    return response.data 
    // return la reponse du serveur apres la requete post
};

export const getProducts = async () => {
  const response = await axios.get(API_URL)
  return response.data 
};

const productService = {
  createProduct,
  getProducts
}

export default productService
