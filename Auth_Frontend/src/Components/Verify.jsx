import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Spinner, Button, Alert } from "react-bootstrap";

const Verify = () => {
  const { token } = useParams();
  const [status, setStatus] = useState("Verifying your account...");
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAccount = async () => {
      try {
        const response = await axios.post(`http://localhost:7777/verify/${token}`);

        if (response.status === 200) {
          setStatus("Account verified successfully!");
          setIsVerified(true);
          setTimeout(() => {
            navigate("/login");
          }, 5000); // 5 seconds redirect
        } else {
          setStatus("Verification failed. Please try again later.");
          setError(true);
        }
      } catch (error) {
        setStatus("Error verifying account. Please try again later.");
        setError(true);
        console.error(error);
      } finally {
        setLoading(false); // Stop loading spinner once the request finishes
      }
    };

    verifyAccount();
  }, [token, navigate]);

  const handleRetry = () => {
    setLoading(true);
    setError(false);
    setStatus("Verifying your account...");
    verifyAccount(); // Retry the verification
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
      <div className="text-center">
        <h1>{status}</h1>
        {loading && <Spinner animation="border" />}
        {isVerified && <p>Your account is now active. Redirecting to login...</p>}
        
        {error && !isVerified && (
          <>
            <Alert variant="danger" className="mt-3">{status}</Alert>
            <Button variant="primary" onClick={handleRetry} className="mt-3">
              Retry Verification
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default Verify;
