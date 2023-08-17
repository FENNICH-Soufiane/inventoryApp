import React, { useEffect, useState } from "react";
import "./productList.scss";
import { SpinnerImg } from "../../loader/Loader";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { AiOutlineEye } from "react-icons/ai";
import Search from "../../search/Search";
import { useSelector, useDispatch } from "react-redux";
import { FILTER_PRODUCTS, selectFilteredProducts } from "../../../redux/features_Slice_Reducer/product/filterSlice";
import ReactPaginate from 'react-paginate';

const ProductList = ({ products, isLoading }) => {

  const [search, setSearch] = useState("")
  let filtredProducts = useSelector(selectFilteredProducts)
  const dispatch = useDispatch()

  const shortenText = (text, n) => {
    if (text.length > n) {
      const shortenedText = text.subStrng(0, n).concat("...");
      return shortenedText;
    }
    return text;
  };

  // Begin pagination ______________________________
  
  const itemsPerPage = 1;
  const [itemOffset, setItemOffset] = useState(0);

  
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = filtredProducts.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  
  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  }
  
  // End pagination ____________________________________

  useEffect(() => {
    dispatch(FILTER_PRODUCTS({products, search}))
  }, [products, search, dispatch])

  return (
    <div className="product-list">
      <hr />
      <div className="table">
        <div className="--flex-between --flex-dir-column">
          <span>
            <h3>Inventory Items</h3>
          </span>
          <span>
            <Search value={search} onChange={(e) => setSearch(e.target.value)} />
          </span>
        </div>

        {isLoading && <SpinnerImg />}

        <div className="table">
          {!isLoading && products.length === 0 ? (
            <p>-- No product found, please add a product...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>s/n</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Value</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((product, index) => {
                  const actualIndex = itemOffset + index + 1;
                  const { _id, name, category, price, quantity } = product;
                  return (
                    <tr key={_id}>
                      <td>{actualIndex}</td>
                      <td>{shortenText(name, 15)}</td>
                      <td>{category}</td>
                      <td>
                        {"$"}
                        {price}
                      </td>
                      <td>{quantity}</td>
                      <td>
                        {"$"}
                        {price * quantity}
                      </td>
                      <td className="icons">
                        <span>
                          <AiOutlineEye size={25} color={"purple"} />
                        </span>
                        <span>
                          <FaEdit size={20} color={"green"} />
                        </span>
                        <span>
                          <FaTrashAlt size={17} color={"red"} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        pageCount={pageCount}
        previousLabel="Prev"
        renderOnZeroPageCount={null}
        containerClassName="pagination"
        pageLinkClassName="page-num"
        previousLinkClassName="page-num"
        nextLinkClassName="page-num"
        activeLinkClassName="activePage"
      />
      </div> 
    </div>
  );
};

export default ProductList;
