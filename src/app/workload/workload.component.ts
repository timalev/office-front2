import { Component } from '@angular/core';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { HttpClient, HttpHeaders, HttpClientModule, HttpParams} from "@angular/common/http";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { CommonModule } from '@angular/common';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-workload',
  standalone: true,
  imports: [HttpClientModule,FormsModule,CommonModule],
  templateUrl: './workload.component.html',
  styleUrl: './workload.component.css'
})
export class WorkloadComponent {

	private baseUrl = environment.baseUrl;


	 tables:   Array<{name: string; visibility: string; mon: number; type: string; position: {x: number, y: number}; office: string, book: string;} > = [];

        books: Array<{id: number; name: string; date: string; user: string;} > = [];

		offices: Array<{id: number; name: string;   } > = [];

// форма выбора даты загруженности

	  bookingForm:
	  any = {
	  date: '',
	  datetime: '',
	}


// форма выбора офиса загруженности

	  officeForm:
  any = {
    office: '',
  }


  isreg = 0;

  office = "";

  loadreport = "";


	  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient ) {


	  //console.log(this.dropDisable());




    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {

		if (user) {
			const uid = user.uid;
			//console.log(user.email);

			if (user.email!=null)
			{
				//this.user = user.email;
			//	this.GetStatus(user.email);

				

			}


			this.isreg = 1;

// получаем данные с бэка

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




getOffice(event: any)
	{
	this.tableslist();

	this.office = event.officeForm.office;
	}


	checkDate(date: string) {

//console.log(this.tables);




       this.tables = this.tables.map(item => {
  
    return  { ...item, book: '' };
  });




      let datec = date;

	  

  
      let items = this.books.filter(item => item.date.indexOf(datec) !== -1);


// фильтруем по офису



this.tables = this.tables.filter(obj => obj.office == this.office);



  console.log(this.tables);


 this.tables = this.tables.map(item => {
    const newItem = items.find(newItem => newItem.name === item.name );
    return newItem ? { ...item, book: '1' } : item;
  });



let booked_count = this.tables.filter(item => item.book === "1").length;




//console.log(this.tables);

this.loadreport = "Результат: Загруженность офиса на " + datec + " составляет " + Math.round((booked_count * 100) / this.tables.length) + "%";

console.log(this.loadreport);
 
 console.log( this.tables.length + " / " + booked_count);

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


				console.log(this.offices);
			});
}




  tableslist()
	{
		let params = new HttpParams()
			.set('type','tables');

		this.http.get('https://rieltorov.net/tmp/office_api.php', {params}).subscribe(  data => {
		


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



	getBooks(): void {



   let params = new HttpParams()
			.set('type','getbooks');

		this.http.get('https://rieltorov.net/tmp/office_api.php', {params}).subscribe(  data => {


			//console.log(Object.values(data));


// получаем забронированые места для конкретного пользователя

/*
			var newItem = Object.values(data).filter(newItem => newItem.user === this.user);

		newItem.forEach((key, index) => {

			this.isbooked.push(newItem[index].name);
				 
			});

			*/

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








}






