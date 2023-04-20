import React, { useState, useEffect, useRef } from "react";
import Dialog from "../../Dialog";
import axios from "axios";
import "./style.css";

export default function EditModal({ closeModal, placeId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [placeData, setPlaceData] = useState({
    name: "",
    address: "",
    headline: "",
    description: "",
    country: "",
    state: "",
    city: "",
    closes_at: "",
    opens_at: "",
    phone_e164: "",
    cover_photo: null,
  });

  const statusRef = useRef(null);

  useEffect(() => {
    const getPlaceData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/places/${placeId}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${localStorage.getItem("apiToken")}`,
              "x-api-key": process.env.REACT_APP_API_KEY,
            },
          }
        );
        setPlaceData((prevData) => ({
          ...prevData,
          name: response.data.data.name,
          headline: response.data.data.headline,
          description: response.data.data.description,
          address: response.data.data.address,
          country: response.data.data.country,
          state: response.data.data.state,
          city: response.data.data.city,
          closes_at: response.data.data.closes_at,
          opens_at: response.data.data.opens_at,
          phone_e164: response.data.data.phone_e164,
          cover_photo: response.data.data.cover_photo,
        }));
      } catch (error) {
        console.error(error);
        setError("Unable to fetch Place data.");
      } finally {
        setLoading(false);
      }
    };
    getPlaceData();
  }, [placeId]);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (name === "cover_photo") {
      setPlaceData((prevData) => ({
        ...prevData,
        cover_photo: event.target.files[0],
      }));
    } else if (type === "checkbox" && name === "status") {
      setPlaceData((prevData) => ({
        ...prevData,
        status: checked ? "active" : "inactive",
      }));
    } else {
      setPlaceData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("name", placeData.name);
    formData.append("status", placeData.status || "inactive");
    formData.append("cover_photo", placeData.cover_photo);
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("apiToken")}`,
      "x-api-key": process.env.REACT_APP_API_KEY,
    };

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/places/${placeId}`,
        formData,
        { headers, maxBodyLength: Infinity }
      );
      if (response.status === 200) {
        setSuccess("Place updated successfully!");
        setTimeout(() => {
          setSuccess("");
          closeModal();
        }, 4000);
      } else {
        setError(response.data.error);
        setTimeout(() => setError(""), 4000);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to update Place data.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <div className="wrap__Place">
        <div className="Place__header">
          <h3 className="form__head">Edit Place</h3>
          <input type="checkbox" name="status" id="status" ref={statusRef} />
          <label htmlFor="status"></label>
        </div>

        <form onSubmit={handleSubmit} className="Place__form">
          <div className="form__field">
            <input
              type="file"
              name="cover_photo"
              placeholder="Cover photo"
              onChange={handleInputChange}
            />
            <img
              src={placeData.cover_photo}
              alt=""
              className="form__image"
            />
          </div>
          <input
            type="text"
            name="name"
            className="form__field"
            placeholder="Name"
            value={placeData.name}
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
