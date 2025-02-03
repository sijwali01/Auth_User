import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// For signup
export const signupUser = createAsyncThunk(
  "user/signupUser",
  async (
    { username, email, password, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post("http://localhost:7777/signup", {
        username,
        email,
        password,
        confirmPassword,
      });

      if (response.status !== 200) {
        return rejectWithValue("Something went wrong during signup");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// For login
export const loginUser = createAsyncThunk(
  "user/loginUser",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:7777/login", {
        email,
        password,
      });

      if (response.status !== 200) {
        return rejectWithValue("Invalid credentials");
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//for forget password
export const forgetUser = createAsyncThunk(
  "user/forgetUser",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:7777/forgetpassword",
        {
          email,
        }
      );

      if (response.status !== 200) {
        return rejectWithValue("Invalid Email");
      }
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message)
    }
  }
);

// User slice
const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoading: false,
    data: null,
    error: null,
  },
  extraReducers: (builder) => {
    builder.addCase(signupUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(signupUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(signupUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });

    builder.addCase(loginUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
    builder.addCase(forgetUser.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(forgetUser.fulfilled, (state, action) => {
      state.isLoading = false;
      state.data = action.payload;
    });
    builder.addCase(forgetUser.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    });
  },
});

export default userSlice.reducer;
