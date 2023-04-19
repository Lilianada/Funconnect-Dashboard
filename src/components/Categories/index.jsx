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

  useEffect(() => {
    getCategories(); // Fetch categories on component mount
  }, []); // Empty dependency array to run effect only once

  const getCategories = async () => {
    // Retrieve apiToken from local storage
    const apiToken = localStorage.getItem("apiToken");
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.funconnect.app/places/categories",
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + apiToken,
          },
        }
      );
      setLoading(true);
      const responseBody = response.data;
      if (responseBody.message === "OK") {
        const categories = responseBody.data.data;
        setCategories(categories);
      } else {
        setError("Unable to fetch data.");
      }
      setLoading(false);
    } catch (error) {
      console.error(error);
      setError("Unable to fetch data. Please try again.");
    } finally {
      setLoading(false);
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
        {loading ? ( // Conditional rendering for CSS spinner
          <div className="spinner"></div>
        ) : (
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
        )}
        {editModal && (
          <EditModal closeModal={closeModal} categoryId={categoryId} />
        )}
        {modal && <AddModal closeModal={handleModal} />}
      </div>
    </div>
  );
}
