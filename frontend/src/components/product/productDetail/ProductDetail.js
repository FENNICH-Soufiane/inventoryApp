import React, { useEffect } from "react";
import "./productDetail.scss"
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIsLoggedIn } from "../../../redux/features_Slice_Reducer/auth/authSlice";

const ProductDetail = () => {
  useRedirectLoggedOutUser('/login')
  const dispatch = useDispatch()
  // id_ vient du params en route en app.js
  const {id_} = useParams()
  const isLoggedIn = useSelector(selectIsLoggedIn)
  const {product, isLoading, isError, message} = useSelector((state) => state.product)
  useEffect(() => {
    if (isLoggedIn === true) {
      // dispatch(getProduct())

      if(isError) {
        console.log(isError)
      }
    }
  }, [isLoggedIn, isError, message, dispatch])
  return <div>
    {id_}
  </div>;
};

export default ProductDetail;
