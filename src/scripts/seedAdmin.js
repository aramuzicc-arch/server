import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDb } from "../config/db.js";
import { env } from "../config/env.js";
import { AdminUser } from "../models/AdminUser.js";

async function main() {
  await connectDb();
  const passwordHash = await bcrypt.hash(env.adminPassword, 12);
  await AdminUser.findOneAndUpdate(
    { username: env.adminUsername },
    { username: env.adminUsername, passwordHash, role: "admin" },
    { upsert: true, returnDocument: "after", setDefaultsOnInsert: true },
  );
  console.log(`Seeded admin user "${env.adminUsername}" (password from ADMIN_PASSWORD).`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
