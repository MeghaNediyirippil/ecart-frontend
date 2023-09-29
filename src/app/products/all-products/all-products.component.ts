import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-all-products',
  templateUrl: './all-products.component.html',
  styleUrls: ['./all-products.component.css']
})
export class AllProductsComponent implements OnInit{


  constructor(private api:ApiService){}
  allProducts:any=[]
  ngOnInit(): void {
    this.api.getAllProducts().subscribe((result:any)=>{
      console.log(result); //array 20
      this.allProducts=result;
      
    })
  }



}
