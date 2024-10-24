import { Component, inject, model, signal, importProvidersFrom} from "@angular/core";

import { HttpClient, HttpHeaders, HttpClientModule, HttpParams} from "@angular/common/http";
import { CommonModule } from '@angular/common';



import {FormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { getAuth,createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, set, update } from "firebase/database";
import { getStorage, ref as ref_storage, uploadBytesResumable, getDownloadURL } from "firebase/storage";

import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';



export interface DialogData {
  chgroup: string;
  choffice: string;
  name: string;
  type2: string;
  arrayOffices: any;
  arrayGroups: any;
}

@Component({

    selector: "workers-app",
    templateUrl: './workers.component.html',
    styleUrls: ['./workers.component.scss'],
    standalone: true,
    imports: [FormsModule,HttpClientModule,CommonModule, MatFormFieldModule, MatInputModule,MatSelectModule, FormsModule, MatButtonModule],
})


export class WokersComponent {



 choffice = signal('');
 chgroup = signal('');
  name = model('');
  type2 = '';
  dialog = inject(MatDialog);
  myArray = signal([{id: 1, name: 'Офис 1'}, {id:2, name: 'Офис 2'}]);
  myArrayGr = signal([{id: 1, name: 'Группа 1'}, {id:2, name: 'Группа 2'}, {id:3, name: 'Группа 3'}]);


  openDialog(type: string): void {

	 this.type2=type;

    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {name: this.name(), choffice: this.choffice(), chgroup: this.chgroup(),arrayOffices: this.myArray(),arrayGroups: this.myArrayGr(),type2: this.type2}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      if (result !== undefined) {

		  switch (this.type2)
		  {
		  case "group":
			  this.chgroup.set("ok gr, " + result);
		  break;

		  default:
			   this.choffice.set("ok of, " + result);


		  }


      }
    });
  }


  isreg = 0;
  status = '';

   offices: Array<{id: number; name: string; } > = [];
	 groups: Array<{id: number; name: string; } > = [];
	 users: Array<{id: number; name: string; group: string; } > = [];

officeForm:
  any = {
    oname: '',
  }

groupForm:
  any = {
    grname: '',
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


@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
	MatSelectModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly choffice = model(this.data.choffice);
  readonly chgroup = model(this.data.chgroup);
  readonly type2 = this.data.type2;
  readonly arrayOffices =  this.data.arrayOffices;
  readonly arrayGroups =  this.data.arrayGroups;



  onNoClick(): void {
    this.dialogRef.close();
  }
}

