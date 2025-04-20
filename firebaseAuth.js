const admin = require("firebase-admin");
require("dotenv").config(); // Load environment variables

// Get credentials from environment variables
const serviceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'), // Ensure line breaks in private key
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

// Initialize Firebase Admin SDK with environment variables
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function getFirebaseCustomToken() {
  try {
    const uid = "YPTLKIUl1FfYTsXJmONgf710tvKX2"; // Replace this with the UID of your new Firebase user
    const customToken = await admin.auth().createCustomToken(uid);
    console.log("Firebase Custom Token:", customToken);
  } catch (error) {
    console.error("Error generating custom token:", error);
  }
}

// Call the function to get a Firebase Custom Token
getFirebaseCustomToken();
