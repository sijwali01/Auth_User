import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../redux/Slice";
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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const dispatch = useDispatch();
  const { isLoading, data } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(loginUser({ email, password }))
      .then((response) => {
        if (response.payload && response.payload.token) {
          const token = response.payload.token;
          localStorage.setItem("token", token);
          console.log("Login successful, token:", token);
          navigate("/dashboard");
        } else {
          console.log("No token found in response");
          setErrorMessage("Login failed. Please check your credentials.");
        }
      })
      .catch((error) => {
        console.error("Login error:", error);
        setErrorMessage("An error occurred. Please try again.");
      });

    setEmail("");
    setPassword("");
  };
  const handleSignup = (e) => {
    navigate("/signup");
  };
  const handleForget = (e) => {
    navigate("/forgetpassword");
  };

  return (
    <Container
      className="d-flex justify-content-center align-items-center"
      style={{ height: "100vh" }}
    >
      <Row className="w-100">
        <Col md={6} lg={4} className="mx-auto">
          <div className="p-4 border rounded shadow-lg">
            <h2 className="text-center mb-4">Login</h2>

            {isLoading && (
              <div className="d-flex justify-content-center mb-3">
                <Spinner animation="border" />
              </div>
            )}

            {data && <p className="text-center">Welcome, {data.username}!</p>}

            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}

            <Form onSubmit={handleSubmit}>
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

              <div className="d-grid gap-2">
                <Button variant="primary" type="submit" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleSignup}
                  disabled={isLoading}
                >
                  Already have an account? Signup
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleForget}
                  disabled={isLoading}
                >
                  Forget Password
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
