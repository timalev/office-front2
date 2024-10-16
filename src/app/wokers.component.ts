import { Component} from "@angular/core";

import { HttpClient, HttpHeaders, HttpClientModule, HttpParams} from "@angular/common/http";
import { CommonModule } from '@angular/common';

import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, update } from "firebase/database";
import { getStorage, ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";

@Component({
    selector: "workers-app",
    templateUrl: './workers.component.html',
    styleUrls: ['./workers.component.scss'],
    standalone: true,
    imports: [FormsModule,HttpClientModule,CommonModule],
})
export class WokersComponent {


  isreg = 0;

   offices: Array<{id: number; name: string; } > = [];
	 groups: Array<{id: number; name: string; } > = [];
	 users: Array<{id: number; name: string; group: string; } > = [];




  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {





    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {

		if (user) {
			const uid = user.uid;
			console.log(user.email);
			this.isreg = 1;

      this.officeslist();
			this.groupslist();
      this.userslist();

		}
        else
        {
          console.log('not reged');
          // this.html_form = 1;
        }
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



}
