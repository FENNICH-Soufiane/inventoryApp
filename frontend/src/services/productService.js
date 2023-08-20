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

export const deleteProduct_ = async (id) => {
  const response = await axios.delete(`${API_URL}M1/${id}`)
  // const response = await axios.delete(API_URL+'M1/'+id)
  return response.data 
};

export const updateProduct_ = async (id, formData) => {
  const response = await axios.put(`${API_URL}${id}`, formData)
  return response.data 
};

// Get a Product
const getProduct_ = async (id) => {
  const response = await axios.get(API_URL +'M1/'+ id);
  return response.data;
};

const productService = {
  createProduct,
  getProducts,
  deleteProduct_,
  updateProduct_,
  getProduct_
}

export default productService
