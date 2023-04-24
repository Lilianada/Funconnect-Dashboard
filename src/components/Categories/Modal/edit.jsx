import React, { useState, useEffect, useRef } from "react";
import Dialog from "../../Dialog";
import axios from "axios";
import "./style.css";

export default function EditModal({ closeModal, categoryId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categoryData, setCategoryData] = useState({
    name: "",
    cover_photo: null,
    status: "",
  });

  const statusRef = useRef(null);
  useEffect(() => {
    const baseUrl = process.env.REACT_APP_BASE_URL;
    const apiKey = process.env.REACT_APP_API_KEY;
    const getCategoryData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${baseUrl}/places/categories/${categoryId}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("apiToken")}`,
              "x-api-key": apiKey,
            },
          }
        );
        setCategoryData((prevData) => ({
          ...prevData,
          name: response.data.data.name,
          cover_photo: response.data.data.cover_photo,
          status: response.data.data.status,
        }));
      } catch (error) {
        setError("Unable to fetch category data.");
        setTimeout(() => {
          setError("");
        }, 4000);
      } finally {
        setLoading(false);
      }
    };
    getCategoryData();
  }, [categoryId]);

  //handle input change
  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === "cover_photo") {
      const file = event.target.files[0];
      setCategoryData((prevData) => ({
        ...prevData,
        cover_photo: file,
        cover_photo_url: URL.createObjectURL(file), // create URL object
      }));
    } else if (type === "checkbox" && name === "status") {
      setCategoryData((prevData) => ({
        ...prevData,
        status: checked ? "active" : "inactive",
      }));
    } else {
      setCategoryData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  //handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const { name, status, cover_photo } = categoryData;
    if (!name) {
      setError("Name field is required.");
      setLoading(false);
      return;
    }

    // update existing category data with new values
    const updatedCategoryData = {
      ...categoryData,
      name,
      status,
      cover_photo: cover_photo instanceof File ? cover_photo : null,
    };

    // submit updated form data
    try {
      const formData = new FormData();
      formData.append("name", updatedCategoryData.name);
      formData.append("status", updatedCategoryData.status);
      if (updatedCategoryData.cover_photo) {
        formData.append("cover_photo", updatedCategoryData.cover_photo);
      }

      const response = await axios.post(
        `${baseUrl}/places/categories/${categoryId}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("apiToken")}`,
            "x-api-key": apiKey,
            "Content-Type": "multipart/form-data",
          },
          maxBodyLength: Infinity,
        }
      );

      const resp = response.data.message;
      if (resp === "OK") {
        setSuccess("Category updated successfully!");
        setTimeout(() => {
          setSuccess("");
          window.location.reload();
        }, 4000);
      } else {
        setError(response.data.error);
        setTimeout(() => setError(""), 4000);
      }
    } catch (error) {
      setError("Unable to update Category data.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <div className="wrap__category">
        <div className="category__header">
          <h3 className="form__head">Edit Category</h3>
          <input
            type="checkbox"
            name="status"
            id="status"
            ref={statusRef}
            checked={categoryData.status === "active"}
            onChange={handleInputChange}
          />
          <label htmlFor="status"></label>
        </div>
        {loading && (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="category__form">
          <div className="form__field">
            <input
              type="file"
              name="cover_photo"
              placeholder="Cover photo"
              onChange={handleInputChange}
            />
            {categoryData.cover_photo && (
              <img
                src={categoryData.cover_photo}
                alt="Cover"
                className="form__image"
              />
            )}
          </div>
          <input
            type="text"
            name="name"
            className="form__field"
            placeholder="Name"
            value={categoryData.name}
            onChange={handleInputChange}
          />
          {error && <p className="error__message">{error}</p>}
          {success && <p className="success__message">{success}</p>}
          <div className="form__group">
            <button className="form__btn close" onClick={closeModal}>
              Close
            </button>
            <button type="submit" disabled={loading} className="form__btn save">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
