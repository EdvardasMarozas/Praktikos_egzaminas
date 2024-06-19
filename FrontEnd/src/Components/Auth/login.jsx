import { useState, useEffect } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Header from "../Common/Header";
import PropTypes from "prop-types";
import axios from "axios";
import BackgroundImage from "../../assets/Images/background.jpg";
import "./auth.css";

const Login = ({ setToken }) => {
  const [inputUsername, setInputUsername] = useState("");
  const [inputPassword, setInputPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && role) {
      console.log("role: ", role);
      navigate(`${role === "ADMIN" ? "/admin" : "/user"}`);
    }
  }, [navigate, role]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const data = {
        username: inputUsername,
        password: inputPassword,
      };

      const response = await axios.post(
        `http://localhost:3000/api/users/login`,
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
      setRole(response.data.role);
      console.log(response.data.role);
      if (response.data.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/user");
      }
    } catch (error) {
      console.error("Login failed:", error);
      localStorage.removeItem("token");
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
        <div className="h4 mb-2 text-center mt-2">Prisijungimas</div>
        {show ? (
          <Alert
            className="mb-2"
            variant="danger"
            onClose={() => setShow(false)}
            dismissible
          >
            Neteisingas prisijungimo vardas arba slaptazodis.
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
        <Form.Group className="mb-4" controlId="password">
          <Form.Label>Slaptažodis</Form.Label>
          <Form.Control
            type="password"
            value={inputPassword}
            placeholder="Slaptažodis"
            onChange={(e) => setInputPassword(e.target.value)}
            required
          />
        </Form.Group>
        {!loading ? (
          <Button className="w-100" variant="primary" type="submit">
            Prisijungti
          </Button>
        ) : (
          <Button className="w-100" variant="primary" type="submit" disabled>
            Prisijungiama...
          </Button>
        )}
        <div className="text-center mt-3">
          <h5 className="mb-0">Neturite paskyros?</h5>
          <Button
            variant="link"
            className="text-decoration-none"
            onClick={() => navigate("/register")}
          >
            Sukūrti paskyra
          </Button>
        </div>
      </Form>
    </div>
  );
};

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Login;
