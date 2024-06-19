import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import Header from "../Common/Header";
import axios from "axios";
import BackgroundImage from "../../assets/Images/background.jpg";
import "./auth.css";

const Register = ({ setToken, role }) => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate(`${role === "ADMIN" ? "/admin" : "/user"}`);
    }
  }, [navigate, role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    if (inputPassword !== confirmPassword) {
      setError("Slaptažodziai nesutampa.");
      setShow(true);
      setLoading(false);
      return;
    }

    try {
      const data = {
        username: inputUsername,
        password: inputPassword,
        role: role,
      };

      const response = await axios.post(
        `http://localhost:3000/api/users/register`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.token;
      console.log("Received token:", token);

      localStorage.setItem("token", token);
      setToken(token);
      navigate("/login");
    } catch (error) {
      console.error("Registration failed:", error);
      localStorage.removeItem("token");
      setError("Registration failed. Please try again.");
      setShow(true);
    }

    setLoading(false);
  };

  return (
    <div
      className="sign-in__wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <div className="sign-in__backdrop"></div>
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        <Header nav={false} />
        <div className="h4 mb-2 text-center mt-2">
          {role === "ADMIN" ? "Admino" : ""} Registracija
        </div>
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            {error}
          </Alert>
        ) : (
          <div />
        )}
        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Slapyvardis</Form.Label>
          <Form.Control
            type="text"
            value={inputUsername}
            placeholder="Slapyvardis"
            onChange={(e) => setInputUsername(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Slaptažodis</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Slaptažodis"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-4" controlId="confirmPassword">
          <Form.Label>Pakartokite slaptažodi</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            placeholder="Pakartokite slaptažodi"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Registruoti
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Registruojama...
          </Button>
        )}
        <div className="text-center mt-3">
          <h5 className="mb-0">Jau turite paskyra?</h5>
          <Button
            variant="link"
            className="text-decoration-none"
            onClick={() => navigate("/login")}
          >
            Prisijungti
          </Button>
        </div>
      </Form>
    </div>
  );
};

Register.propTypes = {
  setToken: PropTypes.func.isRequired,
  role: PropTypes.string.isRequired,
};

export default Register;
