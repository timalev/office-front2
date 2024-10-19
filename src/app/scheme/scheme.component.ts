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
    selector: "scheme-app",
    templateUrl: './scheme.component.html',
    styleUrls: ['./scheme.component.scss'],
    standalone: true,
    imports: [FormsModule,HttpClientModule,CommonModule,CdkDropList, CdkDrag],
	
})


export class SchemeComponent {

   offices: Array<{id: number; name: string; } > = [];
   tables:   Array<{name: string; visibility: string; mon: number; type: string; position: {x: number, y: number}; office: string} > = [];

	 //disablestatus: boolean = false;
   
   status = '';
   disdrag: boolean = true;


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





  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {



	  //console.log(this.dropDisable());


    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {

		if (user) {
			const uid = user.uid;
			//console.log(user.email);
			
			if (user.email!=null)
			{
				this.GetStatus(user.email);
				
			}
			
			
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

/*
dropDisable(): number {
	return this.tables.filter(item => item.visibility === 'visible').length;
}

*/




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
          office: Object.values(data)[index]["office"]
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
				this.status=Object.values(data)[0];	
				
				console.log(this.status);
				
				});
				

			});

	}


book()
	{
	alert("В разработке..");
	}





  }




