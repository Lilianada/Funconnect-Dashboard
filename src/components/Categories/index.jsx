import React, { useState, useEffect } from "react";
import Header from "../Header";
import AddModal from "./Modal/add";
import EditModal from "./Modal/edit";
import axios from "axios";
import "./style.css";

export default function Categories() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryId, setCategoryId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
const [prevPage, setPrevPage] = useState(null);

useEffect(() => {
  getCategories(); // Fetch categories on component mount
}, []); // Empty dependency array to run effect only once

const getCategories = async (page) => {
  const apiToken = localStorage.getItem("apiToken");
  setLoading(true);
  try {
    let url = `https://api.funconnect.app/places/categories?page=${currentPage}`;
    if (page) {
      url = page;
    }
    const response = await axios.get(url, {
      headers: {
        Accept: "application/json",
        Authorization: "Bearer " + apiToken,
      },
    });
    setLoading(false);
    const responseBody = response.data;
    if (responseBody.message === "OK") {
      const categories = responseBody.data.data;
      setNextPage(responseBody.data.next_page_url);
      setPrevPage(responseBody.data.prev_page_url);
      setCategories(categories);
      setCurrentPage(responseBody.data.current_page);
      console.log(responseBody.data.data);
    } else {
      setError("Unable to fetch data.");
    }
  } catch (error) {
    setError("Unable to fetch data. Please try again.");
  } finally {
    setLoading(false);
  }
};

const handleNextPage = () => {
  if (nextPage !== null) {
    getCategories(nextPage);
  }
};

const handlePreviousPage = () => {
  if (prevPage !== null) {
    getCategories(prevPage);
  }
};


  
  //open and close add modal
  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(!modal);
  };

  //opens edit modal
  const [editModal, setEditModal] = useState(false);
  function handleEditModal(categoryId) {
    return () => {
      setCategoryId(categoryId);
      setEditModal(true);
    };
  }

  //closes edit modal
  function closeModal() {
    setEditModal(false);
    setCategoryId(null);
  }

  return (
    <div className="">
      <Header />
      <div className="categories">
        <div className="categories__header">
          <h3>A list of all the available categories</h3>
          <button className="header__btn" onClick={handleModal}>
            Add New Category
          </button>
        </div>
        {
            loading && <div className="loader">
                <div className="spinner"></div>
            </div>
        }
          <div className="categories__body">
            {categories.map((category) => {
              return (
                <div
                  className="category__item"
                  key={category.id}
                  onClick={handleEditModal(category.id)}
                >
                  <img
                    className="category__image"
                    src={category.cover_photo}
                    alt="cover photos"
                  />
                  <p className="category__name">{category.name}</p>
                </div>
              );
            })}
          </div>
        {editModal && (
          <EditModal closeModal={closeModal} categoryId={categoryId} />
        )}
        {modal && <AddModal closeModal={handleModal} />}
        {
          nextPage && (
            <div className="categories__footer">
              <button
                className="footer__btn prev"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className="footer__btn next"
                onClick={handleNextPage}
                // disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>

          )
        }
      </div>
    </div>
  );
}
