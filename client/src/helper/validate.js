import toast from "react-hot-toast";
import { authenticate } from "./helper";

// Validate login page usernmame

export async function usernameValidate(values) {
  const errors = usernameVerify({}, values);

  if (values.username) {
    // check user exist or not
    const { status } = await authenticate(values.username);
    if (status !== 200) {
      errors.exist = toast.error("User does not exist...!");
    }
  }

  return errors;
}

export async function usernameVerify(error = {}, values) {
  if (!values.username) {
    error.username = toast.error("Username Required...!");
  } else if (values.username.includes(" ")) {
    error.username = toast.error("Invalid Username...!");
  }

  return error;
}

// Validate login page password

export async function passwordValidate(values) {
  const errors = passwordVerify({}, values);

  return errors;
}

export async function passwordVerify(error = {}, values) {
  const specialChars = /[`!@#$%^&*()_+\-=[\]{};':"\\|,.<>?~`]/;

  if (!values.password) {
    error.password = toast.error("Password Required...!");
  } else if (values.password.includes(" ")) {
    error.password = toast.error("Invalid Password...!");
  } else if (values.password.length < 4) {
    error.password = toast.error("Password must be at least 4 characters");
  } else if (!specialChars.test(values.password)) {
    error.password = toast.error("Password must have special character");
  }

  return error;
}

// Validate reset password

export async function resetPasswordValidate(values) {
  const errors = passwordVerify({}, values);

  if (values.password !== values.confirmPassword) {
    errors.exist = toast.error("Password does not match!");
  }

  return errors;
}

// Validate register form

export async function registerValidate(values) {
  const errors = usernameVerify({}, values);
  passwordVerify(errors, values);
  emailVerify(errors, values);

  return errors;
}

// Validate email
export async function emailVerify(error = {}, values) {
  if (!values.email) {
    error.email = toast.error("Email Required...!");
  } else if (values.email.includes(" ")) {
    error.email = toast.error("Wrong Email...!");
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
    error.email = toast.error("Invalid email address...!");
  }

  return error;
}

// Validate profile

export async function profileValidation(values) {
  const errors = emailVerify({}, values);

  return errors;
}
