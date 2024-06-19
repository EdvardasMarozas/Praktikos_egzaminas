import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styles from "./EventDetail.module.css";
import Header from "../Common/Header";
import PropTypes from "prop-types";

function EventDetails({ token }) {
  const { id } = useParams();
  const [event, setEvent] = useState({});

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
    getEvent(id);
  }, [id]);

  const getEvent = async (id) => {
    try {
      const response = await fetch(`http://localhost:3000/api/events/${id}`);
      const data = await response.json();
      setEvent(data);
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  return (
    <div className="container">
      <Header token={token} />
      <div className={styles.eventDetail}>
        <h1 className="mb-5">Renginio informacija</h1>
        <div className="text-center">
          <h5>
            <span className="fs-3">Pavadinimas:</span> {event.name}
          </h5>
          <h5 className="my-5">
            <span className="fs-3">Kategorija:</span>{" "}
            {event.category && event.category.name}
          </h5>
          <h5 className="my-4">
            <span className="fs-3">Vieta:</span> {event.location}
          </h5>
          <h5>
            <span className="fs-3">Data:</span>{" "}
            {event.date && getIsoDate(event.date)}
          </h5>
          <h5 className="mb-4">
            <span className="fs-3">Laikas:</span>{" "}
            {event.date && getTime(event.date)}
          </h5>
          <h5>
            <span className="fs-3">Nuotrauka:</span> {event.photo}
          </h5>
        </div>
      </div>
    </div>
  );
}

EventDetails.propTypes = {
  token: PropTypes.string,
};

export default EventDetails;
