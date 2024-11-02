import { Component, inject, model, signal, importProvidersFrom} from "@angular/core";

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


	selectedUser = 0;
	selectedGroup = 0;







  isreg = 0;
  status = '';

   offices: Array<{id: number; name: string;   } > = [];
	 groups: Array<{id: number; name: string; office: string;} > = [];
	 users: Array<{id: number; name: string; group: string; groupname: string; } > = [];

officeForm:
  any = {
    oname: '',
  }

groupForm:
  any = {
    grname: '',
  }
adduserForm:
	any = {
	grid: 0,
}
addgroupForm:
	any = {
	grof: 0,
}
	

  constructor(private route: ActivatedRoute, private router: Router, private http: HttpClient) {



    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {

		if (user) {
			const uid = user.uid;

			console.log(user.email);

			//if (user.email!=null)


			//console.log(myapp.GetStatus(user.email));

			if (user.email!=null)
			{
				this.GetStatus(user.email);

			}


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
					name: Object.values(data)[index]["name"],
						  office: Object.values(data)[index]["office"]
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
					group: Object.values(data)[index]["group"],
					groupname: Object.values(data)[index]["group_name"]
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


attGroup()
	{

	console.log(this.addgroupForm.ofid + " / " + this.selectedGroup);




	if (this.addgroupForm.ofid!="")
	 {
		   var addgroup_json = JSON.stringify({office: this.addgroupForm.ofid, add_group: this.selectedGroup});

		   this.http.post("https://rieltorov.net/tmp/office_api.php", addgroup_json).subscribe(  data => {

			   if (data!=null)
			   {

			   (Object.keys(data)).forEach((key, index) => {

				  if (Object.values(data)[0]=='ok')
				{
					alert("Группа прикреплена");
				};

				});

		   }

			}, error => {console.log(error)});
	 }





	}








addUser()
{

	console.log(this.adduserForm.grid + " / " + this.selectedUser);
	
	 if (this.adduserForm.grid!="")
	 {
		   var adduser_json = JSON.stringify({group: this.adduserForm.grid, add_user: this.selectedUser});

		   this.http.post("https://rieltorov.net/tmp/office_api.php", adduser_json).subscribe(  data => {

			   if (data!=null)
			   {

			   (Object.keys(data)).forEach((key, index) => {

				  if (Object.values(data)[0]=='ok')
				{
					alert("Пользователь прикреплен");
				};

				});

		   }

			}, error => {console.log(error)});
	 }
}




	addoffice()
	{
		if (this.officeForm.oname!="")
		{

		  var off_json = JSON.stringify({office_name: this.officeForm.oname});


	//const body = {json: tables_json};
	this.http.post("https://rieltorov.net/tmp/office_api.php", off_json).subscribe(  data => {

			(Object.keys(data)).forEach((key, index) => {


				if (Object.values(data)[0]=='ok')
				{
					alert("Офис создан успешно");
				};

				});


	});
		}
	else
			{
		alert("Введите название офиса");
			}
	}

	addgroup()
	{
		if (this.groupForm.grname!="")
		{

		  var grp_json = JSON.stringify({group_name: this.groupForm.grname});


	this.http.post("https://rieltorov.net/tmp/office_api.php", grp_json).subscribe(  data => {

			(Object.keys(data)).forEach((key, index) => {


			//console.log(Object.values(data)[0]);


				if (Object.values(data)[0]!='')
				{


					this.groups.push({
					id: Object.values(data)[0],
					name: this.groupForm.grname,
				    office: ''
					});


					alert("Группа успешно создана");
				};

				});


	});
		}
	else
			{
		alert("Введите название группы");
			}
	}

	delGroup(id: number)
	{
		let params = new HttpParams()
			.set('type','delgroup')
			.set('id',id);

		this.http.get('https://rieltorov.net/tmp/office_api.php', {params}).subscribe(  data => {


				(Object.keys(data)).forEach((key, index) => {


				if (Object.values(data)[0]=='ok')
				{
					this.groups = this.groups.filter(group => group.id !== id);

					alert("Группа удалена");
				};

				});


			});
			return false;
	}





}
