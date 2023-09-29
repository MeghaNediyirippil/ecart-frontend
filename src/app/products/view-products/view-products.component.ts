import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-view-products',
  templateUrl: './view-products.component.html',
  styleUrls: ['./view-products.component.css']
})
export class ViewProductsComponent implements OnInit{

  productId:string=''
  product:any={}
  constructor(private viewActivatedRoute:ActivatedRoute,private api:ApiService){}
  ngOnInit(): void {
    this.viewActivatedRoute.params.subscribe((data:any)=>{
      console.log(data);   //{{id:1}}
      console.log(data.id);   //1
      this.productId=data.id

      // call viewProduct api
      this.api.viewProduct(this.productId).subscribe((result:any)=>{
         console.log(result);  //product details
        this.product=result
      },
      (result:any)=>{
        alert(result.error)
      }
      )
      
    })
  }


  // add to cart
  addToCart(product:any){

    // add quantity to product object
    Object.assign(product,{quantity:1})
    console.log(product);

    // api call to add quantity to cart
    this.api.addToCart(product).subscribe((result:any)=>{
      alert(result)
      this.api.cartCount()
    },
    (result:any)=>{
      alert(result.error)
    }
    )

  }
}
