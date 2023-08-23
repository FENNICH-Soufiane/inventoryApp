import React, { useEffect, useState } from "react";
import "./Profile.scss"
import useRedirectLoggedOutUser from "../../customHook/useRedirectLoggedOutUser";
import { useDispatch } from "react-redux";

const Profile = () => {
  useRedirectLoggedOutUser("/login")
  const dispatch = useDispatch()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  useEffect(() => {

  }, [])

  
  return <div>
    ok tout le monde
  </div>;
};

export default Profile;
