import React from "react";
import { useSelector } from "react-redux";
import { selectIsLoggedIn } from "../../redux/features_Slice_Reducer/auth/authSlice";


export const ShowOnLogin = ({children}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  if(isLoggedIn) {
    return <>{children}</>
  }
  return null
};
export const ShowOnLogout = ({children}) => {
  const isLoggedIn = useSelector(selectIsLoggedIn)
  if(!isLoggedIn) {
    return <>{children}</>
  }
  return null
};

