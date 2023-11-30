import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './component/header/header.component';
import { CartComponent } from './component/cart/cart.component';
import { ProductsComponent } from './component/products/products.component';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FilterPipe } from './shared/filter.pipe';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { UserLoginComponent } from './ui/user-login/user-login.component';
import { AuthGuard } from './guard/auth.guard';
import { UserService } from './service/user.service';
import { CartService } from './service/cart.service';
import { ShippingAddressComponent } from './component/shipping-address/shipping-address.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { UserSignUpComponent } from './ui/user-sign-up/user-sign-up.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    CartComponent,
    ProductsComponent,
    FilterPipe,
    CheckoutComponent,
    UserLoginComponent,
    ShippingAddressComponent,

    UserSignUpComponent,
  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPayPalModule

  ],
  providers: [AuthGuard,UserService,CartService],
  bootstrap: [AppComponent]
})
export class AppModule {  


  }
