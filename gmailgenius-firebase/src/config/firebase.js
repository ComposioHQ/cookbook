import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signOut } from "firebase/auth";
import { getFirestore, collection, addDoc, getDocs, query, where } from "firebase/firestore";


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

export const addUserData = async (uid, username) => {
    try {
        const exist = await doesUserExist(username);
        if (exist) {
            return;
        }
        const docRef = await addDoc(collection(db, "users"), {
            uid: uid,
            username: username,
            gmailAccountConnected: false,
            sheetAccountConnected: false,
            sheetsConfig: {
                spreadsheet_id: "",
                sheetName: "Sheet1",
                keywords: "",
                attributes: "",
                row: "1",
            }
        });
        console.log("Document written with id: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}



export const getUserData = async () => {
    const querySnapshot = await getDocs(collection(db, "users"));
    const arr = [];
    // return querySnapshot;
    querySnapshot.forEach((doc) => {
        arr.push({
            firstName: doc.data().firstName,
            lastName: doc.data().lastName
        })
    });
    return arr;
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