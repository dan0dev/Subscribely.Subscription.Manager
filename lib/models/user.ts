import bcrypt from "bcryptjs";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      minlength: [3, "Name must be at least 3 characters"],
    },
    email: {
      type: String,
      required: [true, "Please add an email"],
      unique: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please add a valid email"],
    },
    password: {
      type: String,
      required: [true, "Please add a password"],
      minlength: [6, "Password must be at least 6 characters"],
      select: false,
    },
    accountMoney: {
      type: Number,
      default: 5000,
      min: 0,
      max: 999999999,
    },
    role: {
      type: String,
      enum: ["user", "tester", "admin"],
      default: "user",
    },
  },
  { timestamps: true }
);

// Jelszó titkosítása mentés előtt
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Jelszó ellenőrzése belépéskor
UserSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Ellenőrizzük, hogy a modell már létezik-e, ha nem, akkor létrehozzuk
const User = mongoose.models?.User || mongoose.model("User", UserSchema);

export default User;
