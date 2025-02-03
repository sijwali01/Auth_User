const express = require("express");
const bcrypt = require("bcrypt");
var cors = require("cors");
const dbconnect = require("./config/database");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const User = require("./models/User");
const sendWelcomeEmail = require("./config/mail");
const sendForgetPassword = require("./config/forgetmail");
const app = express();
const PORT = 7777;
require("dotenv").config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());

// All users route
app.get("/", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json("An error while retrieving users.");
  }
});

// Login route
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).send("User not found");
    }

    if (!user.isActive) {
      return res
        .status(400)
        .send("Please verify your email before logging in.");
    }

    const passmatch = await bcrypt.compare(password, user.password);
    if (passmatch) {
      const token = jwt.sign({ id: user.id,name: user.username,email:user.email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });

      return res.status(200).json({ token, message: "User logged in" });
    } else {
      return res.status(400).send("Invalid Password");
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ error: "Error occurred" });
  }
});

// Sign-up route
app.post("/signup", async (req, res) => {
  const { username, email, password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json("Password didn't match!");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json("Email already in use.");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      isActive: false,
    });

    const ActivateToken = jwt.sign(
      { email, name: username },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    await sendWelcomeEmail(email, username, ActivateToken);

    await user.save();

    res.status(200).json({
      message:
        "User created successfully! Please check your email to activate your account.",
    });
  } catch (error) {
    console.error(error);
    res.status(400).json("An error occurred while creating the user.");
  }
});

//forget password route
app.post("/forgetpassword", async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json("User not found");
    }
    const token = jwt.sign({ email }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    await sendForgetPassword(email, token);

    res.status(200).json({ message: "Email sent successfully" });
  } catch(error) {
    console.error(error);
    res.status(400).json("An error occurred while sending the email.",error);
  }
});
//reset password route
app.post("/resetpassword/:token", async (req, res) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  try {
    if (password !== confirmPassword) {
      return res.status(400).json("Password didn't match!");
    }

    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decodedToken);

    if (!decodedToken || !decodedToken.email) {
      return res.status(400).send("Invalid or expired token.");
    }

    const user = await User.findOne({ email: decodedToken.email });

    if (user) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
      await user.save();

      res.status(200).json({ message: "Password reset successfully!" });
    } else {
      res.status(400).json({ message: "User not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("An error occurred while resetting the password.");
  }
});
// Verify account route
app.post("/verify/:token", async (req, res) => {
  const { token } = req.params;

  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded token:", decodedToken);

    if (!decodedToken || !decodedToken.email) {
      return res.status(400).send("Invalid or expired token.");
    }

    const user = await User.findOne({ email: decodedToken.email });

    if (user) {
      if (user.isActive) {
        return res.status(400).json({ message: "Account already verified." });
      }

      user.isActive = true;
      await user.save();

      res.status(200).json({ message: "Account successfully verified!" });
    } else {
      res.status(400).json({ message: "User not found." });
    }
  } catch (error) {
    console.log(error);
    res.status(400).json("An error occurred while verifying the token.");
  }
});

// Connect to the database and start the server
dbconnect()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on ${PORT}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
