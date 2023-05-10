import React, { useState, useEffect } from "react";
import Dialog from "../../Dialog";
import Multiselect from "multiselect-react-dropdown";
import axios from "axios";
import "./style.css";

// Define the EditModal component
export default function EditModal({ closeModal, placeId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [placeData, setPlaceData] = useState({
    name: "",
    address: "",
    headline: "",
    description: "",
    country: "",
    state: "",
    city: "",
    email: "",
    categories: [],
    opens_at: "",
    closes_at: "",
    phone_e164: "",
    cover_image_path: null,
  });

  // Get categories
  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const apiToken = localStorage.getItem("apiToken");
        const url = `${process.env.REACT_APP_BASE_URL}/places/categories`;
        const response = await axios.get(url, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
        });
        const responseBody = response.data;
        if (responseBody.message === "OK") {
          const allCategories = responseBody.data.data.map((category) => ({
            id: category.id,
            name: category.name,
          }));
          setCategories(allCategories);
        } else {
          throw new Error("Unable to fetch categories.");
        }
      } catch (error) {
        console.error(error);
        setError("Unable to fetch categories.");
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  // Get place data
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
              "Content-Type": "multipart/form-data",
              "x-api-key": process.env.REACT_APP_API_KEY,
            },
            maxBodyLength: Infinity,
          }
        );
        const place = response.data.data;
        const categories = place.categories.map((category) => category.name);
        setPlaceData({
          name: place.name,
          address: place.location.address,
          headline: place.headline,
          description: place.description,
          country: place.location.country,
          state: place.location.state,
          city: place.location.city,
          email: place.email_address,
          closes_at: place.closes_at,
          opens_at: place.opens_at,
          phone_e164: place.phone_e164,
          longitude: place.location.long,
          latitude: place.location.lat,
          cover_image_path: place.cover_image_path,
          categories: place.categories,
        });
        console.log(place);
      } catch (error) {
        console.error(error);
        setError("Unable to fetch place data.");
      } finally {
        setLoading(false);
      }
    };
    getPlaceData();
  }, [placeId]);

  // Handle input change
  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Check if the input is a time field
    if (event.target.type === "time") {
      // Split the value into hours and minutes
      const [hours, minutes] = value.split(":");

      // Format the time as "H:i"
      const formattedTime = `${hours.padStart(2, "0")}:${minutes.padStart(
        2,
        "0"
      )}`;

      setPlaceData((prevState) => ({
        ...prevState,
        [name]: formattedTime,
      }));
    } else {
      setPlaceData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const apiToken = localStorage.getItem("apiToken");
      const url = `${process.env.REACT_APP_BASE_URL}/places/${placeId}`;
      const formData = new FormData();
      Object.entries(placeData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          if (key === "categories") {
            formData.append(key, JSON.stringify(selectedCategories));
          } else {
            formData.append(key, value);
          }
        }
      });
      const response = await axios.post(url, formData, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${apiToken}`,
          "Content-Type": "multipart/form-data",
          "x-api-key": process.env.REACT_APP_API_KEY,
        },
      });
      const responseBody = response.data;
      if (responseBody.message === "Updated") {
        setSuccess("Place updated successfully!");
        setTimeout(() => setSuccess(""), 4000);
        console.log(responseBody);
      } else {
        const error = response.message;
        setError(error);
        setTimeout(() => setError(""), 4000);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to update place.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <div className="wrap__places">
        <h3 className="form__head">Edit Place</h3>
        {loading && (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="places__form">
          <input
            type="text"
            className="form__field"
            placeholder="Name"
            name="name"
            value={placeData.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            className="form__field"
            placeholder="Headline"
            name="headline"
            value={placeData.headline}
            onChange={handleInputChange}
            required
          />
          <textarea
            name="description"
            className="form__text"
            cols="30"
            rows="10"
            placeholder="Description"
            value={placeData.description}
            onChange={handleInputChange}
            required
          ></textarea>
          <div className="form__group">
            <input
              type="time"
              className="form__field"
              placeholder="Opens at"
              name="opens_at"
              value={placeData.opens_at}
              onChange={handleInputChange}
              required
            />
            <input
              type="time"
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
          <Multiselect
  options={categories.map((category) => ({
    key: category.id,
    value: category.name,
  }))}
  selectedValues={
    Array.isArray(selectedCategories)
      ? selectedCategories.map((categoryId) => ({
          key: categoryId,
          value: categories.find((category) => category.id === categoryId)?.name,
        }))
      : []
  }
  displayValue="value"
  onSelect={(selectedList) => {
    const selectedCategories = selectedList.map((item) => item.key);
    setSelectedCategories(selectedCategories);
  }}
  onRemove={(selectedList) => {
    const selectedCategories = selectedList.map((item) => item.key);
    setSelectedCategories(selectedCategories);
  }}
  placeholder="Select categories"
  className="select__field"
/>
          <div className="form__group">
            <div className="form__field">
              <input
                type="file"
                name="cover_image_path"
                placeholder="Cover photo (Choose file)"
                onChange={handleInputChange}
              />
              <img
                src={placeData.cover_image_path}
                alt=""
                className="form__image"
              />
            </div>
          </div>
          <textarea
            name="address"
            className="form__text"
            cols="30"
            rows="10"
            placeholder="Address"
            value={placeData.address}
            onChange={handleInputChange}
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
              name="latitude"
              value={placeData.latitude}
              onChange={handleInputChange}
            />
            <input
              type="text"
              className="form__field"
              placeholder="Long. (optional)"
              name="longitude"
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
