// app-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CartComponent } from './component/cart/cart.component';
import { ProductsComponent } from './component/products/products.component';
import { CheckoutComponent } from './component/checkout/checkout.component';
import { UserLoginComponent } from './ui/user-login/user-login.component';
import { AuthGuard } from './guard/auth.guard';
import { ShippingAddressComponent } from './component/shipping-address/shipping-address.component';
import { UserSignUpComponent } from './ui/user-sign-up/user-sign-up.component';

// Define application routes
const routes: Routes = [
  // Redirect to login page by default
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: UserLoginComponent },
  { path: 'signup', component: UserSignUpComponent },
  { 
    path: 'products', 
    component: ProductsComponent, 
    canActivate: [AuthGuard], // Protect the route with AuthGuard
    
    // Optional: Add children routes if needed
    // children: [
    //   { path: 'cart', component: CartComponent },
    //   { path: 'checkout', component: CheckoutComponent }
    // ]
  },
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
  { path: 'checkout', component: CheckoutComponent, canActivate: [AuthGuard] },
  { path: 'view', component: ShippingAddressComponent, canActivate: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
