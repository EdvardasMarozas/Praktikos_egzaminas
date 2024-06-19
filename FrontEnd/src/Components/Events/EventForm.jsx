import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Alert } from "react-bootstrap";
import axios from "axios";

function EventForm({ token }) {
  const [show, setShow] = useState(false);
  const [userID, setUserID] = useState(null);

  useEffect(() => {
    getUserId(token);
  }, [token]);

  const getUserId = async (token) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserID(response.data.id);
      return response.data.id;
    } catch (error) {
      console.error("Fetching user id failed:", error);
    }
  };

  const getTimeFromDate = (date, time) => {
    const [year, month, day] = date.split("-");
    return `${year}-${month}-${day}T${time}:00`;
  };

  const createEvent = async (token, e) => {
    e.preventDefault();

    const name = document.querySelector("#name").value;
    const category = document.querySelector("#category").value;
    const date = document.querySelector("#date").value;
    const time = document.querySelector("#time").value;
    const dateTime = getTimeFromDate(date, time);
    const location = document.querySelector("#location").value;
    const photo = document.querySelector("#photo").value;

    await axios.post(
      "http://localhost:3000/api/events/",
      {
        usersId: userID,
        name,
        category,
        date: dateTime,
        location,
        photo,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    setShow(true);
    document.querySelector("#name").value = "";
    document.querySelector("#category").value = "";
    document.querySelector("#date").value = "";
    document.querySelector("#time").value = "";
    document.querySelector("#location").value = "";
    document.querySelector("#photo").value = "";
  };
  return (
    <div>
      <h1 className="text-center">Sukūrti Renginį</h1>
      <form
        className="
          d-flex flex-column align-items-center bg-secondary w-50 p-5
          border border-3 border-dark rounded mt-5 mx-auto
          "
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
          placeholder="Name"
          className="mb-4 rounded w-75"
        />
        <label className="fs-5 fw-bold" htmlFor="category">
          Kategorija:
        </label>
        <input
          type="text"
          id="category"
          placeholder="Category"
          className="mb-3 rounded w-75"
        />
        <label className="fs-5 fw-bold" htmlFor="date">
          Data:
        </label>
        <input
          type="date"
          id="date"
          className="mb-3 rounded"
          style={{ minHeight: "100px" }}
        />
        <label className="fs-5 fw-bold" htmlFor="time">
          Laikas:
        </label>
        <input
          type="time"
          id="time"
          className="mb-3 rounded"
          style={{ minHeight: "100px" }}
        />
        <label className="fs-5 fw-bold" htmlFor="location">
          Vieta:
        </label>
        <input
          type="text"
          id="location"
          name="location"
          className="mb-3 w-75 rounded"
          placeholder="location"
        />
        <label className="fs-5 fw-bold" htmlFor="photo">
          Nuotrauka:
        </label>
        <input
          type="file"
          id="photo"
          name="photo"
          className="mb-3 w-75 rounded"
          placeholder="photo"
        />
        <button
          className="btn btn-dark"
          type="submit"
          onClick={(e) => createEvent(token, e)}
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
