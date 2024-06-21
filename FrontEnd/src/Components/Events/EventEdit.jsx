import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Header from "../Common/Header";
import styles from "./EventDetail.module.css";
import { Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

function EventEdit({ token }) {
  const [show, setShow] = useState(false);
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    getEvent(id, token);
  }, [id, token]);

  const getEvent = async (id, token) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const date = response.data.date;
      setEvent(response.data);
      setName(response.data.name);
      setCategory(response.data.category.name);
      setDate(response.data.date);
      if (typeof date === "string") {
        const number = Number(date.substring(11, 13)) + 3;
        setTime(`${number}${date.substring(13, 16)}`);
        setDate(date.substring(0, 10));
      } else {
        const number = Number(date.toISOString().substring(11, 13)) + 3;
        setTime(`${number}${date.toISOString().substring(13, 16)}`);
        setDate(date.toISOString().substring(0, 10));
      }
      setLocation(response.data.location);
      setPhotoPreview(`http://localhost:3000/images/${response.data.photo}`);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const getIsoDate = (input) => {
    if (typeof input === "string") {
      return input.substring(0, 10);
    }
    return input.toISOString().substring(0, 10);
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

    if (!date) {
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
      setDate(getIsoDate(value));
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

  const updateEvent = async (e, token, id, categoryID) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const dateTime = `${date}T${time}:00`;

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("category", category.trim());
    formData.append("date", dateTime);
    formData.append("location", location.trim());
    formData.append("categoryID", categoryID);
    if (photo) {
      formData.append("photo", photo);
    }

    try {
      const response = await axios.put(
        `http://localhost:3000/api/events/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPhotoPreview(`http://localhost:3000/images/${response.data.photo}`);
      setShow(true);
    } catch (error) {
      console.error("Error updating event:", error);
    }
  };

  return (
    <div className="container">
      <Header token={token} />
      <div className={styles.eventDetail}>
        <h1 className="mb-5">Redaguoti Renginį</h1>
        <Alert onClose={() => setShow(false)} dismissible show={show} variant="success">
          <Alert.Heading>Sėkmė!</Alert.Heading>
          <p>Renginys sėkmingai pakeistas!</p>
        </Alert>
        <div className="text-center">
          <form onSubmit={(e) => updateEvent(e, token, event.id, event.category.id)} encType="multipart/form-data">
            <h5>
              <span className="fs-3">Pavadinimas:</span>{" "}
              <input
                name="name"
                id="name"
                type="text"
                value={name}
                className={`mb-4 rounded w-75 ${errors.name ? "is-invalid" : ""}`}
                onChange={handleInputChange}
              />
              {errors.name && <div className="text-danger">{errors.name}</div>}
            </h5>
            <h5 className="my-5">
              <span className="fs-3">Kategorija:</span>{" "}
              <input
                name="category"
                id="category"
                type="text"
                value={category}
                className={`mb-3 rounded w-75 ${errors.category ? "is-invalid" : ""}`}
                onChange={handleInputChange}
              />
              {errors.category && <div className="text-danger">{errors.category}</div>}
            </h5>
            <h5>
              <span className="fs-3">Data:</span>{" "}
              <input
                type="date"
                name="date"
                id="date"
                value={date}
                className={`mb-3 rounded ${errors.date ? "is-invalid" : ""}`}
                onChange={handleInputChange}
              />
              {errors.date && <div className="text-danger">{errors.date}</div>}
            </h5>
            <h5>
              <span className="fs-3">Laikas:</span>{" "}
              <input
                type="time"
                name="time"
                id="time"
                value={time}
                className="my-3 rounded"
                onChange={handleInputChange}
              />
              {errors.time && <div className="text-danger">{errors.time}</div>}
            </h5>
            <h5 className="my-4">
              <span className="fs-3">Vieta:</span>{" "}
              <input
                type="text"
                name="location"
                id="location"
                value={location}
                className={`mb-3 w-75 rounded ${errors.location ? "is-invalid" : ""}`}
                onChange={handleInputChange}
              />
              {errors.location && <div className="text-danger">{errors.location}</div>}
            </h5>
            <h5>
              <span className="fs-3">Nuotrauka:</span>{" "}
              <p className="mt-3">Imeskite nuotrauka, arba paspauskite laukeli, kad pasirinktumėte nuotrauka</p>
              <div {...getRootProps({ className: "dropzone" })} className="my-3 p-3 border border-dashed">
                <input {...getInputProps()} />
                {photoPreview ? (
                  <img src={photoPreview} alt="Event" className="w-25 my-3 rounded" />
                ) : (
                  <p>Imeskite nuotrauka, arba paspauskite laukeli, kad pasirinktumėte nuotrauka</p>
                )}
              </div>
            </h5>
            <button className="btn btn-primary mt-3">Išsaugoti</button>{" "}
            <button onClick={() => navigate("/user")} className="btn btn-danger mt-3 ms-3">
              Atšaukti
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

EventEdit.propTypes = {
  token: PropTypes.string,
};

export default EventEdit;
