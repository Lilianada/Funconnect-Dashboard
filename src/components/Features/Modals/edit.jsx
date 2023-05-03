import React, { useState, useEffect } from "react";
import Dialog from "../../Dialog";
import axios from "axios";
import "./style.css";

export default function EditModal({ closeModal, featureId }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [featureData, setFeatureData] = useState({
    name: "",
  });

  useEffect(() => {
    const getFeatureData = async () => {
      setLoading(true);
      const baseUrl = process.env.REACT_APP_BASE_URL;
      const apiKey = process.env.REACT_APP_API_KEY;

      try {
        const response = await axios.get(
          `${baseUrl}/places/features/${featureId}`,
          {
            headers: {
              Accept: "application/json",
              Authorization: "Bearer " + localStorage.getItem("apiToken"),
              "x-api-key": apiKey,
            },
          }
        );
        setLoading(false);
        setFeatureData({
          name: response.data.data.name,
        });
      } catch (error) {
        setError("Unable to fetch feature data.");
        setTimeout(() => setError(""), 4000);
      } finally {
        setLoading(false);
      }
    };

    getFeatureData();
  }, [featureId]);

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setFeatureData({
      ...featureData,
      [name]: files ? files[0] : value,
    });
  };

  //Handle submit
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const formData = JSON.stringify({
      name: featureData.name,
    });

    try {
      const response = await axios.put(
        `${baseUrl}/places/features/${featureId}`,
        formData,
        {
          headers: {
            Accept: "application/json",
            Authorization: "Bearer " + localStorage.getItem("apiToken"),
            "Content-Type": "application/json",
            "x-api-key": apiKey,
          },
          maxBodyLength: Infinity,
        }
      );
      setLoading(false);
      if (response.data.message === "OK") {
        setSuccess("Feature data updated successfully!");
        setTimeout(() => {
          setSuccess("");
        }, 4000);
        event.target.reset();
      } else {
        const error = response.data.message;
        setError(error);
        setTimeout(() => setError(""), 4000);
      }
    } catch (error) {
      setError("Unable to update feature data.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <div className="wrap__features">
        <h3 className="form__head">Edit feature</h3>
        {loading && (
          <div className="loader">
            <div className="spinner"></div>
          </div>
        )}
        <form onSubmit={handleSubmit} className="features__form">
          <input
            type="text"
            name="name"
            className="form__field"
            placeholder="Name"
            value={featureData.name}
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
