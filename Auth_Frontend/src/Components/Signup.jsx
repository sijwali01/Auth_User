import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { signupUser } from "../redux/Slice";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.user); // Assuming isLoading is used here
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    // Dispatch signup action
    try {
      dispatch(signupUser({ username, email, password ,confirmPassword }));
    } catch (error) { 
      setErrorMessage("An error occurred. Please try again.");
    }
      // .then((response) => {
      //   if (response.payload && response.payload.token) {
      //     const token = response.payload.token;
      //     localStorage.setItem("token", token);
      //     console.log("Signup successful, token:", token);
      //     navigate("/dashboard");
      //   } else {
      //     setErrorMessage("Signup failed. Please check your details.");
      //   }
      // })
      // .catch((error) => {
      //   console.error("Signup error:", error);
      //   setErrorMessage("An error occurred. Please try again.");
      // });
    setMessage("User created successfully! Please check your email to activate your account.");
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <div className="p-4 border rounded shadow-lg">
            <h2 className="text-center mb-4">Sign Up</h2>

            {isLoading && (
              <div className="d-flex justify-content-center mb-3">
                <Spinner animation="border" />
              </div>
            )}

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
              <h5>{message}</h5>
              <Form.Group controlId="username" className="mb-3">
                <Form.Label>Username</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter your username"
                  required
                />
              </Form.Group>

              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group controlId="password" className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </Form.Group>

              <Form.Group controlId="confirmPassword" className="mb-3">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  required
                />
              </Form.Group>

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? "Signing up..." : "Sign Up"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleLoginRedirect}
                  disabled={isLoading}
                >
                  Already have an account? Login
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Signup;
