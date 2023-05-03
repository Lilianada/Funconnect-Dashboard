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
  const [currentPage, setCurrentPage] = useState(1);
  const [nextPage, setNextPage] = useState(null);
  const [prevPage, setPrevPage] = useState(null);

  useEffect(() => {
    getFeatures();
  }, []);

  const getFeatures = async (page) => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const apiToken = localStorage.getItem("apiToken");
    setLoading(true);
    try {
      let url = `${baseUrl}/places/features?page=${currentPage}`;
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
        const features = responseBody.data.data;
        setNextPage(responseBody.data.next_page_url);
        setPrevPage(responseBody.data.prev_page_url);
        console.log(responseBody.data);
        setFeatures(features);
      } else {
        setError("Unable to fetch data.");
        setTimeout(() => setError(""), 4000);
      }
    } catch (error) {
      setError("Unable to fetch data. Please try again.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleNextPage = () => {
    if (nextPage !== null) {
      getFeatures(nextPage);
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (prevPage !== null) {
      getFeatures(prevPage);
      setCurrentPage(currentPage - 1);
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
  }

  return (
    <div className="">
      <Header />
      <div className="features">
        <div className="features__header">
          <h3>A list of all the available features</h3>
          <button className="header__btn" onClick={handleModal}>
            Add New Feature
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
        <div className="features__footer">
          {prevPage && (
            <button
              className="footer__btn prev"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
          )}
          {nextPage && (
            <button
              className="footer__btn next"
              onClick={handleNextPage}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
