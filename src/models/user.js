const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const Task = require("./task");
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("EMAIL IS INVALID");
        }
      }
    },
    password: {
      type: String,
      required: true,
      minlength: 7,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('passord cannot contain word "password"');
        }
      }
    },
    age: {
      type: Number,
      default: 0,
      validate(value) {
        if (value < 0) {
          throw new Error("ENTER A VALID AGE!!");
        }
      }
    },
    tokens: [
      {
        token: {
          type: String,
          required: true
        }
      }
    ],
    avatar: {
      type: Buffer
    }
  },
  {
    timestamps: true
  }
);

UserSchema.virtual("tasks", {
  ref: "tasks",
  localField: "_id",
  foreignField: "owner"
});
UserSchema.methods.generateAuthToken = async function() {
  const user = this;
  //console.log(this._id.toString());
  const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_ENV);
  //adding token to database
  user.tokens = user.tokens.concat({ token });
  await user.save();
  return token;
};

UserSchema.methods.toJSON = function() {
  const user = this;
  const userObject = user.toObject();
  delete userObject.password;
  delete userObject.tokens;
  delete userObject.avatar;
  return userObject;
};

// UserSchema.methods.getPublicProfile = function() {
//   const user = this;
//   const userObject = user.toObject();
//   delete userObject.password;
//   delete userObject.tokens;
//   return userObject;
// };

UserSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error("Unable to login");
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error("unable to log in");
  }
  return user;
};

//hash the plain text passpword before saving

UserSchema.pre("save", async function(next) {
  const user = this;
  //hashpass
  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  // console.log("jusst before next");
  next();
});
// delete user tasks when user is removed
UserSchema.pre("remove", async function(next) {
  const user = this;
  Task.deleteMany({ owner: user._id });
  next();
});
const User = mongoose.model("users", UserSchema);

module.exports = User;
