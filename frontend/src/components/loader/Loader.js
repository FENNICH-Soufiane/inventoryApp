import React from "react";
import loaderImg from "../../assets/loader.gif";
import ReactDOM from "react-dom";

import "./Loader.scss"

const Loader = () => {
  const portalRoot = document.getElementById("loader");

  return ReactDOM.createPortal(
    <div className="wrapper">
      <div className="loader">
        <img src={loaderImg} alt="Loading ..." />
      </div>
    </div>,
    portalRoot
    // onpeut mettre directement ce lign de code à la place de portalRoot
    //document.getElementById('loader')
  );
};

// export const SpinnerImg = () => {
//   return (
//     <div className="--center-all">
//       <img src={loaderImg} alt="Loading ..." />
//     </div>
//   );
// };

export default Loader;
