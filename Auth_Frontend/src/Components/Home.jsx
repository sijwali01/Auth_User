import React from "react";
import { useNavigate } from "react-router-dom";
import "./Resuable.scss";

const Home = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate("/signup");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="home-container text-center w-50 mx-auto mt-5">
      <h1>Welcome to Our App!</h1>
      <p>Please choose an option:</p>
        <button onClick={handleSignUp} className="button mb-3">
          Sign Up
        </button>
        <button onClick={handleLogin} className="button">
          Login
        </button>
      </div>
  );
};

export default Home;
