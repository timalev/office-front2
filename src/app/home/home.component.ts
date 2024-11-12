import { Component} from "@angular/core";
import { HttpClient, HttpHeaders, HttpClientModule, HttpParams} from "@angular/common/http";
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';
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
    imports: [FormsModule,HttpClientModule,CommonModule],
})


export class HomeComponent {


private baseUrl = environment.baseUrl;


 // поля формы регистрации

  loginForm:
  any = {
	user: '',
    login: '',
    password: '',
    password2: '',
    type: ''
  }

// поля формы авторизации

  loginForma:
  any = {
    logina: '',
    passworda: ''
  }



  isreg = 0;
  doauth=1;



  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {



    const auth = getAuth();


// проверяем авторизован ли пользователь

    onAuthStateChanged(auth, (user) => {

		if (user) {
			const uid = user.uid;
			//console.log(user.email);
			this.isreg = 1;

      
		}
        else
        {
          console.log('not reged');
          // this.html_form = 1;
        }
    });
  }


// регистрация новых пользователей

  reg()
  {
    //console.log(this.loginForm);

    if (
	  this.loginForm.user!="" &&
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

      //console.log(user);


	  var reg_json = JSON.stringify({user: this.loginForm.user, login: this.loginForm.login, status: this.loginForm.type});

	
	//const body = {json: tables_json};
	this.http.post(this.baseUrl, reg_json).subscribe(  data => {

		console.log(data);
		this.doauth=1;
		
	});
	


 




    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode + ": " + errorMessage);
      alert(errorMessage);
    });
    }
    else  alert("Ошибка заполнения формы");

  }

// авторизация пользователей

 SignIn(){


   const auth = getAuth();
signInWithEmailAndPassword(auth, this.loginForma.logina, this.loginForma.passworda)
  .then((userCredential) => {


    // Signed in
    const user = userCredential.user;


	 if (user) {
    
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




