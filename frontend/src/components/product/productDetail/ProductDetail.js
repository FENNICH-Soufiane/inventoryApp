import React, { useEffect } from "react";
import "./productDetail.scss";
import useRedirectLoggedOutUser from "../../../customHook/useRedirectLoggedOutUser";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectIsLoggedIn } from "../../../redux/features_Slice_Reducer/auth/authSlice";
import { getProduct } from "../../../redux/features_Slice_Reducer/product/productSlice";
import Card from "../../card/Card";
import DOMPurify from 'dompurify';

const ProductDetail = () => {
  useRedirectLoggedOutUser("/login");
  const dispatch = useDispatch();
  // id_ vient du params en route en app.js
  const { id } = useParams();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const { product, isLoading, isError, message } = useSelector(
    (state) => state.product
  );

  const stockStatus = (quantity) => {
    if (quantity > 0) {
      return <span className="--color-success">In Stock</span>;
    }
    return <span className="--color-danger">Out Of Stock</span>;
  };



  useEffect(() => {
    if (isLoggedIn === true) {
      dispatch(getProduct(id));
      console.log(product);
    }
    if (isError) {
      console.log(isError);
    }
  }, [isLoggedIn, isError, message, dispatch]);
  return (
    <div className="product-detail">
      <h3 className="--mt">Product Detail</h3>
      <Card cardClass="card">
        {product && (
          <div className="detail">
            <Card cardClass="group">
              {product?.image ? (
                <img
                  src={product.image.filePath}
                  alt={product.image.fileName}
                />
              ) : (
                <p>No image set for this product</p>
              )}
            </Card>
            <h4>Product Availability: {stockStatus(product?.quantity)}</h4>
            <hr />
            <h4>
              <span className="badge">Name: </span>&nbsp;
              {product?.name}
            </h4>
            <p>
              <b>&rarr; SKU: </b>{product?.sku}
            </p>
            <p>
              <b>&rarr; Category: </b>{product?.category}
            </p>
            <p>
              <b>&rarr; Price: </b>{"$"}{product?.price}
            </p>
            <p>
              <b>&rarr; Quantity: </b>{product?.quantity}
            </p>
            <p>
              <b>&rarr; Total Value in Stock: </b>{"$"}{product?.quantity * product?.price}
            </p>
            <hr />
            <p className="">
              <b>&rarr; Description: </b>&nbsp;<p dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(product?.description) }}></p>
            </p>
            <hr />
            <code className="--color-dark">Created on: {product.createdAt.toLocaleString("en-US")}</code><br />
            <code className="--color-dark">Last Updated : {product.updatedAt.toLocaleString("en-US")}</code>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ProductDetail;
