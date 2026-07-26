const mongoose = require("mongoose");

require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

async function cleanup() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  // First, drop ALL indexes including the unique one
  console.log("Dropping all indexes...");
  await db.collection("joinrequests").dropIndexes();

  // Now find ALL documents and check for duplicates
  console.log("Finding all requests...");
  const allRequests = await db.collection("joinrequests").find({}).toArray();
  console.log("Total requests:", allRequests.length);

  // Group by project + sender
  const groups = {};
  for (const req of allRequests) {
    const key = `${req.project}-${req.sender}`;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(req);
  }

  // Find duplicates
  let totalDeleted = 0;
  for (const [key, docs] of Object.entries(groups)) {
    if (docs.length > 1) {
      console.log(`Duplicate found: ${key} has ${docs.length} records`);
      // Keep first, delete rest
      const toDelete = docs.slice(1).map((d) => d._id);
      await db
        .collection("joinrequests")
        .deleteMany({ _id: { $in: toDelete } });
      console.log(`  Deleted ${toDelete.length} duplicates`);
      totalDeleted += toDelete.length;
    }
  }

  console.log(`Total duplicates deleted: ${totalDeleted}`);

  // Recreate unique index
  console.log("Creating unique index...");
  await db
    .collection("joinrequests")
    .createIndex({ project: 1, sender: 1 }, { unique: true });

  console.log("Done!");
  await mongoose.disconnect();
  process.exit(0);
}

cleanup().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
