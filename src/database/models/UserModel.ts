import { model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUser {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
}

const userSchema = new Schema<IUser>({
  firstname: { type: String, require: true },
  lastname: { type: String, require: true },
  email: { type: String, require: true },
  password: { type: String, require: true },
});

// Hash the password before saving the user data
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  w;
  next();
});

// TODO : Configure ts for support custome methods on schema
userSchema.methods.getFullName = function () {
  return `${this.firstname} ${this.lastname}`;
};

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
