import React, { useState, useEffect } from "react";
import Dialog from "../../Dialog";
import axios from "axios";
import "./style.css";

export default function AddModal({ closeModal }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [categories, setCategories] = useState([]);

  const postPlaces = async (event) => {
    event.preventDefault();
    setLoading(true);

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const formData = new FormData();
    formData.append("name", event.target.elements.name.value);
    formData.append("headline", event.target.elements.headline.value);
    formData.append("description", event.target.elements.description.value);
    formData.append("address", event.target.elements.address.value);
    formData.append("country", event.target.elements.country.value);
    formData.append("state", event.target.elements.state.value);
    formData.append("city", event.target.elements.city.value);
    formData.append("closes_at", event.target.elements.closes_at.value);
    formData.append("opens_at", event.target.elements.opens_at.value);
    formData.append("phone_e164", event.target.elements.phone_e164.value);
    const coverPhoto = event.target.elements.cover_photo.files[0];
    if (coverPhoto) {
      formData.append("cover_photo", coverPhoto);
    }

    try {
      const response = await axios.post(`${baseUrl}/places`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("apiToken"),
          "Content-Type": "multipart/form-data",
          "x-api-key": apiKey,
        },
        maxBodyLength: Infinity,
      });
      setLoading(false);
      if (response.data.message === "Resource Created.") {
        setSuccess("Resource created successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 4000);
        event.target.reset();
      } else {
        const error = response.data.error.message;
        setError(error);
        setTimeout(() => setError(""), 4000);
      }
    } catch (error) {
      setError("Unable to post resource.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  //get categories
  useEffect(() => {
    const getCategories = async () => {
      setLoading(true);
      try {
        const apiToken = localStorage.getItem("apiToken");
        let url = "https://api.funconnect.app/places/categories";
        const response = await axios.get(url, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${apiToken}`,
          },
        });
        const responseBody = response.data;
        if (responseBody.message === "OK") {
          const firstPageCategories = responseBody.data.data;
          setCategories(
            firstPageCategories.map((category) => ({
              id: category.id,
              name: category.name,
            }))
          );
          if (responseBody.data.next_page_url !== null) {
            const nextPageResponse = await axios.get(
              responseBody.data.next_page_url,
              {
                headers: {
                  Accept: "application/json",
                  Authorization: `Bearer ${apiToken}`,
                },
              }
            );
            const nextPageCategories = nextPageResponse.data.data.map(
              (category) => ({ id: category.id, name: category.name })
            );
            setCategories((prevCategories) => [
              ...prevCategories,
              ...nextPageCategories,
            ]);
          }
        } else {
          throw new Error("Unable to fetch data.");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getCategories();
  }, []);

  return (
    <Dialog>
      <div className="wrap__places">
        <h3 className="form__head">Add Place</h3>
        <form onSubmit={postPlaces} className="places__form">
          <input
            type="text"
            className="form__field"
            placeholder="Name"
            name="name"
          />
          <input
            type="text"
            className="form__field"
            placeholder="Headline"
            name="headline"
          />
          <textarea
            name="description"
            className="form__text"
            cols="30"
            rows="10"
            placeholder="Description"
          ></textarea>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              placeholder="Opens at"
              name="opens_at"
            />
            <input
              type="text"
              className="form__field"
              placeholder="Closes at"
              name="closes_at"
            />
          </div>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              placeholder="Phone No"
              name="phone_e164"
            />
            <input
              type="text"
              className="form__field"
              placeholder="Email Address (optional)"
              name="email"
            />
          </div>
          <div className="form__group">
            <select className="form__field" placeholder="Categories">
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <input
              type="file"
              className="form__field"
              placeholder="Cover photo (Choose file)"
              name="cover_photo"
            />
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
            />
            <input
              type="text"
              className="form__field"
              placeholder="State"
              name="state"
            />
            <input
              type="text"
              className="form__field"
              placeholder="Country"
              name="country"
            />
          </div>
          <div className="form__group">
            <input
              type="text"
              className="form__field"
              placeholder="Lat. (optional)"
              name="lat"
            />
            <input
              type="text"
              className="form__field"
              placeholder="Long. (optional)"
              name="long"
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
