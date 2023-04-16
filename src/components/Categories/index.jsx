import React, { useState } from "react";
import Header from "../Header";
import AddModal from "./Modal/add";
import EditModal from "./Modal/edit";
import "./style.css";

export default function Categories() {
  const categories = [
    {
      name: "Category 1",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Category 2",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Category 3",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Category 4",
      image: "https://picsum.photos/200/300",
    },
    {
      name: "Category 5",
      image: "https://picsum.photos/200/300",
    },
  ];

  const [modal, setModal] = useState(false);
  const handleModal = () => {
    setModal(!modal);
  };

  const [editModal, setEditModal] = useState(false);
  const handleEditModal = () => {
    setEditModal(!editModal);
  };

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
        <div className="categories__body">
          {categories.map((category) => {
            return (
              <div className="category__item" onClick={handleEditModal}>
                <div className="category__image"></div>
                <p className="category__name">{category.name}</p>
              </div>
            );
          })}
        </div>
        {
            editModal && <EditModal closeModal={handleEditModal} />
        }
        {
            modal && <AddModal closeModal={handleModal} />
        }
      </div>
    </div>
  );
}
