import { Component} from "@angular/core";
import { HttpClient, HttpHeaders, HttpClientModule, HttpParams} from "@angular/common/http";
import { CommonModule } from '@angular/common';

import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, update } from "firebase/database";
import { getStorage, ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {CdkDragDrop, CdkDragEnd, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
    selector: "home-app",
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [FormsModule,HttpClientModule,CommonModule,CdkDropList, CdkDrag],
})


export class HomeComponent {

   offices: Array<{id: number; name: string; } > = [];


	 tables:   Array<{name: string; visibility: string; mon: number; type: string; position: {x: number, y: number}; office: string} > = [];

	 //disablestatus: boolean = false;



 addtable() {


   	this.tables.push({
					name: this.tablesForm.rabpernme,
					visibility: 'visible',
          mon: Number(this.tablesForm.mon),
          type: this.tablesForm.tabtype,
          position: {x: Number(this.tablesForm.x), y:Number(this.tablesForm.y)},
          office: this.tablesForm.office,
				});


    //console.log(this.tables);
  }



	dragEnded_new(event: CdkDragEnd<string[]>,i: number)
  {
    //console.log(event.distance.x);

    //console.log(this.newposition(this.tables[i].position.x,event.distance.x,this.tables[i].position.y,event.distance.y));


   this.tables[i].position = this.newposition(this.tables[i].position.x,event.distance.x,this.tables[i].position.y,event.distance.y);

   this.updateTables();

  }

newposition(x: number, x2: number, y: number, y2: number)
{
    let new_x = x + x2;
    let new_y = y + y2;

    return {"x":new_x,"y":new_y};

    //console.log(x2 + "," + y2 + " / " + new_x +  "," + new_y);
}

dragEnd(event: CdkDragEnd<string[]>) {

  console.log("pidr");
    //console.log($event.source.getFreeDragPosition());
}

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tables, event.previousIndex, event.currentIndex);


	console.log('item moved from index ' + event.previousIndex + ' to index ' + event.currentIndex);

	//console.log(this.tables);

	var tables_json = JSON.stringify(this.tables);

	//console.log(tables_json);


	const body = {json: tables_json};

	this.http.post("https://rieltorov.net/tmp/office_api.php", body).subscribe(  data => {

//console.log(data);

	});

  }


 tablesForm:
  any = {
    x: 0,
    y: 0,
    mon: 0,
    tabtype: '',
    rabpernme: ''
  }

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



	  //console.log(this.dropDisable());


    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {

		if (user) {
			const uid = user.uid;
			console.log(user.email);
			this.isreg = 1;

      this.officeslist();
			this.tableslist();
		}
        else
        {
          console.log('not reged');
          // this.html_form = 1;
        }
    });




  }



dropDisable(): number {


	return this.tables.filter(item => item.visibility === 'visible').length;
}




updateTables()
	{



	   	var tables_json = JSON.stringify(this.tables);

	//console.log(tables_json);


	const body = {json: tables_json};

	this.http.post("https://rieltorov.net/tmp/office_api.php", body).subscribe(  data => {




//console.log(data);

	});
	}



officeslist()
{
   let params = new HttpParams()
			.set('type','offices');

        this.http.get('https://rieltorov.net/tmp/office_api.php', {params}).subscribe(  data => {
			(Object.keys(data)).forEach((key, index) => {
				this.offices.push({
					id: Object.values(data)[index]["id"],
					name: Object.values(data)[index]["name"]
					});
				});
			});
}


deltab(i:number)
	{

    this.tables.splice(i, 1);


   // c.visibility = "hidden";

	//console.log(this.tables);

	var tables_json = JSON.stringify(this.tables);

	const body = {json: tables_json};

	this.http.post("https://rieltorov.net/tmp/office_api.php", body).subscribe(  data => {



	});




	}
tableslist()
	{
		let params = new HttpParams()
			.set('type','tables');

		this.http.get('https://rieltorov.net/tmp/office_api.php', {params}).subscribe(  data => {



//console.log(data);

			(Object.keys(data)).forEach((key, index) => {

				//console.log(Object.values(data));

				//console.log(Object.values(data)[index]["name"]);


				this.tables.push({
					name: Object.values(data)[index]["name"],
					visibility: Object.values(data)[index]["visibility"],
          mon: Object.values(data)[index]["mon"],
          type: Object.values(data)[index]["type"],
          position: {x: Object.values(data)[index]["position"]["x"], y:Object.values(data)[index]["position"]["y"]},
          office: Object.values(data)[index]["office"]
				});


				});



/*
        // console.log(this.tables[0].position);

		let disc = this.tables.filter(item => item.visibility === 'hidden').length;

		if (disc!=0)
		{
			this.disablestatus = true;
		}
		//console.log(disc);

*/



			});


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




