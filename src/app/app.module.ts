import { NgModule, isDevMode } from '@angular/core';
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
import { DragDropModule } from '@angular/cdk/drag-drop';
import { LoadingSpinnerComponent } from './shared/loading-spinner/loading-spinner.component';
import { ServiceWorkerModule } from '@angular/service-worker';






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
     LoadingSpinnerComponent,
 

  
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPayPalModule,
    DragDropModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    })

  ],
  providers: [AuthGuard,UserService,CartService],
  bootstrap: [AppComponent]
})
export class AppModule {  


  }
