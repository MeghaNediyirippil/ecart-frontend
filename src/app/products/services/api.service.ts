import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  cartItemCount=new BehaviorSubject(0) //to hold cart item count

  constructor(private http:HttpClient) {
    this.cartCount()
  }
   
  BASE_URL='https://ecart-ogy9.onrender.com'
  // api function to get all products from the database
  getAllProducts(){
    return this.http.get(`${this.BASE_URL}/products/all-products`)
      
  }

  //  api function to view particular products detail from the database
  viewProduct(id:any){
    return this.http.get(`${this.BASE_URL}/products/view-Product/${id}`)
  }






  // add to Cart
  addToCart(product:any){    //product is an object with property

    const body={
      id:product.id,
      title:product.title,
      price:product.price,
      image:product.image,
      quantity:product.quantity

    }
    return this.http.post(`${this.BASE_URL}/carts/add-to-cart`,body)
  }


  // get cart
  getCart(){
    return this.http.get(`${this.BASE_URL}/carts/get-cart`)
  }

  // to get cart product count
  cartCount(){
    this.getCart().subscribe((result:any)=>{
      this.cartItemCount.next(result.length)
    })
  }


  // delete cart product
  deleteProduct(id:any){
    return this.http.delete(`${this.BASE_URL}/carts/delete-product/${id}`)
  }

  // increment cart product
  incrementProduct(id:any){
    return this.http.get(`${this.BASE_URL}/carts/increment-product/${id}`)
  }

  
  // decrement cart product
  decrementProduct(id:any){
    return this.http.get(`${this.BASE_URL}/carts/decrement-product/${id}`)
  }

}
