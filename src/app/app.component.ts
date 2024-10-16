import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

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

import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  isreg = 0;

  title = 'Бронирование офисов';


   constructor() {





    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {

		if (user) {
			const uid = user.uid;
			console.log(user.email);
			this.isreg = 1;

		}
        else
        {
          console.log('not reged app');
          // this.html_form = 1;
        }
    });
  }




  SignOut(){

const auth = getAuth();

   auth.signOut().then(function() {
    console.log('Signed Out');
    window.location.reload();

    },
    function(error) {
    console.error('Sign Out Error', error);
  });
}
}
