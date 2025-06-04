import { signOut, User } from "firebase/auth";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
  Timestamp,
  FieldValue,
  updateDoc,
  collection,
  addDoc,
  deleteDoc,
} from "firebase/firestore";
import { auth, db } from "./firebase";

export interface UserProfile {
  uid: string;
  phoneNumber: string;
  displayName?: string;
  photoURL?: string;
  isOnline: boolean;
  lastActive: Timestamp | null;
  createdAt: Timestamp | null;
  updatedAt: Timestamp | null;
}

interface UserDataInput
  extends Omit<UserProfile, "lastActive" | "createdAt" | "updatedAt"> {
  lastActive?: FieldValue | Timestamp | null;
  createdAt?: FieldValue | Timestamp | null;
  updatedAt?: FieldValue | Timestamp | null;
}

export const createOrUpdateUserProfile = async (
  user: User,
  additionalData?: Partial<UserProfile>
): Promise<void> => {
  if (!user.uid) {
    throw new Error("User UID is required");
  }

  try {
    const userDocRef = doc(db, "users", user.uid);

    const userDocSnap = await getDoc(userDocRef);
    const userExists = userDocSnap.exists();

    const userData: Partial<UserDataInput> = {
      uid: user.uid,
      phoneNumber: user.phoneNumber || "",
      displayName: user.displayName || "",
      photoURL: user.photoURL || "",
      isOnline: true,
      lastActive: serverTimestamp(),
      updatedAt: serverTimestamp(),
      ...additionalData,
    };

    if (!userExists) {
      userData.createdAt = serverTimestamp();
    }

    await setDoc(userDocRef, userData, { merge: true });
    console.log("User profile created/updated successfully");
  } catch (error) {
    console.error("Error creating/updating user profile:", error);
    throw new Error("Failed to create user profile");
  }
};

export const getUserProfile = async (
  uid: string
): Promise<UserProfile | null> => {
  try {
    const userDocRef = doc(db, "users", uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      return userDocSnap.data() as UserProfile;
    }

    return null;
  } catch (error) {
    console.error("Error getting user profile:", error);
    throw new Error("Failed to get user profile");
  }
};

export const updateUserOnlineStatus = async (
  uid: string,
  isOnline: boolean
): Promise<void> => {
  try {
    const userDocRef = doc(db, "users", uid);
    await updateDoc(userDocRef, {
      isOnline,
      lastActive: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error("Error updating user online status:", error);
    throw new Error("Failed to update user status");
  }
};

export const logoutUser = async () => {
  try {
    await signOut(auth);
  } catch (error) {
    console.error("Error logging out:", error);
    throw new Error("Failed to logout");
  }
};

export const sendMessage = async (message: {
  text: string;
  userId: string;
  userPhone: string;
  timestamp: Timestamp;
}) => {
  try {
    const messageRef = collection(db, "messages");
    await addDoc(messageRef, message);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

export const deleteMessage = async (messageId: string) => {
  try {
    const messageRef = doc(db, "messages", messageId);
    await deleteDoc(messageRef);
  } catch (error) {
    console.error("Error deleting message:", error);
  }
};
