import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { db } from "../firebase/firebaseConfig"

/**
 * Initialize admin user from environment variables
 * This runs when the app starts to ensure admin exists
 */
export async function initializeAdmin() {
  try {
    const adminEmail = import.meta.env.VITE_ADMIN_EMAIL
    const adminUID = import.meta.env.VITE_ADMIN_UID

    // If no admin credentials in env, skip initialization
    if (!adminEmail || !adminUID) {
      console.log("No admin credentials found in environment variables. Skipping admin initialization.")
      return false
    }

    // Check if admin already exists
    const adminDocRef = doc(db, "admins", adminUID)
    const adminDoc = await getDoc(adminDocRef)

    if (adminDoc.exists()) {
      console.log("Admin user already exists in database.")
      return true
    }

    // Create admin user
    await setDoc(adminDocRef, {
      email: adminEmail,
      uid: adminUID,
      createdAt: serverTimestamp(),
      addedBy: "system",
      initialized: true
    })

    console.log(`Admin user initialized: ${adminEmail}`)
    return true
  } catch (error) {
    console.error("Error initializing admin:", error)
    return false
  }
}

