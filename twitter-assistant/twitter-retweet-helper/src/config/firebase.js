import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where, updateDoc } from "firebase/firestore";


const firebaseConfig = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: import.meta.env.VITE_FIREBASE_APP_ID,
    measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);

export const logOut = () => {
    signOut(auth).then(() => {
        console.log("user signed out");
    }).catch((error) => {
        console.log("error signing user out");
    });
}

const db = getFirestore(app);

const doesUserExist = async (username) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);
        return !querySnapshot.empty;
    } catch (error) {
        console.error("Error checking user:", error);
        return false;
    }
}

export const addUserData = async (uid, username, email) => {
    try {
        const exist = await doesUserExist(username);
        if (exist) {
            return;
        }
        const docRef = await addDoc(collection(db, "users"), {
            uid: uid,
            username: username,
            email: email,
            gmailAccountConnected: false,
            gmailTriggerEnabled: false,
            slackChannelConnected: false,
            keywords: [
                {
                    keywords: "",
                    email: "",
                    slackChannel: ""
                },
                {
                    keywords: "",
                    email: "",
                    slackChannel: ""
                },
                {
                    keywords: "",
                    email: "",
                    slackChannel: ""
                }
            ]
        });
        console.log("Document written with id: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}

export const addKeywords = async (uid, keywords) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            await updateDoc(userDoc.ref, {
                "keywords": keywords,
            });
            console.log("Keywords added successfully");
        } else {
            console.log("User not found");
        }
    } catch (error) {
        console.error("Error updating keywords:", error);
    }
}

export const getUserDetailsByUid = async (uid) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("uid", "==", uid));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            return userDoc.data();
        } else {
            console.log("User does not exist.");
            return null;
        }
    } catch (error) {
        console.error("Error getting user details:", error);
        return null;
    }
}

export const getTriggerStatus = async (username) => {
    try {
        const usersRef = collection(db, "users");
        const q = query(usersRef, where("username", "==", username));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const userDoc = querySnapshot.docs[0];
            const triggerStatus = userDoc.data().gmailTriggerEnabled;
            return triggerStatus;
        } else {
            console.log("User does not exist.");
            return null;
        }
    } catch (error) {
        console.error("Error getting trigger status:", error);
        return null;
    }
}