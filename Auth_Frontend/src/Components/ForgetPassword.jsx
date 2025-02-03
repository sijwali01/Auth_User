import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { forgetUser } from "../redux/Slice";
import { Spinner, Button, Form, Alert } from "react-bootstrap";

const ForgetPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("Please Enter Your Mail");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      dispatch(forgetUser({ email }));
      setMessage("Password reset link sent to your email");
      setEmail(""); // Clear the email field after successful submission
    } catch (error) {
      setMessage("Error: " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <h1 className="text-center mb-4">{message}</h1>
        
        {message.includes("Error") && <Alert variant="danger">{message}</Alert>}
        
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

          <Button variant="primary" type="submit" disabled={isLoading}>
            {isLoading ? <Spinner animation="border" size="sm" /> : "Submit"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default ForgetPassword;
