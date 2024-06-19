import { useEffect, useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";

function UserList({ token }) {
  const [users, setUsers] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [newRole, setNewRole] = useState("");

  const updateUserRole = async (userId, newRole) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/users/${userId}/role`,
        { role: newRole },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditUserId(null);
    } catch (error) {
      console.error("Error updating user role:", error);
    }
  };

  const deleteUser = async (userId) => {
    try {
      await axios.delete(`http://localhost:3000/api/users/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleBlockUser = async (userId, blocked, token) => {
    try {
      console.log(blocked);
      await axios.patch(
        `http://localhost:3000/api/users/${userId}/block`,
        {
          blocked: !blocked,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error blocking user:", error);
    }
  };

  const fetchUsers = async (token) => {
    try {
      const response = await axios.get("http://localhost:3000/api/users/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers(token);
  }, [token, users]);

  return (
    <div>
      <h1 className="text-center">Vartotojų Sąrašas</h1>
      <ol className="list-group list-group-numbered">
        {users.map((user) => (
          <li
            key={user.id}
            className="list-group-item d-flex justify-content-between align-items-start w-50 mx-auto"
          >
            <div className="ms-2 me-auto">
              <div className="">
                <span className="fw-bold">Vartotojo ID:</span> {user.id}
              </div>
              <span className="fw-bold">Slapyvardis:</span> {user.username}{" "}
              <br />
              <span className="fw-bold">Rolė:</span> {user.role} <br />
              <button
                className="btn btn-success my-2"
                style={{ marginRight: "15px" }}
                onClick={() => setEditUserId(user.id)}
              >
                Pakeisti Vartotojo Role
              </button>
              {editUserId === user.id && (
                <div>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                  >
                    <option
                      value={`${user.role === "ADMIN" ? "ADMIN" : "USER"}`}
                    >
                      {user.role === "ADMIN" ? "ADMIN" : "USER"}
                    </option>
                    <option
                      value={`${user.role === "ADMIN" ? "USER" : "ADMIN"}`}
                    >
                      {user.role === "ADMIN" ? "USER" : "ADMIN"}
                    </option>
                  </select>
                  <button
                    className="btn btn-warning my-2 mx-2"
                    onClick={() => updateUserRole(user.id, newRole)}
                  >
                    Pakeisti
                  </button>
                </div>
              )}
              <button
                className="btn btn-danger"
                onClick={() => deleteUser(user.id, token)}
              >
                Ištrinti vartotoją
              </button>
              <button
                onClick={() => handleBlockUser(user.id, user.blocked, token)}
                className="btn btn-danger mx-2"
              >
                {user.blocked ? "Atblokuoti vartotoja" : "Blokuoti vartotoja"}{" "}
                vartotoją
              </button>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

UserList.propTypes = {
  token: PropTypes.string.isRequired,
};

export default UserList;
