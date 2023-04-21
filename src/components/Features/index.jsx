import React, { useState, useEffect } from "react";
import Header from "../Header";
import AddModal from "./Modals/add";
import EditModal from "./Modals/edit";
import axios from "axios";
import "./style.css";

export default function Features() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [features, setFeatures] = useState([]);
  const [featureId, setFeatureId] = useState(null);

  useEffect(() => {
    getFeatures(); 
  }, []); 

  const getFeatures = async () => {
    const apiToken = localStorage.getItem("apiToken");
    setLoading(true);
    try {
      const response = await axios.get(
        "https://api.funconnect.app/places/features",
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
        const features = responseBody.data.data;
        setFeatures(features);
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
  function handleEditModal(featureId) {
    return () => {
      setFeatureId(featureId);
      setEditModal(true);
    };
  }
  

  //closes edit modal
  function closeModal() {
    setEditModal(false);
    setFeatureId(null);
    console.log(setFeatureId);
  }

  return (
    <div className="">
      <Header />
      <div className="features">
        <div className="features__header">
          <h3>A list of all the available features</h3>
          <button className="header__btn" onClick={handleModal}>
            Add New Category
          </button>
        </div>
        {loading ? ( // Conditional rendering for CSS spinner
          <div className="loader">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="features__body">
            {features.map((feature) => {
              return (
                <div
                  className="features__item"
                  key={feature.id}
                  onClick={handleEditModal(feature.id)}
                >
                  <p className="features__name">{feature.name}</p>
                </div>
              );
            })}
          </div>
        )}
        {editModal && (
          <EditModal closeModal={closeModal} featureId={featureId} />
        )}
        {modal && <AddModal closeModal={handleModal} />}
      </div>
    </div>
  );
}
