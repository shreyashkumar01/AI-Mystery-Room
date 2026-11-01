import mongoose from "mongoose";

let memoryServerInstance = null;

export const connectDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI?.trim();

    if (mongoUri) {
      console.log("[Database] Connecting to provided MONGODB_URI...");
      await mongoose.connect(mongoUri);
      console.log(`[Database] MongoDB connected successfully to external URI: ${mongoose.connection.host}`);
      return;
    }

    // Zero-config fallback: MongoMemoryServer
    console.log("[Database] No MONGODB_URI provided. Initializing embedded in-memory MongoDB instance...");
    try {
      const { MongoMemoryServer } = await import("mongodb-memory-server");
      memoryServerInstance = await MongoMemoryServer.create();
      const inMemoryUri = memoryServerInstance.getUri();
      await mongoose.connect(inMemoryUri);
      console.log(`[Database] Connected to in-memory MongoDB instance at: ${inMemoryUri}`);
    } catch (memErr) {
      console.warn("[Database] Could not start mongodb-memory-server, attempting localhost:27017:", memErr.message);
      await mongoose.connect("mongodb://127.0.0.1:27017/ai-mystery-room");
      console.log("[Database] Connected to local MongoDB at mongodb://127.0.0.1:27017/ai-mystery-room");
    }
  } catch (error) {
    console.error("[Database] Connection failed:", error.message);
    throw error;
  }
};

export const disconnectDatabase = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServerInstance) {
      await memoryServerInstance.stop();
    }
    console.log("[Database] MongoDB disconnected cleanly.");
  } catch (error) {
    console.error("[Database] Error disconnecting:", error.message);
  }
};
