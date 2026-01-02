import { useEffect, useState, useContext } from "react"
import { doc, getDoc, collection, getDocs, setDoc, deleteDoc, serverTimestamp, query, where } from "firebase/firestore"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { db, auth } from "../firebase/firebaseConfig"
import { AuthContext } from "./AuthContext"

// Note: We need to sign out after creating admin to avoid auto-login
import { signOut } from "firebase/auth"

export function useAdmin() {
  const { user } = useContext(AuthContext)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setIsAdmin(false)
      setLoading(false)
      return
    }

    const checkAdminStatus = async () => {
      try {
        // Check if user is in admin collection
        const adminDoc = await getDoc(doc(db, "admins", user.uid))
        setIsAdmin(adminDoc.exists())
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setLoading(false)
      }
    }

    checkAdminStatus()
  }, [user])

  return { isAdmin, loading }
}

export async function addAdmin(email, uid, addedByUid) {
  try {
    await setDoc(doc(db, "admins", uid), {
      email,
      uid,
      createdAt: serverTimestamp(),
      addedBy: addedByUid || "system"
    })
    return true
  } catch (error) {
    console.error("Error adding admin:", error)
    return false
  }
}

export async function removeAdmin(uid) {
  try {
    await deleteDoc(doc(db, "admins", uid))
    return true
  } catch (error) {
    console.error("Error removing admin:", error)
    return false
  }
}

export async function getAllAdmins() {
  try {
    const snapshot = await getDocs(collection(db, "admins"))
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error("Error fetching admins:", error)
    return []
  }
}

export async function checkAdminEmailExists(email) {
  try {
    const q = query(collection(db, "admins"), where("email", "==", email.toLowerCase().trim()))
    const snapshot = await getDocs(q)
    return !snapshot.empty
  } catch (error) {
    console.error("Error checking admin email:", error)
    return false
  }
}

export async function addAdminByEmailPassword(email, password, addedByUid) {
  try {
    // Check for duplicate email
    const emailExists = await checkAdminEmailExists(email)
    if (emailExists) {
      return { success: false, error: "Admin with this email already exists" }
    }

    // Create user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const uid = userCredential.user.uid

    // Check if admin already exists (by UID)
    const adminDoc = await getDoc(doc(db, "admins", uid))
    if (adminDoc.exists()) {
      // Sign out the newly created user since admin already exists
      await signOut(auth)
      return { success: false, error: "Admin user already exists" }
    }

    // Add to admins collection
    await setDoc(doc(db, "admins", uid), {
      email: email.toLowerCase().trim(),
      uid,
      createdAt: serverTimestamp(),
      addedBy: addedByUid || "system"
    })

    // Sign out the newly created user so current admin stays logged in
    await signOut(auth)

    return { success: true, uid, email: email.toLowerCase().trim() }
  } catch (error) {
    console.error("Error adding admin by email/password:", error)
    let errorMessage = "Failed to create admin user"

    if (error.code === "auth/email-already-in-use") {
      errorMessage = "Email is already registered"
    } else if (error.code === "auth/invalid-email") {
      errorMessage = "Invalid email address"
    } else if (error.code === "auth/weak-password") {
      errorMessage = "Password is too weak"
    } else if (error.message) {
      errorMessage = error.message
    }

    return { success: false, error: errorMessage }
  }
}
