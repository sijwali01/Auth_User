import React, { useEffect, useState } from "react";
import { Container, Row, Col, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const Dashboard = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    //get the token from local storage and fetch the user data
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      const user = jwtDecode(token);
      console.log(user);
      setEmail(user.email);
      setUsername(user.name);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  //find all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:7777/");
      console.log(response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  return (
    <Container className="text center w-50">
      <div className="mt-5">
        <h1 className="p-2 border border-black bg-tertiary">Dashboard</h1>
        <br />
        <h3>Email: {email}</h3>
        <h5>Name: {username}</h5>

        <button className="button" onClick={handleLogout}>
          Logout
        </button>

        {users.map((user, index) => (
          <div key={index} className="mt-4">
            <h3>{user.username}</h3>
            <h3>{user.email}</h3>
          </div>
        ))}

        <button className="button" onClick={fetchUsers}>
          Fetch Users
        </button>
      </div>
    </Container>
  );
};

export default Dashboard;
