import * as functions from "firebase-functions/v1";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

const db = admin.firestore();

exports.onCreateUserDocument = functions.auth
  .user()
  .onCreate(async (user: admin.auth.UserRecord) => {
    try {
      const userDocRef = db.collection("users").doc(user.uid);
      const existingDoc = await userDocRef.get();

      if (!existingDoc.exists) {
        const userData = {
          uid: user.uid,
          phoneNumber: user.phoneNumber || "",
          displayName: user.displayName || "",
          photoURL: user.photoURL || "",
          email: user.email || "",
          isOnline: false,
          lastActive: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        };

        await userDocRef.set(userData);
        console.log("User document created successfully");
      } else {
        console.log("User document already exists, skipping creation");
      }
    } catch (error) {
      console.error("Error creating user document:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to create user document"
      );
    }
  });

exports.onDeleteUserDocument = functions.auth
  .user()
  .onDelete(async (user: admin.auth.UserRecord) => {
    try {
      const userDocRef = db.collection("users").doc(user.uid);
      await userDocRef.delete();
      console.log("User document deleted successfully");
    } catch (error) {
      console.error("Error deleting user document:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to delete user document"
      );
    }
  });

exports.updateUserStatus = functions.https.onCall(async (data, context) => {
  try {
    if (!context.auth) {
      throw new functions.https.HttpsError(
        "unauthenticated",
        "User must be authenticated"
      );
    }

    const userId = context.auth.uid;
    const isOnline = data.isOnline || false;

    await db.collection("users").doc(userId).update({
      isOnline: isOnline,
      lastActive: admin.firestore.FieldValue.serverTimestamp(),
    });

    console.log(`The user ${userId} is ${isOnline ? "online" : "offline"}`);

    return { success: true };
  } catch (error) {
    console.error("Error updating user status:", error);
    throw new functions.https.HttpsError(
      "internal",
      "Failed to update user status"
    );
  }
});

exports.onMessageCreate = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snapshot) => {
    try {
      const message = snapshot.data();

      if (!message) {
        console.log("Message data is missing");
        return;
      }
      console.log("New message created:", message);

      const usersSnapshot = await db.collection("users").get();

      if (usersSnapshot.empty) {
        console.log("No users found in database");
        return;
      }

      const usersToNotify = usersSnapshot.docs
        .map((doc) => doc.data())
        .filter((user) => user.uid !== message.userId);

      usersToNotify.forEach((user) => {
        const displayName =
          user.displayName || user.phoneNumber || user.email || "Unknown User";
        console.log(`Notification sent to ${displayName} with id ${user.uid}`);
      });
    } catch (error) {
      console.error("Error sending notifications:", error);
      throw new functions.https.HttpsError(
        "internal",
        "Failed to send notifications"
      );
    }
  });

exports.copyMessageToUsers = functions.firestore
  .document("messages/{messageId}")
  .onCreate(async (snap, context) => {
    try {
      const messageData = snap.data();
      const messageId = context.params.messageId;

      // Input validation
      if (!messageData) {
        console.log("Message data is missing");
        return;
      }

      console.log(`Copying message ${messageId} to all users' subcollections`);

      const usersSnapshot = await db.collection("users").get();
      if (usersSnapshot.empty) {
        console.log("No users found");
        return;
      }

      const allUsers = usersSnapshot.docs.map((doc) => doc.data());

      // Use batch processing for better scalability
      const batchSize = 100; // Reasonable batch size for Promise.all
      const batches = [];

      for (let i = 0; i < allUsers.length; i += batchSize) {
        const batch = allUsers.slice(i, i + batchSize);
        const batchPromises = batch.map((user) => {
          return db
            .collection("users")
            .doc(user.uid)
            .collection("messages")
            .doc(messageId)
            .set({
              ...messageData,
              copiedAt: admin.firestore.FieldValue.serverTimestamp(),
              hidden: false,
              tags: [],
            });
        });

        batches.push(Promise.all(batchPromises));
      }

      // Execute all batches
      await Promise.all(batches);

      console.log(
        `Message ${messageId} copied to ${allUsers.length} users' personal collections`
      );
    } catch (error) {
      console.error("Error copying message to users:", error);
      // Re-throw to ensure Cloud Functions reports the error
      throw new functions.https.HttpsError(
        "internal",
        "Failed to copy message to users"
      );
    }
  });
