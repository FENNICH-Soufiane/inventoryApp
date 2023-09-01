import React, { useEffect, useState } from "react";
import "./Profile.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  SET_USER,
  selectUser,
} from "../../redux/features_Slice_Reducer/auth/authSlice";
import Loader from "../../components/loader/Loader";
import { getUser } from "../../services/authService";
import Card from "../../components/card/Card";
import { Link, useNavigate } from "react-router-dom";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const user = useSelector(selectUser);

  console.log(user);
  

  const initialProfileState = {
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
    photo: user?.photo || "",
  };

  const [profile, setProfile] = useState(initialProfileState);

  console.log(profile);
  const [profileImage, setProfileImage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };
  const handleImageChange = (e) => {
    setProfileImage(e.target.files[0]);
  };

  const saveProfile = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const x = await getUser();
    console.log(x);
    dispatch(SET_USER(x));
    setIsLoading(false);

  };

  return (
    <div className="profile --my2">
      {isLoading && <Loader />}
      <Card cardClass={"card --flex-dir-column"}>
        <span className="profile-photo">
          <img src={user?.photo} alt="profilepic" />
        </span>
        <form className="--form-control" onSubmit={saveProfile}>
          <span className="profile-data">
            <p>
              <label htmlFor="">Name</label>
              <input
                type="text"
                name="name"
                value={profile?.name}
                onChange={handleInputChange}
              />
            </p>
            <p>
              <label htmlFor="">Email</label>
              <input
                type="email"
                name="email"
                value={profile?.email}
                disabled
                onChange={handleInputChange}
              />
              <br />
              <code>Email cannot be changed.</code>
            </p>
            <p>
              <label htmlFor="">Phone</label>
              <input
                type="text"
                name="phone"
                value={profile?.phone}
                onChange={handleInputChange}
              />
            </p>
            <p>
              <label htmlFor="">Bio</label>
              <textarea
                name="bio"
                value={profile?.bio}
                onChange={handleInputChange}
                cols="30"
                rows="10"
              ></textarea>
            </p>
            <p>
              <label htmlFor="">Photo</label>
              <input type="file" name="image" onChange={handleImageChange} />
            </p>
            <div>
              <button className="--btn --btn-primary">Edit Profile</button>
            </div>
          </span>
        </form>
      </Card>
    </div>
  );
};

export default EditProfile;
