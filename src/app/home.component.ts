import { Component} from "@angular/core";
import { HttpClient, HttpClientModule} from "@angular/common/http";

import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, update } from "firebase/database";
import { getStorage, ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";



@Component({
    selector: "home-app",
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [FormsModule,HttpClientModule],
})


export class HomeComponent {


  loginForm:
  any = {
    login: '',
    password: '',
    password2: '',
    type: ''
  }

  loginForma:
  any = {
    logina: '',
    passworda: ''
  }


  isreg = 0;





  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {

      if (user) {
        const uid = user.uid;
        console.log(user.email);
        this.isreg = 1;

        // this.html_form = 0;
        // this.ProfName =  "Пользователь: <b>" + String(user.email) + "</b>";
        }
        else
        {
          console.log('not reged');
          // this.html_form = 1;
        }
    });









//console.log(this.html_form )


  }






  reg()
  {
    console.log(this.loginForm);

    if (
      this.loginForm.login!="" &&
      this.loginForm.password!="" &&
      this.loginForm.password==this.loginForm.password2
    )
    {

    const auth = getAuth();

    createUserWithEmailAndPassword(auth, this.loginForm.login, this.loginForm.password).then((userCredential) =>
    {
      const user = userCredential.user;
      const uid = user.uid;

      console.log(user);

      const db = getDatabase();
      set(ref(db, 'users/' + uid), {
        login: this.loginForm.login,
        password: this.loginForm.password

       })
      .catch((error) => {
        console.log(error);
      });

    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + ": " + errorMessage);
      alert(errorMessage);
    });
    }
    else  alert("Пароли не совпадают");

  }





  SignIn(){


   const auth = getAuth();
signInWithEmailAndPassword(auth, this.loginForma.logina, this.loginForma.passworda)
  .then((userCredential) => {


    // Signed in
    const user = userCredential.user;









	 if (user) {
    // User is signed in, see docs for a list of available properties
    // https://firebase.google.com/docs/reference/js/firebase.User
   const uid = user.uid;


    console.log(uid);


  }
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;


    //alert(errorMessage);
    console.log(errorMessage);
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




