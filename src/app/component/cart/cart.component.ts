import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css'],
})
export class CartComponent implements OnInit {
  public products: any = [];
  public productss: any[] = [];
  public grandTotal!: number;

  constructor(private cartService: CartService, private router: Router) {}

  ngOnInit(): void {
    // Fetch products from the CartService and update the component's state
    this.cartService.getProducts().subscribe((res) => {
      this.products = res;
      this.grandTotal = this.getTotalPrice();
    });

    // Fetch products directly from the CartService (assuming getProduct() returns the entire cart)
    this.productss = this.cartService.getProduct();

  }

  // Remove a specific item from the cart
  removeItem(item: any) {
    this.cartService.removeCartItem(item);
    this.productss = this.cartService.getProduct();
  }

  // Remove all items from the cart
  emptycart() {
    this.cartService.removeAllCart();
  }

  // Update the quantity of an item in the cart
  updateQuantity(item: any, newQuantity: number) {
    this.cartService.updateQuantity(item, newQuantity);
    item.quantity = Math.max(1, newQuantity);

    // Update the total cost of items in the cart
    this.getTotalPrice();
    console.log('After update, new total cost:', this.getTotalPrice());
  }

  // Get the total cost of items in the cart
  getTotalPrice(): number {
    return this.cartService.getTotalPrice();
  }
}
