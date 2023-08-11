import React, { useState } from "react";
import styles from "./auth.module.scss";
import { AiOutlineMail } from "react-icons/ai";
import Card from "../../components/card/Card";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { forgotPasswordUser, validateEmail } from "../../services/authService";

const initialState = {
  email: "",
};

const Forgot = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const forgotPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email");
    }
    setIsLoading(true);
    // const userData = { email };
    try {
      await forgotPasswordUser({email});
      setEmail("")
      setIsLoading(false);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(message);
      console.log(error)
    }
  };

  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <AiOutlineMail size={35} color="#999" />
          </div>
          <h2>Forgot password</h2>
          <form onSubmit={forgotPassword}>
            <input
              type="email"
              placeholder="Email"
              required
              name="email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <button className="--btn --btn-primary --btn-block">
              Get Reset Email
            </button>
            <span className={styles.links}>
              <p>
                <Link to="/">- Home</Link>
              </p>
              <p>
                <Link to="/register">- Login</Link>
              </p>
            </span>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Forgot;
