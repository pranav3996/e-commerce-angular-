import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/api.service';
import { CartService } from 'src/app/service/cart.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.css'],
})
export class ProductsComponent implements OnInit {
  // Variable to store the list of products fetched from the API
  public productList: any;

  // Variable to store the filtered list of products based on category
  public filterCategory: any;

  // Variable to store the search key for filtering products
  searchKey: string = '';

  // Array to store products in the cart
  products: any[] = [];

  constructor(private api: ApiService, private cartService: CartService) {}

  ngOnInit(): void {
    // Fetch products from the ApiService
    this.api.getProduct().subscribe((res) => {
      // Assign fetched data to productList and filterCategory
      this.productList = res;
      this.filterCategory = res;

      // Modify each product in the productList to include quantity and total properties
      this.productList.forEach((a: any) => {
        if (
          a.category === "women's clothing" ||
          a.category === "men's clothing"
        ) {
          a.category = 'fashion';
        }
        Object.assign(a, { quantity: 1, total: a.price });
      });
      console.log(this.productList);
    });

    // Subscribe to the search observable in CartService to get the search key
    this.cartService.search.subscribe((val: any) => {
      this.searchKey = val;
    });

    // Load the cart from local storage
    this.cartService.loadCart();
  }

  // Method to add a product to the cart
  addtocart(item: any) {
    // Check if the product is not already in the cart
    if (!this.cartService.productInCart(item)) {
      // Set default quantity to 1 and add the product to the cart
      item.quantity = 1;
      this.cartService.addtoCart(item);

      // Update the products array with the latest cart contents
      this.products = [...this.cartService.getProduct()];
    }
  }

  // Method to filter products based on category
  filter(category: string) {
    this.filterCategory = this.productList.filter((a: any) => {
      if (a.category == category || category == '') {
        return a;
      }
    });
  }
}
