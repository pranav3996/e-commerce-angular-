import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/service/auth.service';
import { CartService } from 'src/app/service/cart.service';
import { UserService } from 'src/app/service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  // Variable to store the total number of items in the cart
  public totalItem: number = 0;

  // Variable to store the search term entered by the user
  public searchTerm!: string;

  // Variable to store the username
  public userName!: string;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private userService: UserService,
  ) {}
  isAuthenticated=false
  ngOnInit(): void {
    this.authService.userSub.subscribe(user =>{
      this.isAuthenticated=user ? true:false;
   
      console.log("This is user " +user)
      // Load the cart from local storage
    this.cartService.loadCart();
    // console.log("This is loadCart " + this.cartService.loadCart());
    })
    // Subscribe to the cartService to get the total number of items in the cart
    this.cartService.getProducts().subscribe((res) => {
      this.totalItem = res.length;
    });

    // Get the username from the userService
    this.userName = this.userService.username;
    // console.log('Username is ',this.userName)
  }

  // Method to handle search input
  search(event: any) {
    // Get the search term from the input field
    this.searchTerm = (event.target as HTMLInputElement).value;

    // Log the search term (optional)
    console.log(this.searchTerm);

    // Notify the cartService about the search term
    this.cartService.search.next(this.searchTerm);
  }

  // Method to show a confirmation dialog before signing out
  confirmSignOut(event:Event) {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ffb74d',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, sign me out!',
    }).then((result) => {
      if (result.isConfirmed) {
        // User confirmed, perform sign-out
        event.preventDefault();
        this.authService.logout();
      }
    });
  }

  // Method to handle user sign-out
  // signOut() {
  //   // Log the sign-out action (optional)
  //   console.log('Signing out...');

  //   // Navigate to the login page after signing out
  //   this.router.navigate(['login']);
  // }
 
}
