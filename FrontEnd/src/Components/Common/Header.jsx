import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "./Header.module.css";
function Header(props) {
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const getUserRole = async (token) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRole(response.data.role);
      return response.data;
    } catch (error) {
      console.error("Fetching user role failed:", error);
    }
  };

  useEffect(() => {
    if (props.token) {
      getUserRole(props.token);
    }
  }, [props.token]);

  return (
    <div className={styles.header}>
      <h1 className="text-center">Klaipėdos Renginiai</h1>
      {props.nav && (
        <ul className="d-flex gap-5 list-unstyled align-self-end">
          {window.location.href != "http://localhost:5173/" && (
            <li>
              <a href="/">Renginiai</a>
            </li>
          )}
          {!props.token && (
            <li>
              <a href="/register">Registruotis</a>
            </li>
          )}
          {!props.token && (
            <li>
              <a href="/login">Prisijungti</a>
            </li>
          )}
          {role === "ADMIN" &&
            window.location.href != "http://localhost:5173/admin" && (
              <li>
                <a href="/admin">Admino Panelė</a>
              </li>
            )}
          {role === "USER" &&
            window.location.href != "http://localhost:5173/user" && (
              <li>
                <a href="/user">Vartotojo Panelė</a>
              </li>
            )}
          {props.token && (
            <li>
              <a href="/login" onClick={handleLogout}>
                Atsijungti
              </a>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}

Header.defaultProps = {
  nav: true,
};

Header.propTypes = {
  nav: PropTypes.bool,
  token: PropTypes.string,
};

export default Header;
