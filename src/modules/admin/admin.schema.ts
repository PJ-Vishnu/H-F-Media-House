
import { ObjectId } from "mongodb";

export type AdminUser = {
  _id?: ObjectId;
  email: string;
  passwordHash: string;
};
