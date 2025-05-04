import mongoose from "mongoose";

export const handleErrors = (error: any) => {
  const errors: Record<string, string> = {};

  if (
    error.code === 11000 &&
    (error.keyPattern?.email ||
      (error.keyPattern?.personalInformation &&
        error.keyPattern.personalInformation.email))
  ) {
    errors.message = "Email already registered";
    return errors;
  }

  if (error.code === 11000 && error.keyPattern?.userId) {
    errors.message = "User already registered";
    return errors;
  }

  if (error.code === 11000) {
    console.log({ error });
    errors.message = `${error.keyPattern} already exists`;
    return errors;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    Object.values(error.errors).forEach((err: any) => {
      if (err?.properties?.path) {
        errors[err.properties.path] = err.properties.message;
      }
    });
    return errors;
  }

  if (error.name === "CastError") {
    errors[error.path] = `Invalid ${error.kind}: ${error.value}`;
    return errors;
  }

  if (error.message?.includes("validation failed")) {
    Object.values(error.errors || {}).forEach((err: any) => {
      if (err?.properties?.path) {
        errors[err.properties.path] = err?.properties?.message;
      }
    });
    return errors;
  }

  if (error.name === "TypeError") {
    errors.message = error.message;
    return errors;
  }

  errors.message = error.message || "Something went wrong. Please try again.";
  return errors;
};
