import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="home-container">
      <h1>Welcome to Our App!</h1>
      <p>Please choose an option:</p>
      <div className="button-group">
        <button onClick={handleSignUp} className="btn btn-primary">
          Sign Up
        </button>
        <button onClick={handleLogin} className="btn btn-secondary">
          Login
        </button>
      </div>
    </div>
  );
};

export default Home;
