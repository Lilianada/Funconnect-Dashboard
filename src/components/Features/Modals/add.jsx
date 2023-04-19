import React, { useState } from "react";
import Dialog from "../../Dialog";
import axios from "axios";
import "./style.css";

export default function AddModal({ closeModal }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const postFeature = async (event) => {
    event.preventDefault();
    setLoading(true);

    const baseUrl = process.env.REACT_APP_BASE_URL;
    const apiKey = process.env.REACT_APP_API_KEY;

    const formData = new FormData();
    formData.append("name", event.target.elements.name.value);
    

    try {
      const response = await axios.post(`${baseUrl}/places/features`, formData, {
        headers: {
          Accept: "application/json",
          Authorization: "Bearer " + localStorage.getItem("apiToken"),
          "x-api-key": apiKey,
        },
        maxBodyLength: Infinity,
      });
      setLoading(false);
      if (response.data.message === "Created") {
        setSuccess("Feature added successfully!");
        setTimeout(() => {setSuccess("")}, 4000);
        event.target.reset(); 
      } else {
        const error = response.data.error.message;
        setError(error);
        setTimeout(() => setError(""), 4000);
      }
    } catch (error) {
      setError("Unable to post data. The name has already been taken.");
      setTimeout(() => setError(""), 4000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <div className="wrap__features">
          <h3 className="form__head">Add New Feature</h3>
        <form onSubmit={postFeature} className="features__form">
          <input
            type="text"
            className="form__field"
            placeholder="Name"
            name="name"
          />

          {success && (
            <p className="success__message">{success}</p>
          )}
          {error && (
            <p className="error__message">{error}</p>
          )}

          <div className="form__group">
            <button className="form__btn close" onClick={closeModal}>
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="form__btn save"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}
