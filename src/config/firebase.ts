
import { initializeApp } from "firebase/app";
import { firebaseConfig } from "./config";

const firebase = initializeApp(firebaseConfig);

console.log({ firebase })

export default firebase