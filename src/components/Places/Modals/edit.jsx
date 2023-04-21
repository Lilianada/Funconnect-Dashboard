import React, { useState, useEffect } from "react";
import Dialog from "../../Dialog";
import axios from "axios";
import "./style.css";

export default function AddModal({ closeModal, placeId }) {
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
    email: '',
    categories: [],
    closes_at: "",
    opens_at: "",
    phone_e164: "",
    cover_photo: null,
  });

  // Get data
  useEffect(() => {
    const getPlaceData = async () => {
      setLoading(true);

      const baseUrl = process.env.REACT_APP_BASE_URL;
      const apiKey = process.env.REACT_APP_API_KEY;
      try {
        const response = await axios.get(`${baseUrl}/places/${placeId}`, {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("apiToken"),
            "Content-Type": "multipart/form-data",
            "x-api-key": apiKey,
          },
          maxBodyLength: Infinity,
        });
        setLoading(false);
        const categories = response.data.data.categories.map((category) => category.name);

        setPlaceData({
          name: response.data.data.name,
          address: response.data.data.address,
          headline: response.data.data.headline,
          description: response.data.data.description,
          country: response.data.data.country,
          state: response.data.data.state,
          city: response.data.data.city,
          email: response.data.data.email,
          closes_at: response.data.data.closes_at,
          opens_at: response.data.data.opens_at,
          phone_e164: response.data.data.phone_e164,
          longitude: response.data.data.longitude,
          latitude: response.data.data.latitude,
          cover_photo: response.data.data.cover_image_path,
          categories: categories,
        });
      } catch (error) {
        console.log(error);
        setError("Unable to fetch resource.");
        setTimeout(() => setError(""), 4000);
      } finally {
        setLoading(false);
      }
    };
    getPlaceData();
  }, [placeId]);

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === "cover_photo") {
      setPlaceData((prevData) => ({
        ...prevData,
        cover_photo: event.target.files[0] || null,
      }));
    } else {
      setPlaceData((prevData) => ({
        ...prevData,
        [name]: value || "",
      }));
    }
  };

    //handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
  
    const formData = placeData.formData;
    const coverPhoto = placeData.cover_photo.files && placeData.cover_photo.files[0];
    if (coverPhoto) {
      formData.append("cover_image_path", coverPhoto);
    }
  
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${localStorage.getItem("apiToken")}`,
      "x-api-key": process.env.REACT_APP_API_KEY,
    };
  
    try {
      const response = await axios.put(
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
      <div className="wrap__places">
        <h3 className="form__head">Edit Place</h3>
        {
            loading && <div className="loader">
                <div className="spinner"></div>
            </div>
        }
        <form onSubmit={handleSubmit} className="places__form">
          <input
            type="text"
            className="form__field"
            placeholder="Name"
            name="name"
            value={placeData.name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            className="form__field"
            placeholder="Headline"
            name="headline"
            value={placeData.headline}
            onChange={handleInputChange}
          />
          <textarea
            name="description"
            className="form__text"
            cols="30"
            rows="10"
            placeholder="Description"
            value={placeData.description}
            onChange={handleInputChange}
          ></textarea>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              placeholder="Opens at"
              name="opens_at"
              value={placeData.opens_at}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form__field"
              placeholder="Closes at"
              name="closes_at"
              value={placeData.closes_at}
              onChange={handleInputChange}
            />
          </div>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              placeholder="Phone No"
              name="phone_e164"
              value={placeData.phone_e164}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form__field"
              placeholder="Email Address (optional)"
              name="email"
              value={placeData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              placeholder="Category"
              name="categories"
              value={placeData.categories}
              onChange={handleInputChange}
            />
            <div className="form__field">
              <input
                type="file"
                name="cover_photo"
                placeholder="Cover photo (Choose file)"
                onChange={handleInputChange}
              />
              <img src={placeData.cover_photo} alt="" className="form__image" />
            </div>
          </div>
          <textarea
            name="address"
            className="form__text"
            cols="30"
            rows="10"
            placeholder="Address"
          ></textarea>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              placeholder="City"
              name="city"
              value={placeData.city}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form__field"
              placeholder="State"
              name="state"
              value={placeData.state}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form__field"
              placeholder="Country"
              name="country"
              value={placeData.country}
              onChange={handleInputChange}
            />
          </div>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              placeholder="Lat. (optional)"
              name="lat"
              value={placeData.latitude}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form__field"
              placeholder="Long. (optional)"
              name="long"
              value={placeData.longitude}
              onChange={handleInputChange}
            />
          </div>
          {success && <p className="success__message">{success}</p>}
          {error && <p className="error__message">{error}</p>}

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
