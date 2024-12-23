import { Component,  OnInit  } from '@angular/core';
import { Location } from '@angular/common';
import { RouterOutlet,ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpClientModule, HttpParams} from "@angular/common/http";

import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration


// подключаемся к серверу авторизации

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
  imports: [RouterOutlet,HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  isreg = 0;
  title = 'Бронирование офисов';
  act = '';
  status = '';

  status_get: Array<{status: string; } > = [];


   constructor(private route: ActivatedRoute, private router: Router,private location: Location, private http: HttpClient) {

	//   this.router.events.subscribe((url:any) => console.log(url));




// получаем статус пользователя

    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {

		if (user) {
			const uid = user.uid;
			console.log(user.email);
			this.isreg = 1;

			//console.log(user.email);

			if (user.email!=null)
			{
				this.GetStatus(user.email);
			}
		}
        else
        {
          console.log('not reged app');
          // this.html_form = 1;
        }
    });
  }


// выход из авторизации


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

ngOnInit() {

  this.act = this.location.path();
  
     //console.log(this.location.path());
  }

  GetStatus(user: string)
	{

	//console.log(user);

	  let params = new HttpParams()
			.set('type','status')
		    .set('user',user);

		this.http.get('https://rieltorov.net/tmp/office_api.php', {params}).subscribe(  data => {


			(Object.keys(data)).forEach((key, index) => {
				this.status=Object.values(data)[0];			
				
				});
				

			});

	}


}
