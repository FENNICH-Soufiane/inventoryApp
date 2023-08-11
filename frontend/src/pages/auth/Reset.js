import React, { useState } from "react";
import styles from "./auth.module.scss";
import { MdPassword } from "react-icons/md";
import Card from "../../components/card/Card";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { resetPasswordUser } from "../../services/authService";

const initialState = {
  newPassword: "",
  password2: "",
};

const Reset = () => {
  const [formData, setFormData] = useState(initialState);
  const { newPassword, password2 } = formData;
  const { resetToken } = useParams();
  const navigate = useNavigate()

  const handleImputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      return toast.error("Passwords must be up to 6 characters");
    }
    if (newPassword !== password2) {
      return toast.error("Passwords do not match");
    }
    const userData = {
      newPassword, // newPassword est le meme que dans le backend
    };
    try {
      const data = await resetPasswordUser(userData, resetToken);
      toast.success(data.message);
      navigate("/login");
    } catch (error) {
      toast.error(error.message);
      console.log(error.message);
    }
  };

  return (
    <div className={`container ${styles.auth}`}>
      <Card>
        <div className={styles.form}>
          <div className="--flex-center">
            <MdPassword size={35} color="#999" />
          </div>
          <h2>Reset Password</h2>
          <form onSubmit={resetPassword}>
            <input
              type="password"
              placeholder="New Password"
              required
              name="newPassword"
              value={newPassword}
              onChange={handleImputChange}
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              required
              name="password2"
              value={password2}
              onChange={handleImputChange}
            />
            <button className="--btn --btn-primary --btn-block">
              Reset Password
            </button>
            <span className={styles.links}>
              <p>
                <Link to="/">Home</Link>
              </p>
              <p>
                <Link to="/register">Register</Link>
              </p>
            </span>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Reset;
