import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AMAZON, Product } from './model/Product';

export interface Monitor {
  id: number;
  ecom: string;
  modelID: string;
  price: number;
  threshold: number;
  emailID: string;
  name: string;
  url: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Price-Aggregator-UI';
  keyword = '';
  spin = false;
  productList: Array<Product>;
  name: string | undefined;
  email: string | undefined;
  monitor: Monitor | undefined;

  timeLeft: number = 0;
  interval: any;

startTimer() {
  this.timeLeft =0;
    this.interval = setInterval(() => {
        this.timeLeft++;
    },1000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
  constructor(private http: HttpClient, public dialog: MatDialog, private _snackBar: MatSnackBar) {
    this.productList = [];
    
  }
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000
    });
  }

  ngOnInit() {
    // Simple GET request with response type <any>
    this.http.get<Array<Product>>('http://localhost:8080/api/product').subscribe(data => {
      this.productList = data;
      // console.log(JSON.stringify(this.productList));
      console.log(this.productList);

    })
  }

  search(keyword: string) {
    this.startTimer();
    console.log(this.keyword);
    this.spin = true;
    this.http.get<Array<Product>>('http://localhost:8080/api/scraper/comparePrice/' + keyword).subscribe(data => {
      this.productList = data;
      this.spin = false;
      console.log(this.productList);
      this.pauseTimer();
    },
    error  =>{
      this.spin = false;
      this.pauseTimer();
      this.openSnackBar("ERROR", "Try Again");
      console.log(error);
      
    }
    )
  }

  goToLink(url: string) {
    window.open("https://" + url);
  }
  openDialog(product:Product,meta:AMAZON,brand:string ): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {name: product.name, emailID: this.email, ecom:brand, modelID:product.modelID,price:meta.price,url:meta.url},
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.monitor = result;
      console.log(this.monitor);
      this.http.post<string>('http://localhost:8080/api/monitor', this.monitor).subscribe(data => {
        console.log(data);    
    })
      
    });
  }
}
@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  styleUrls: ['./app.component.css']
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: Monitor,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
