import { useState } from "react";
import Header from "../Common/Header";
import PropTypes from "prop-types";
import UserList from "./UserList";
import EventsList from "../Events/EventsList";
import { Alert } from "react-bootstrap";
import axios from "axios";
import { useEffect } from "react";

function AdminDashboard({ token }) {
  const [showUsers, setShowUsers] = useState(false);
  const [showEvents, setShowEvents] = useState(false);

  const [editUserId, setEditUserId] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [userId, setUserId] = useState(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    getUserRole(token);
  }, [token]);
  const getUserRole = async (token) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserId(response.data.id);
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

  const handleClose = () => {
    setShow(false);
    setEditUserId(null);
  };

  return (
    <>
      <Header token={token} />
      <div>
        <h1 className="text-center mt-4 mb-5">Admino Panelė</h1>
        <ul className="list-unstyled gap-3 d-flex justify-content-center align-items-center">
          <li>
            <button
              className={`btn btn-primary ${showEvents ? "active" : ""}`}
              onClick={() => {
                setShowEvents(true);
                setShowUsers(false);
                setShow(false);
                setEditUserId(null);
              }}
            >
              Renginiai
            </button>
          </li>
          <li>
            <button
              className={`btn btn-primary ${showUsers ? "active" : " "}`}
              onClick={() => {
                setShowUsers(true);
                setShowEvents(false);
                setShow(false);
                setEditUserId(null);
              }}
            >
              Vartotojai
            </button>
          </li>
          <li>
            <button
              className={`btn btn-primary ${editUserId ? "active" : " "}`}
              onClick={() => {
                setEditUserId(userId);
                setShow(false);
                setNewPassword("");
                setShowUsers(false);
                // setShowCreateEvent(false);
                setShowEvents(false);
              }}
            >
              Pakeisti Mano Slaptažodį
            </button>
          </li>
        </ul>
      </div>
      <div>
        {showEvents && <EventsList token={token} />}
        {showUsers && <UserList token={token} />}
        {editUserId && (
          <div className="d-flex justify-content-center">
            {editUserId === userId && (
              <div>
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
              </div>
            )}
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

AdminDashboard.propTypes = {
  token: PropTypes.string.isRequired,
};

export default AdminDashboard;
