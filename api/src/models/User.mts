import mongoose, { InferSchemaType, Schema, model } from "mongoose";
//import type { UserDto } from "./userDTO.mts";
import { UserDto } from "../DTOs/userDTO.mts";

export const userSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true },
  email: { type: String, required: true },
});

const User = model("User", userSchema);

//Type from schema for type secure
type UsersDbType = InferSchemaType<typeof userSchema>;

//get document and Convert DB document to safe DTO. Return = objects to frontend
export const convertToDto = (dataFromDb: UsersDbType): UserDto => {
  return {
    username: dataFromDb.username,
    email: dataFromDb.email,
  } satisfies UserDto;
};

export default User;
