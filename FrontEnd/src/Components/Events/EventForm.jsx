import { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";
import axios from "axios";
import { useDropzone } from "react-dropzone";

function EventForm({ token }) {
  const [show, setShow] = useState(false);
  const [userID, setUserID] = useState(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getUserId(token);
  }, [token]);

  const getUserId = async (token) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserID(response.data.id);
    } catch (error) {
      console.error("Fetching user id failed:", error);
    }
  };

  const addTimeToDate = (date, time) => {
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}T${time}:00`;
  };

  const validateForm = () => {
    const newErrors = {};

    setName(name.trim());
    setCategory(category.trim());
    setLocation(location.trim());
    setPhoto(photo);

    if (!name.trim()) {
      newErrors.name = "Pavadinimas būtinas.";
    } else if (name.trim().length < 5) {
      newErrors.name = "Pavadinimas per trumpas.";
    }

    if (!category.trim()) {
      newErrors.category = "Kategorija būtina.";
    } else if (category.trim().length < 5) {
      newErrors.category = "Kategorija per trumpa.";
    }

    if (!date.trim()) {
      newErrors.date = "Data būtina.";
    }

    if (!time.trim()) {
      newErrors.time = "Laikas būtinas.";
    }

    if (!location.trim()) {
      newErrors.location = "Vieta būtina.";
    } else if (location.trim().length < 5) {
      newErrors.location = "Vieta per trumpa.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    if (id === "name") {
      setName(value);
    } else if (id === "category") {
      setCategory(value);
    } else if (id === "date") {
      setDate(value);
    } else if (id === "time") {
      setTime(value);
    } else if (id === "location") {
      setLocation(value);
    }
  };

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  const createEvent = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dateTime = addTimeToDate(date, time);

    const formData = new FormData();
    formData.append('usersId', userID);
    formData.append('name', name.trim());
    formData.append('category', category.trim());
    formData.append('date', dateTime);
    formData.append('location', location.trim());
    if (photo) {
      formData.append('photo', photo);
    }

    try {
      await axios.post(
        "http://localhost:3000/api/events/",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      setShow(true);
      setName("");
      setCategory("");
      setDate("");
      setTime("");
      setLocation("");
      setPhoto(null);
      setPhotoPreview(null);
      setErrors({});
    } catch (error) {
      console.error("Creating event failed:", error);
    }
  };

  return (
    <div>
      <h1 className="text-center">Sukūrti Renginį</h1>
      <form
        className="
          d-flex flex-column align-items-center bg-secondary w-50 p-5
          border border-3 border-dark rounded mt-5 mx-auto
          "
        encType="multipart/form-data"
        onSubmit={createEvent}
      >
        {show ? (
          <Alert
            className="mb-2 text-success fs-5 fw-bold"
            variant="success"
            onClose={() => setShow(false)}
            dismissible
          >
            Renginys Sukūrtas
          </Alert>
        ) : (
          <div />
        )}
        <label className="fs-5 fw-bold" htmlFor="name">
          Pavadinimas:
        </label>
        <input
          type="text"
          id="name"
          placeholder="Pavadinimas"
          className={`mb-4 rounded w-75 ${errors.name ? 'is-invalid' : ''}`}
          value={name}
          onChange={handleInputChange}
        />
        {errors.name && <div className="text-danger fw-bold fs-5 mb-4">{errors.name}</div>}
        <label className="fs-5 fw-bold" htmlFor="category">
          Kategorija:
        </label>
        <input
          type="text"
          id="category"
          placeholder="Kategorija"
          className={`mb-3 rounded w-75 ${errors.category ? 'is-invalid' : ''}`}
          value={category}
          onChange={handleInputChange}
        />
        {errors.category && <div className="text-danger fw-bold fs-5 mb-4">{errors.category}</div>}
        <label className="fs-5 fw-bold" htmlFor="date">
          Data:
        </label>
        <input
          type="date"
          id="date"
          className={`mb-3 rounded ${errors.date ? 'is-invalid' : ''}`}
          value={date}
          onChange={handleInputChange}
        />
        {errors.date && <div className="text-danger fw-bold fs-5 mb-4">{errors.date}</div>}
        <label className="fs-5 fw-bold" htmlFor="time">
          Laikas:
        </label>
        <input
          type="time"
          id="time"
          className={`mb-3 rounded ${errors.time ? 'is-invalid' : ''}`}
          value={time}
          onChange={handleInputChange}
        />
        {errors.time && <div className="text-danger fw-bold fs-5 mb-4">{errors.time}</div>}
        <label className="fs-5 fw-bold" htmlFor="location">
          Vieta:
        </label>
        <input
          type="text"
          id="location"
          name="location"
          className={`mb-3 w-75 rounded ${errors.location ? 'is-invalid' : ''}`}
          placeholder="Klaipeda, centras"
          value={location}
          onChange={handleInputChange}
        />
        {errors.location && <div className="text-danger fw-bold fs-5 mb-4">{errors.location}</div>}
        <label className="fs-5 fw-bold" htmlFor="image">
          Nuotrauka:
        </label>
        <div {...getRootProps({ className: "dropzone" })} className="my-3 p-3 border border-dashed w-75">
          <input {...getInputProps()} />
          {photoPreview ? (
            <img src={photoPreview} alt="Event" className="w-25 my-3 rounded" />
          ) : (
            <p>Imeskite nuotrauka, arba paspauskite laukeli, kad pasirinktumėte nuotrauka</p>
          )}
        </div>
        <button
          className="btn btn-dark"
          type="submit"
        >
          Sukūrti Renginį
        </button>
      </form>
    </div>
  );
}

EventForm.propTypes = {
  token: PropTypes.string,
};

export default EventForm;
