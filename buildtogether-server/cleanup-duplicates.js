const mongoose = require("mongoose");

const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/buildtogether";

async function cleanup() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  console.log("Finding duplicates...");

  const duplicates = await db
    .collection("joinrequests")
    .aggregate([
      {
        $group: {
          _id: { project: "$project", sender: "$sender" },
          count: { $sum: 1 },
          ids: { $push: "$_id" },
        },
      },
      { $match: { count: { $gt: 1 } } },
    ])
    .toArray();

  console.log(`Found ${duplicates.length} duplicate pairs`);

  for (const doc of duplicates) {
    const idsToDelete = doc.ids.slice(1); // Keep first, delete rest
    await db
      .collection("joinrequests")
      .deleteMany({ _id: { $in: idsToDelete } });
    console.log(
      `Deleted ${idsToDelete.length} duplicates for project ${doc._id.project}`,
    );
  }

  // Drop and recreate index
  console.log("Recreating unique index...");
  try {
    await db.collection("joinrequests").dropIndex("project_1_sender_1");
  } catch (e) {
    console.log("Index not found, creating new...");
  }
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
