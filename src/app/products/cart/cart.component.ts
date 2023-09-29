import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api.service';
import { FormBuilder } from '@angular/forms';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit{

  allCart:any=[] //To Hold cart products

  cartTotalPrice=0

name:string='';
houseNumber:string='';
streetName:string=''
state:string=''
pincode:string=''
mobileNumber:string=''


// used to hide address form
proceedToPaymentStatus:boolean=false

// offer clickd
offerClick:boolean=false

// used to hide discount coupon
discountStatus:boolean=false

// paypal variable
public payPalConfig?: IPayPalConfig;

//variable in paypal function
showSuccess:boolean=false

// only show after click proceed to payment button
showpaypalButton:boolean=false

  constructor(private api:ApiService,private cartfb:FormBuilder){}
  ngOnInit(): void {
    this.api.getCart().subscribe((result:any)=>{
      console.log(result); //array of product
      this.allCart=result;
      this.getCartTotal()

      // paypal function
      this.initConfig();
      
    },
    (result:any)=>{
      console.log(result.error);
      

    })
  }

deleteCartProduct(id:any){
  this.api.deleteProduct(id).subscribe((result:any)=>{
    // result ?  -  Remaining products
    this.allCart=result
    this.api.cartCount()
    this.getCartTotal()
  },
  (result:any)=>{
    alert(result.error)
  }
  )

}

// get cart total
getCartTotal(){
  let total=0
  this.allCart.forEach((item:any) => {
     total+=item.grandTotal
     this.cartTotalPrice=Math.ceil(total)
    
  });
}

// increment product quantity
incrementCartProduct(id:any){
  this.api.incrementProduct(id).subscribe((result:any)=>{
    this.allCart=result
    this.getCartTotal()

  },(result:any)=>{
    alert(result.error)
  }
  )
}


// decrement product quantity
decrementCartProduct(id:any){
  this.api.decrementProduct(id).subscribe((result:any)=>{
    this.allCart=result
    this.getCartTotal()
    this.api.cartCount()

  },(result:any)=>{
    alert(result.error)
  }
  )
}

// address form
addressForm=this.cartfb.group({
  name:[''],
  houseNumber:[''],
  streetName:[''],
  state:[''],
  pinNumber:[''],
  MobilNumber:[''],
})

submitForm(){
  if(this.addressForm.valid){
    this.proceedToPaymentStatus=true

    this.name=this.addressForm.value.name||''
    this.houseNumber=this.addressForm.value.houseNumber||''
    this.streetName=this.addressForm.value.streetName||''
    this.state=this.addressForm.value.state||''
    this.pincode=this.addressForm.value.pinNumber||''
    this.mobileNumber=this.addressForm.value.MobilNumber||''

  }
  else{
    alert('Please Enter a valid details')

  }
}

// offers
offerClicked(){
  // alert("offers")
  this.offerClick=true
}

// discount
discountCalculated(value:any){
  this.discountStatus=true
  this.cartTotalPrice=this.cartTotalPrice*(100-value)/100
}

// paypal function definition
private initConfig(): void {
  this.payPalConfig = {
  currency: 'EUR',
  clientId: 'sb',
  createOrderOnClient: (data) => <ICreateOrderRequest>{
    intent: 'CAPTURE',
    purchase_units: [
      {
        amount: {
          currency_code: 'EUR',
          value: '9.99',
          breakdown: {
            item_total: {
              currency_code: 'EUR',
              value: '9.99'
            }
          }
        },
        items: [
          {
            name: 'Enterprise Subscription',
            quantity: '1',
            category: 'DIGITAL_GOODS',
            unit_amount: {
              currency_code: 'EUR',
              value: '9.99',
            },
          }
        ]
      }
    ]
  },
  advanced: {
    commit: 'true'
  },
  style: {
    label: 'paypal',
    layout: 'vertical'
  },
  onApprove: (data, actions) => {
    console.log('onApprove - transaction was approved, but not authorized', data, actions);
    actions.order.get().then((details:any) => {
      console.log('onApprove - you can get full order details inside onApprove: ', details);
    });
  },
  onClientAuthorization: (data) => {
    console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
    this.showSuccess = true;
  },
  onCancel: (data, actions) => {
    console.log('OnCancel', data, actions);
  },
  onError: err => {
    console.log('OnError', err);
  },
  onClick: (data, actions) => {
    console.log('onClick', data, actions);
  },
};
}


//only show after after proceed to pay
MakePay(){
  this.showpaypalButton=true
}

}
