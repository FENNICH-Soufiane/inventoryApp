import axios from "axios";
import { toast } from "react-toastify";

export const backend_url = process.env.REACT_APP_BACKEND_URL;

export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

// Rgister User
export const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${backend_url}/api/users/register`,
      userData,
      { withCredentials: true }
    );
    if (response.statusText === "OK") {
      toast.success("User registered successfully");
    }
    console.log(response);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Login User
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(
      `${backend_url}/api/users/login`,
      userData
    );
    if (response.statusText === "OK") {
      toast.success("Login successful");
    }
    console.log(response);
    return response.data;
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await axios.get(`${backend_url}/api/users/logout`);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// ForgotPassword
export const forgotPasswordUser = async (userData) => {
  try {
    const response = await axios.post(
      `${backend_url}/api/users/forgotpassword`,
      userData
    );
    toast.success(response.data.message);
  } catch (error) {
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();
    toast.error(message);
  }
};

// Reset Password
export const resetPasswordUser = async (password, resetToken) => {
  try {
    const response = await axios.put(
      `${backend_url}/api/users/resetpassword/${resetToken}`,
      password
    );
    // console.log(response);
    return response.data;
    // toast.success("Password Reset Successful...");
  } catch (error) {
    console.log(error);
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    toast.error(message);
  }
};

// Get Login Status
export const getLoginStatus = async (userData) => {
  try {
    const response = await axios.get(`${backend_url}/api/users/loggedin`);
    // console.log(response.data);
    return response.data
  } catch (error) {
    console.log(error);
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    toast.error(message);
  }
};

// Get Login User Data
export const getUser = async () => {
  try {
    const response = await axios.get(`${backend_url}/api/users/getuser`);
    // console.log(response.data);
    return response.data
  } catch (error) {
    console.log(error);
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    toast.error(message);
  }
};

// Change Password
export const changePassword = async (formData) => {
  try {
    const response = await axios.put(`${backend_url}/api/users/changepasswordMethodOne`, formData);
    console.log(response.data);
    return response.data
  } catch (error) {
    console.log(error);
    const message =
      (error.response && error.response.data && error.response.data.message) ||
      error.message ||
      error.toString();

    toast.error(message);
  }
};
