import { body } from "express-validator";

export const signupValidator = [
  body("name").trim().notEmpty().withMessage("Name is required."),
  body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long."),
  body("role").optional().isIn(["admin", "member"]).withMessage("Invalid role."),
  body("adminInviteCode").optional().isString().withMessage("Invalid admin invite code.")
];

export const loginValidator = [
  body("email").isEmail().withMessage("A valid email is required.").normalizeEmail(),
  body("password").notEmpty().withMessage("Password is required.")
];
