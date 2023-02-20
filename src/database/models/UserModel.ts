import { Document, Model, model, Schema } from "mongoose";
import bcrypt from "bcrypt";

export interface IUserDocument extends Document {
  firstname: string;
  lastname: string;
  email: {
    address: string;
    verified: boolean;
  };
  password: string;
  friends?: string[];
  avatarUrl: string;
  birthday?: string;
}

export interface IUser extends IUserDocument {
  getFullname: () => string;
}

interface IUserModel extends Model<IUserDocument, {}> {}
export interface IUserPostRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  friends?: string[];
  avatarUrl: string;
}

export interface IUserUpdate extends IUser {
  userId: string;
}

const userSchema = new Schema<IUser, IUserModel>({
  firstname: { type: String, require: true },
  lastname: { type: String, require: true },
  email: {
    address: { type: String, require: true },
    verified: { type: Boolean, require: false },
  },
  password: { type: String, require: true },
  friends: [String],
  avatarUrl: String,
  birthday: String,
});

// Hash the password before saving the user data
userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// TODO : Configure ts for support custome methods on schema
userSchema.methods.getFullname = function () {
  return `${this.firstname} ${this.lastname}`;
};

const UserModel = model<IUser>("User", userSchema);

export default UserModel;
