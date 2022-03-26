import { Component, ViewChild } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from './dialog/dialog.component';
import { ApiService } from './services/api.service';

// for table
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  displayedColumns: string[] = ['productName', 'category','date','freshness','price', 'comment'];
  dataSource!: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private dialog: MatDialog, private api: ApiService){}
  
  showDialog(){
    const param = { width:"30%" }
    this.dialog.open(DialogComponent, param)
      .afterClosed().subscribe(val => {
        if (val === 'save') this.getAllProduct()
      })
  }

  ngOnInit(): void{
    this.getAllProduct()
  }

  getAllProduct(){
    this.api.getProduct()
      .subscribe({
        next:(res)=>{
          this.dataSource = new MatTableDataSource(res)
          this.dataSource.paginator = this.paginator
          this.dataSource.sort = this.sort
        },
        error:(err)=>{
          console.log(err)
        }
      })
  }

  editProduct(row: any){
    const params = {
      width: '30%',
      data: row
    }
    this.dialog.open(DialogComponent, params)
      .afterClosed().subscribe(val => {
        if (val === 'update') this.getAllProduct()
      })
  }

  deleteProduct(id:number){
    this.api.deleteProduct(id)
      .subscribe({
        next:(res)=>{
          alert('delete successfully')
          this.getAllProduct()
        },
        error:()=>{
          alert('something error')
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
