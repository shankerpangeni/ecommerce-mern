import bcrypt from "bcryptjs";

async function generateHash() {
  const password = "12345678";
  const saltRounds = 10;

  const hashedPassword = await bcrypt.hash(password, saltRounds);
  console.log("Hashed Password:", hashedPassword);
}

generateHash();
