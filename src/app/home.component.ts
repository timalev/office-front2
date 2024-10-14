import { Component} from "@angular/core";
import { HttpClient, HttpHeaders, HttpClientModule, HttpParams} from "@angular/common/http";
import { CommonModule } from '@angular/common';

import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, update } from "firebase/database";
import { getStorage, ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";

//import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';

//import {DragDropModule} from '@angular/cdk/drag-drop';

import {CdkDragDrop, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';

@Component({
    selector: "home-app",
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    standalone: true,
    imports: [FormsModule,HttpClientModule,CommonModule,CdkDropList, CdkDrag],
})


export class HomeComponent {


	 groups: Array<{id: number; name: string; } > = [];
	 users: Array<{id: number; name: string; group: string; } > = [];
	 //tables:  String[] = [];

	 tables:   Array<{name: string; visibility: string; } > = [];

	 disablestatus: boolean = false;


	 blocks = [
		 { name: 'Block 1', x: 50, y: 100 },
		 { name: 'Block 2', x: 650, y: 200 },
		 { name: 'Block 3', x: 250, y: 100 },
		 { name: 'Block 4', x: 350, y: 100 }
	 ];


/*
drop(event: CdkDragDrop<any[]>){

	const prevIndex = this.blocks.findIndex((d) => d === event.item.data);
	moveItemInArray(this.blocks, prevIndex,event.currentIndex);
	//this.updateCoordinates();
}


[

{"name": "Two","display": "block"},
{"name":"Eight","display": "block"},
{"name":"Four","display": "block"},
{"name":"One","display": "block"},
{"name":"Seven","display": "block"},
{"name":"Zero","display": "block"},
{"name":"Three","display": "block"},
{"name":"Six","display": "block"}


]

*/

	  dragPosition = {x: 0, y: 0};

	  dragPosition2 = {x: 0, y: 0};

	  dragPosition3 = {x: 0, y: 0};

	  dragPosition4 = {x: 0, y: 0};

	  dragPosition5 = {x: 0, y: 0};

	  dragPosition6 = {x: 0, y: 0};


 changePosition() {
  //  this.dragPosition = {x: this.dragPosition.x + 50, y: this.dragPosition.y + 50};


  let itemUpdated = {name:'Two', visibility:'visible'};

 // this.tables.find(item => item.name == itemUpdated.name).visibility = itemUpdated.visibility;
  
  let coords = this.getindex(0,1);
  
  this.tables[coords].visibility =  'visible';
  this.tables[coords].name =  'Группа 2';


  	let disc = this.tables.filter(item => item.visibility === 'hidden').length;

	console.log(disc);

		
		if (disc==0)
		{
			this.disablestatus = false;
		}


  this.updateTables();

	
  }



	// items = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];


  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.tables, event.previousIndex, event.currentIndex);


	//console.log('item moved from index ' + event.previousIndex + ' to index ' + event.currentIndex);

	//console.log(this.tables);

	var tables_json = JSON.stringify(this.tables);

	//console.log(tables_json);


	const body = {json: tables_json};

	this.http.post("https://rieltorov.net/tmp/office_api.php", body).subscribe(  data => {
		
//console.log(data);

	}); 

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



	  console.log(this.dropDisable());


    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
		
		if (user) {
			const uid = user.uid;
			console.log(user.email);
			this.isreg = 1;
			
			this.groupslist();
		    this.userslist();
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


getindex(y: number, x: number)
	{

	  let p = x;
	  
	  if (y==1) p = 4 + x;
	  
	 
	  return p;

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

groupslist()
	{
	  let params = new HttpParams()
			.set('type','groups');
		
        this.http.get('https://rieltorov.net/tmp/office_api.php', {params}).subscribe(  data => {
			(Object.keys(data)).forEach((key, index) => {
				this.groups.push({
					id: Object.values(data)[index]["id"],
					name: Object.values(data)[index]["name"]
					});
				});
			});
	}

userslist()
	{
		let params = new HttpParams()
			.set('type','users');

		this.http.get('https://rieltorov.net/tmp/office_api.php', {params}).subscribe(  data => {


			(Object.keys(data)).forEach((key, index) => {
				this.users.push({
					id: Object.values(data)[index]["id"],
					name: Object.values(data)[index]["name"],
					group: Object.values(data)[index]["group"]	
					});
				});


			});


	}

deltab(item: {name: string; visibility: string})
	{
	//console.log(item.visibility);
	item.visibility = "hidden";
	
	//console.log(this.tables);

	var tables_json = JSON.stringify(this.tables);

	const body = {json: tables_json};

	this.http.post("https://rieltorov.net/tmp/office_api.php", body).subscribe(  data => {


		this.disablestatus = true;
		
//console.log(data);

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
					visibility: Object.values(data)[index]["visibility"]
				});


				});




        //  console.log(this.tables);

		let disc = this.tables.filter(item => item.visibility === 'hidden').length;
		
		if (disc!=0)
		{
			this.disablestatus = true;
		}
		//console.log(disc);





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




