import { useState, useEffect } from "react";
import Header from "../Common/Header";
import PropTypes from "prop-types";
import axios from "axios";
import { Alert } from "react-bootstrap";
import EventForm from "../Events/EventForm";
import styles from "../Events/EventsList.module.css";
import { useNavigate } from "react-router-dom";

function UserDashboard({ token }) {
  const [editUserId, setEditUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [show, setShow] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [MyEvents, setMyEvents] = useState([]);
  const [showMyEvents, setShowMyEvents] = useState(false);
  const [role, setRole] = useState("");
  const [blocked, setBlocked] = useState(false);
  const navigate = useNavigate();

  function getDate(input) {
    if (typeof input === "string") {
      return input.substring(0, 10);
    }
    return input.toISOString().substring(0, 10);
  }
  function getTime(input) {
    if (typeof input === "string") {
      return input.substring(11, 16);
    }
    return input.toISOString().substring(11, 16);
  }

  useEffect(() => {
    getUserRole(token);
  }, [token]);

  const getMyEvents = async (token) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/events/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMyEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const getUserRole = async (token) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(response.data.id);
      setRole(response.data.role);
      setBlocked(response.data.blocked);
      return response.data;
    } catch (error) {
      console.error("Fetching user role failed:", error);
    }
  };

  const updateUserPassword = async (id, password, token) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/users/password/${id}`,
        { password },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShow(true);
      setEditUserId(null);
      setNewPassword("");
    } catch (error) {
      console.error("Updating password failed:", error);
    }
  };

  const deleteEvent = async (id, token) => {
    try {
      await axios.delete(`http://localhost:3000/api/events/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyEvents(MyEvents.filter((event) => event.id !== id));
    } catch (error) {
      console.error("Error deleting event:", error);
    }
  };

  const handleClose = () => {
    setShow(false);
    setEditUserId(null);
  };

  return (
    <>
      <Header token={token} />
      <div>
        <h1 className="text-center my-4">Vartotojo Panelė</h1>
        <div className="d-flex justify-content-center mb-5">
          <button
            className="btn btn-primary"
            onClick={() => {
              setEditUserId(userId);
              setShow(false);
              setNewPassword("");
              setShowCreateEvent(false);
              setShowMyEvents(false);
            }}
          >
            Pakeisti Slaptažodį
          </button>
          <button
            className={`btn btn-primary mx-3 ${
              showCreateEvent ? "active" : ""
            }`}
            onClick={() => {
              setShowCreateEvent(true);
              setShow(false);
              setEditUserId(null);
              setNewPassword("");
              setShowMyEvents(false);
            }}
          >
            Sukūrti Renginį
          </button>
          <button
            className="btn btn-primary"
            onClick={() => {
              setShowMyEvents(true);
              setShowCreateEvent(false);
              setShow(false);
              setEditUserId(null);
              getMyEvents(token);
            }}
          >
            Mano Renginiai
          </button>
        </div>
        {editUserId === userId && (
          <div className="d-flex justify-content-center">
            <input
              type="password"
              placeholder="New Password"
              className="mx-3 p-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              className="btn btn-success"
              onClick={() => updateUserPassword(userId, newPassword, token)}
            >
              Pateikti
            </button>
            <button className="btn btn-danger mx-3" onClick={handleClose}>
              Atšaukti
            </button>
          </div>
        )}
        {(showCreateEvent && !blocked) && <EventForm token={token} />}
        {blocked && (
          <div className="fs-1 text-center text-danger">Esate blokuotas sukūrti naujus renginiuss</div>
        )}
        {showMyEvents && (
          <div className="d-flex flex-wrap justify-content-center gap-5">
            {MyEvents.map((event) => (
              <div className="card w-25 bg-warning gap-3" key={event.id}>
                <h2 className="card-header text-center pt-4">
                  {(role === "ADMIN" || role === "USER") &&
                    window.location.href !== "http://localhost:5173/" && (
                      <div className={styles.buttons}>
                        <button
                          className="btn btn-danger"
                          onClick={() => deleteEvent(event.id, token)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="30"
                            height="30"
                            viewBox="0 0 64 64"
                          >
                            <path d="M 28 6 C 25.791 6 24 7.791 24 10 L 24 12 L 23.599609 12 L 10 14 L 10 17 L 54 17 L 54 14 L 40.400391 12 L 40 12 L 40 10 C 40 7.791 38.209 6 36 6 L 28 6 z M 28 10 L 36 10 L 36 12 L 28 12 L 28 10 z M 12 19 L 14.701172 52.322266 C 14.869172 54.399266 16.605453 56 18.689453 56 L 45.3125 56 C 47.3965 56 49.129828 54.401219 49.298828 52.324219 L 51.923828 20 L 12 19 z M 20 26 C 21.105 26 22 26.895 22 28 L 22 51 L 19 51 L 18 28 C 18 26.895 18.895 26 20 26 z M 32 26 C 33.657 26 35 27.343 35 29 L 35 51 L 29 51 L 29 29 C 29 27.343 30.343 26 32 26 z M 44 26 C 45.105 26 46 26.895 46 28 L 45 51 L 42 51 L 42 28 C 42 26.895 42.895 26 44 26 z"></path>
                          </svg>
                        </button>
                        <button
                          className="btn btn-secondary"
                          onClick={() => navigate(`/event/${event.id}/edit`)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            x="0px"
                            y="0px"
                            width="30"
                            height="30"
                            viewBox="0 0 50 50"
                          >
                            <path d="M 43.050781 1.9746094 C 41.800781 1.9746094 40.549609 2.4503906 39.599609 3.4003906 L 38.800781 4.1992188 L 45.699219 11.099609 L 46.5 10.300781 C 48.4 8.4007812 48.4 5.3003906 46.5 3.4003906 C 45.55 2.4503906 44.300781 1.9746094 43.050781 1.9746094 z M 37.482422 6.0898438 A 1.0001 1.0001 0 0 0 36.794922 6.3925781 L 4.2949219 38.791016 A 1.0001 1.0001 0 0 0 4.0332031 39.242188 L 2.0332031 46.742188 A 1.0001 1.0001 0 0 0 3.2578125 47.966797 L 10.757812 45.966797 A 1.0001 1.0001 0 0 0 11.208984 45.705078 L 43.607422 13.205078 A 1.0001 1.0001 0 1 0 42.191406 11.79422 L 9.9921875 44.09375 L 5.90625 40.007812 L 38.205078 7.8085938 A 1.0001 1.0001 0 0 0 37.482422 6.0898438 z"></path>
                          </svg>
                        </button>
                      </div>
                    )}
                  <span>{event.name}</span>
                </h2>
                <p className="card-body">
                  <span className="fw-semibold">Kategorija:</span>{" "}
                  {event.category.name}
                </p>
                <p className="card-body">
                  <a
                    className="card-link text-decoration-none fw-semibold"
                    href={`http://localhost:5173/event/${event.id}`}
                  >
                    Visa Renginio Informacija...
                  </a>
                </p>
                <p className="card-footer mb-0 pb-3">
                  <span className="fw-semibold">Renginio Vieta:</span>{" "}
                  {event.location}
                  <br />
                  <span className="fw-semibold">Renginio Data:</span>{" "}
                  {getDate(event.date)}
                  <br />
                  <span className="fw-semibold">Renginio Laikas:</span>{" "}
                  {getTime(event.date)}
                </p>
              </div>
            ))}
          </div>
        )}
        <Alert
          onClose={handleClose}
          show={show}
          variant="success"
          dismissible
          style={{ width: "20rem", marginInline: "auto", marginTop: "3rem" }}
        >
          <Alert.Heading>Success!</Alert.Heading>
          <p>Slaptažodis sėkmingai atnaujintas.</p>
        </Alert>
      </div>
    </>
  );
}

UserDashboard.propTypes = {
  token: PropTypes.string.isRequired,
};

export default UserDashboard;
