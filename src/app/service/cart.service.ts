// cart.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  // Variable to store cart item data
  public cartItemList: any = [];

  // BehaviorSubject to emit and observe changes in the product list
  public productList = new BehaviorSubject<any>([]);

  // BehaviorSubject to emit and observe changes in the search term
  public search = new BehaviorSubject<string>('');

  // Getter method to retrieve the product list as an observable
  getProducts() {
    return this.productList.asObservable();
  }

  // Setter method to set the product list and notify subscribers
  setProduct(product: any) {
    // Add new products to the cartItemList
    this.cartItemList.push(...product);

    // Emit or notify subscribers with the updated product list
    this.productList.next(product);

    // Save the updated cart to local storage
    this.saveCart();
  }

  // Method to add a product to the cart
  addtoCart(product: any) {
    // Check if the product is already in the cart
    const existingProduct = this.cartItemList.find((item: any) => item.id === product.id);

    // Save the current cart state
    this.saveCart();

    if (existingProduct) {
      // If the product already exists, update its quantity and total
      existingProduct.quantity += 1;
      existingProduct.total = existingProduct.quantity * existingProduct.price;
    } else {
      // If the product is not in the cart, add it as a new item
      const newProduct = { ...product, quantity: 1, total: product.price };
      this.cartItemList.push(newProduct);
    }

    // Emit or notify subscribers with the updated cartItemList
    this.productList.next(this.cartItemList);

    // Update the total price
    this.getTotalPrice();

    console.log('added ', this.cartItemList);
  }

  // Method to update the quantity of a product in the cart
  updateQuantity(item: any, newQuantity: number) {
    item.quantity = newQuantity;

    // Update the total price
    this.getTotalPrice();
  }

  // Method to calculate and return the total price of all items in the cart
  getTotalPrice(): number {
    let grandTotal = 0;

    // Save the current cart state
    this.saveCart();

    // Calculate the grand total
    this.cartItemList.map((a: any) => {
      grandTotal += a.quantity * a.price;
      localStorage.setItem('cart_total', JSON.stringify(grandTotal));
    });

    return grandTotal;
  }

  // Method to remove a product from the cart
  removeCartItem(product: any) {
    this.cartItemList.map((a: any, index: any) => {
      // Check if product id matches with a product in the cart
      if (product.id === a.id) {
        // Remove the product from cartItemList
        const removedItem = this.cartItemList.splice(index, 1);
        this.saveCart();
        console.log('removeCartItem ', removedItem);
      }
    });

    // Emit or notify subscribers with the updated cartItemList
    this.productList.next(this.cartItemList);

    console.log('removeCartItem remaining data ', this.cartItemList);
  }

  // Method to get the current cartItemList
  getProduct() {
    return this.cartItemList;
  }

  // Method to save the current cart state to local storage
  saveCart(): void {
    localStorage.setItem('cart_items', JSON.stringify(this.cartItemList));
  }

  // Method to load the cart from local storage
  loadCart(): void {
    this.cartItemList = JSON.parse(localStorage.getItem('cart_items') as any) || [];
  }

  // Method to check if a product is already in the cart
  productInCart(product: any): boolean {
    return this.cartItemList.findIndex((x: any) => x.id === product.id) > -1;
  }

  // Method to remove all items from the cart
  removeAllCart() {
    // Clear the cartItemList
    this.cartItemList = [];

    // Emit or notify subscribers with the updated cartItemList
    this.productList.next(this.cartItemList);

    // Remove cart data from local storage
    localStorage.removeItem('cart_items');
    localStorage.removeItem('cart_total');
  }
}
