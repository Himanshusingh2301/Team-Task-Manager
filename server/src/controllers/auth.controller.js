import User from "../models/User.js";
import env from "../config/env.js";
import { signToken } from "../services/token.service.js";
import AppError from "../utils/AppError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

function formatAuthResponse(user) {
  return {
    token: signToken(user._id),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  };
}

export const signup = asyncHandler(async (req, res) => {
  const existingUser = await User.findOne({ email: req.body.email });

  if (existingUser) {
    throw new AppError("Email is already in use.", 409);
  }

  let role = "member";

  if (req.body.role === "admin") {
    if (!env.adminInviteCode) {
      throw new AppError("Admin signup is disabled for this environment.", 403);
    }

    if (req.body.adminInviteCode !== env.adminInviteCode) {
      throw new AppError("Invalid admin invite code.", 403);
    }

    role = "admin";
  }

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role
  });

  res.status(201).json(formatAuthResponse(user));
});

export const login = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user || !(await user.comparePassword(req.body.password))) {
    throw new AppError("Invalid email or password.", 401);
  }

  res.json(formatAuthResponse(user));
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
});
