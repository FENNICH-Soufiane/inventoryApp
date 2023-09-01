import React, { useState } from "react";
import "./ChangePassword.scss";
import { toast } from "react-toastify";
import { changePassword } from "../../services/authService";
import Card from "../card/Card";


const ChangePassword = () => {
  const initialState = {
    oldPassword: "",
    newPassword: "",
    newPassword2: "",
  };
  const [formData, setFormData] = useState(initialState);
  const { oldPassword, newPassword, confirmNewPassword } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const changePass = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      return toast.error("New passwords do not match");
    }
    const formData = {
      oldPassword,
      newPassword,
    };
    const data = await changePassword(formData);
    toast.success(data);
  };

  return (
    <div className="change-password">
      <Card cardClass={"password-card"}>
        <h3>Change Password</h3>
        <form onSubmit={changePass} className="--form-control">
          <input
            type="password"
            placeholder="Old Password"
            required
            name="oldPassword"
            value={oldPassword}
            onChange={handleInputChange}
          />
          <input
            type="password"
            placeholder="New Password"
            required
            name="newPassword"
            value={newPassword}
            onChange={handleInputChange}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            required
            name="confirmNewPassword"
            value={confirmNewPassword}
            onChange={handleInputChange}
          />
          <button type="submit" className="--btn --btn-primary">
            Change Password
          </button>
        </form>
      </Card>
    </div>
  );
};

export default ChangePassword;
