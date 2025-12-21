import 'dotenv/config';
import { auth, db } from "./firebaseSetup.js";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const ADMIN_EMAIL = process.env.VITE_ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.VITE_ADMIN_PASSWORD;

async function initAdmin() {
    console.log("Starting Admin Initialization...");

    if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
        console.error("Error: VITE_ADMIN_EMAIL or VITE_ADMIN_PASSWORD not found in .env");
        process.exit(1);
    }

    console.log(`Checking admin user: ${ADMIN_EMAIL}`);

    try {
        let uid;
        let userCredential;

        // 1. Try to sign in to see if user exists
        try {
            // If we can sign in, user exists in Auth
            // Note: Using client SDK in Node behaves slightly differently but works for basic Auth operations
            // If this fails, we assume user might not exist or wrong password
            // Actually, better to just try create and catch "email-already-in-use"
            userCredential = await createUserWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
            uid = userCredential.user.uid;
            console.log("Created new admin user in Auth.");
        } catch (error) {
            if (error.code === 'auth/email-already-in-use') {
                console.log("User already exists in Auth. Fetching UID...");
                // We can't easily get UID without logging in via Client SDK if we don't have Admin SDK.
                // So we try to login.
                try {
                    userCredential = await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
                    uid = userCredential.user.uid;
                    console.log("Logged in as existing admin user.");
                } catch (loginError) {
                    console.error("Failed to login as existing admin:", loginError.message);
                    console.error("Please ensure the password in .env matches the existing user's password.");
                    process.exit(1);
                }
            } else {
                console.error("Error creating user:", error);
                process.exit(1);
            }
        }

        if (!uid) {
            console.error("Failed to obtain UID.");
            process.exit(1);
        }

        // 2. Add to admins collection in Firestore
        const adminRef = doc(db, "admins", uid);
        const adminSnap = await getDoc(adminRef);

        if (adminSnap.exists()) {
            console.log("User is already in 'admins' collection in Firestore.");
        } else {
            await setDoc(adminRef, {
                email: ADMIN_EMAIL,
                uid: uid,
                createdAt: serverTimestamp(),
                addedBy: "init_script"
            });
            console.log("Added user to 'admins' collection in Firestore.");
        }

        console.log("Admin initialization complete successfully.");
        process.exit(0);

    } catch (error) {
        console.error("Unexpected error:", error);
        process.exit(1);
    }
}

initAdmin();
