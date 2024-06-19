import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import Header from "../Common/Header";
import styles from "./EventDetail.module.css";
import { Alert } from "react-bootstrap";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function EventEdit({ token }) {
  const [show, setShow] = useState(false);
  const { id } = useParams();
  const [event, setEvent] = useState({});
  const navigate = useNavigate();

  const getIsoDate = (input) => {
    if (typeof input === "string") {
      return input.substring(0, 10);
    }
    return input.toISOString().substring(0, 10);
  };

  const getTime = (input) => {
    if (typeof input === "string") {
      return input.substring(11, 16);
    }
    return input.toISOString().substring(11, 16);
  };

  useEffect(() => {
    getEvent(id, token);
  }, [id, token]);

  const getEvent = async (id, token) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/events/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      //   console.log(response.data);
      //   const data = await response.json();
      setEvent(response.data);
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  const getTimeFromDate = (date, time) => {
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}T${time}:00`;
  };

  const updateEvent = async (token, e, id, categoryID) => {
    e.preventDefault();
    try {
      const name = document.querySelector("#name").value;
      const category = document.querySelector("#category").value;
      const date = document.querySelector("#date").value;
      const time = document.querySelector("#time").value;
      const dateTime = getTimeFromDate(date, time);
      const location = document.querySelector("#location").value;
      const photo = document.querySelector("#photo").value;

      const response = await axios.put(
        `http://localhost:3000/api/events/${id}`,
        {
          name,
          category,
          categoryID,
          date: dateTime,
          location,
          photo,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      console.log(response.data);
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
        <Alert
          onClose={() => setShow(false)}
          dismissible
          show={show}
          variant="success"
        >
          <Alert.Heading>Success!</Alert.Heading>
          <p>Renginys sėkmingai pakeistas!</p>
        </Alert>
        <div className="text-center">
          <form action="">
            <h5>
              <span className="fs-3">Pavadinimas:</span>{" "}
              <input
                name="name"
                id="name"
                type="text"
                defaultValue={event.name}
              />
            </h5>
            <h5 className="my-5">
              <span className="fs-3">Kategorija:</span>{" "}
              <input
                name="category"
                id="category"
                type="text"
                defaultValue={event.category && event.category.name}
              />
            </h5>
            <h5>
              <span className="fs-3">Data:</span>{" "}
              <input
                type="date"
                name="date"
                id="date"
                defaultValue={event.date && getIsoDate(event.date)}
              />
            </h5>
            <h5>
              <span className="fs-3">Laikas:</span>{" "}
              <input
                type="time"
                name="time"
                id="time"
                className="my-3"
                defaultValue={event.date && getTime(event.date)}
              />
            </h5>
            <h5 className="my-4">
              <span className="fs-3">Vieta:</span>{" "}
              <input
                type="text"
                name="location"
                id="location"
                defaultValue={event.location}
              />
            </h5>
            <h5>
              <span className="fs-3">Nuotrauka:</span>{" "}
              <input
                type="file"
                name="photo"
                id="photo"
                defaultValue={event.photo}
              />
            </h5>
            <button
              onClick={(e) =>
                updateEvent(token, e, event.id, event.category.id)
              }
              className="btn btn-primary mt-3"
            >
              Išsaugoti
            </button>{" "}
            <button
              onClick={() => navigate("/user")}
              className="btn btn-danger mt-3 ms-3"
            >
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
