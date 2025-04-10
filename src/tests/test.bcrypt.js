import bcrypt from 'bcrypt';

async function test() {
  const hash = await bcrypt.hash("test123", 10);
  console.log("Hash:", hash);
}

test();