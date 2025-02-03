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
    <Container>
      {users.map((user,index) => (
        <div key={index}>
          <h3>{user.username}</h3>
          <h3>{user.email}</h3>
        </div>
      ))}

      <Button onClick={fetchUsers}>Fetch Users</Button>
      {/* Your component JSX here */}
      <h1>Dashboard</h1>
      <h3>{email}</h3>
      <h5>{username}</h5>

      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default Dashboard;
