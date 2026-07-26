require("dotenv").config();
const mongoose = require("mongoose");

const MONGO_URI = process.env.MONGO_URI;

async function debug() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  console.log("=== Debugging joinrequests collection ===\n");

  // Drop all indexes first
  console.log("1. Dropping all indexes...");
  await db
    .collection("joinrequests")
    .dropIndexes()
    .catch(() => {});

  // Get all documents
  console.log("\n2. Getting all documents...");
  const allDocs = await db.collection("joinrequests").find({}).toArray();
  console.log("Total documents:", allDocs.length);

  // Print each document
  console.log("\n3. Documents:");
  for (const doc of allDocs) {
    console.log(`  _id: ${doc._id}`);
    console.log(`  project: ${doc.project}`);
    console.log(`  sender: ${doc.sender}`);
    console.log(`  status: ${doc.status}`);
    console.log(`  createdAt: ${doc.createdAt}`);
    console.log("  ---");
  }

  // Check for exact duplicates by project+sender
  console.log("\n4. Checking for duplicates by project+sender...");
  const seen = new Map();
  for (const doc of allDocs) {
    const key = `${doc.project}-${doc.sender}`;
    if (seen.has(key)) {
      console.log(`  DUPLICATE FOUND: ${key}`);
      console.log(`    First: ${seen.get(key)}`);
      console.log(`    Second: ${doc._id}`);
    } else {
      seen.set(key, doc._id);
    }
  }

  // Try to create index
  console.log("\n5. Trying to create unique index...");
  try {
    await db
      .collection("joinrequests")
      .createIndex({ project: 1, sender: 1 }, { unique: true });
    console.log("  SUCCESS: Index created!");
  } catch (e) {
    console.log("  ERROR:", e.message);
  }

  await mongoose.disconnect();
  process.exit(0);
}

debug().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
