import { Directive, Component, inject, model, signal, importProvidersFrom,OnInit} from "@angular/core";
import { HttpClient, HttpHeaders, HttpClientModule, HttpParams} from "@angular/common/http";
import { CommonModule } from '@angular/common';

import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, update } from "firebase/database";
import { getStorage, ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {CdkDragDrop, CdkDragEnd, CdkDrag, CdkDropList, moveItemInArray} from '@angular/cdk/drag-drop';




@Component({
    selector: "scheme-app",
    templateUrl: './scheme.component.html',
    styleUrls: ['./scheme.component.scss'],
    standalone: true,


    imports: [FormsModule,
		HttpClientModule,
		CommonModule,
		CdkDropList, CdkDrag],

})


export class SchemeComponent implements OnInit {

   offices: Array<{id: number; name: string; } > = [];
   tables:   Array<{name: string; visibility: string; mon: number; type: string; position: {x: number, y: number}; office: string, book: string;} > = [];

   books: Array<{id: number; name: string; date: string; user: string;} > = [];

	 //disablestatus: boolean = false;

   status = '';
   disdrag: boolean = true;

   selectedTable = '';
   tableType = '';

   useroffice = '';
   user = '';

   isbooked: string[] = [];


   bookingForm:
	  any = {
	  date: '',
	  datetime: '',
	}





 addtable() {


   	this.tables.push({
					name: this.tablesForm.rabpernme,
					visibility: 'visible',
          mon: Number(this.tablesForm.mon),
          type: this.tablesForm.tabtype,
          position: {x: Number(this.tablesForm.x), y:Number(this.tablesForm.y)},
          office: this.tablesForm.office,
          book: '',
				});


    //console.log(this.tables);
  }



// создаем новое место

dragEnded_new(event: CdkDragEnd<string[]>,i: number)
  {
   this.tables[i].position = this.newposition(this.tables[i].position.x,event.distance.x,this.tables[i].position.y,event.distance.y);

// отправляем координаты в бэк

   this.updateTables();

  }

newposition(x: number, x2: number, y: number, y2: number)
{
    let new_x = x + x2;
    let new_y = y + y2;

    return {"x":new_x,"y":new_y};

}





 tablesForm:
  any = {
    x: 0,
    y: 0,
    mon: 0,
    tabtype: '',
    rabpernme: ''
  }


  isreg = 0;





  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient ) {


	  //console.log(this.dropDisable());




    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {

		if (user) {
			const uid = user.uid;
			//console.log(user.email);

			if (user.email!=null)
			{
				this.user = user.email;
				this.GetStatus(user.email);

				

			}


			this.isreg = 1;

      this.officeslist();
			this.tableslist();
      this.getBooks();



     // this.checkDate(this.busy);


		}
        else
        {
          console.log('not reged');
          // this.html_form = 1;
        }
    });




  }

/*
dropDisable(): number {
	return this.tables.filter(item => item.visibility === 'visible').length;
}

*/
/*
isbooked(name: string)
	{
	//this.books
	  const newItem = this.books.find(newItem => newItem.name === name);

	 // console.log(newItem);

	   return '';
	}
	*/
doBook()
{
	
	 if (this.bookingForm.date!="" || this.bookingForm.datetime!="")
	 {
		 let date = this.bookingForm.date;
		 let time = "00:00";

		 if (this.bookingForm.datetime!=""){
			 date = this.bookingForm.datetime.split("T")[0];
			 time = this.bookingForm.datetime.split("T")[1];
		}
      // console.log(this.bookingForm.date + " / " + this.selectedTable);


		   var book_json = JSON.stringify({book_name: this.selectedTable, book_date: date, book_time: time, user: this.user});

		   this.http.post("https://rieltorov.net/tmp/office_api.php", book_json).subscribe(  data => {




    this.isbooked.push(this.selectedTable);

			   if (data!=null)
			   {
			   //}



			   (Object.keys(data)).forEach((key, index) => {

				   if (Number(Object.values(data)[0])>0)
				   {
					   alert("Бронирование успешно!");

				   };

				});

		   }

			}, error => {console.log(error)});



	 }

}


updateTables()
{
	var tables_json = JSON.stringify(this.tables);
	const body = {json: tables_json};
	this.http.post("https://rieltorov.net/tmp/office_api.php", body).subscribe(  data => {

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

// удаление рабочих мест

deltab(i:number)
{
    this.tables.splice(i, 1);
	var tables_json = JSON.stringify(this.tables);
	const body = {json: tables_json};
	this.http.post("https://rieltorov.net/tmp/office_api.php", body).subscribe(  data => {

	});
}

unbook(table:string)
{

	 var unbook_json = JSON.stringify({unbook: table});


	this.http.post("https://rieltorov.net/tmp/office_api.php", unbook_json).subscribe(  data => {


    this.isbooked.splice(this.isbooked.indexOf(table), 1);


	 if (Object.values(data)[0]=='ok')
				{
					alert("Бронирование отменено");
				};
	});

}


tableslist()
	{
		let params = new HttpParams()
			.set('type','tables');

		this.http.get('https://rieltorov.net/tmp/office_api.php', {params}).subscribe(  data => {







const offc = Object.values(data).filter(newItem=>newItem.office===1);

//console.log(offc);












			(Object.keys(data)).forEach((key, index) => {

				this.tables.push({
					name: Object.values(data)[index]["name"],
					visibility: Object.values(data)[index]["visibility"],
					mon: Object.values(data)[index]["mon"],
					type: Object.values(data)[index]["type"],
					position: {x: Object.values(data)[index]["position"]["x"], y:Object.values(data)[index]["position"]["y"]},
					office: Object.values(data)[index]["office"],
          book : ''
				});


				});


			});

	}



GetStatus(user: string)
	{

	//console.log(user);

	  let params = new HttpParams()
			.set('type','status')
		    .set('user',user);

		this.http.get('https://rieltorov.net/tmp/office_api.php', {params}).subscribe(  data => {

	
			(Object.keys(data)).forEach((key, index) => {

				//console.log(Object.values(data));
				this.status=Object.values(data)[0];
				this.useroffice = Object.values(data)[1];

				console.log(this.useroffice);

				});


			});

	}




 checkDate(date: string) {

//console.log(this.tables);

       this.tables = this.tables.map(item => {
  
    return  { ...item, book: '' };
  });




      let datec = date;

  
      let items = this.books.filter(item => item.date.indexOf(datec) !== -1);




 this.tables = this.tables.map(item => {
    const newItem = items.find(newItem => newItem.name === item.name);
    return newItem ? { ...item, book: '1' } : item;
  });



console.log(this.tables);
 

  }



getBooks(): void {



   let params = new HttpParams()
			.set('type','getbooks');

		this.http.get('https://rieltorov.net/tmp/office_api.php', {params}).subscribe(  data => {


			//console.log(Object.values(data));


// получаем забронированые места для конкретного пользователя

			var newItem = Object.values(data).filter(newItem => newItem.user === this.user);

		newItem.forEach((key, index) => {

			this.isbooked.push(newItem[index].name);
				 
			});

// получаем забронированые места для конкретного пользователя конец

			//console.log(this.isbooked);


			(Object.keys(data)).forEach((key, index) => {


				this.books.push({
					id: Object.values(data)[index]["id"],
					name: Object.values(data)[index]["name"],
          date: Object.values(data)[index]["date"],
						 user: Object.values(data)[index]["user"],
					});

	});


			});


  

  }




ngOnInit(): void {



  }


  }





