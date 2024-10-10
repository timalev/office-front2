import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBW0xmbj0ucOxaRwoQahHbXU81CNmersNQ",
  authDomain: "booking-46609.firebaseapp.com",
  projectId: "booking-46609",
  storageBucket: "booking-46609.appspot.com",
  messagingSenderId: "898827103075",
  appId: "1:898827103075:web:94c4616ae88a3976d08156"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
