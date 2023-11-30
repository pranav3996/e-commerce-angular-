// user-sign-up.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from 'src/app/service/auth.service';

@Component({
  selector: 'app-user-sign-up',
  templateUrl: './user-sign-up.component.html',
  styleUrls: ['./user-sign-up.component.css']
})
export class UserSignUpComponent {
  // Array to store signed-up users
  signupUsers: any[] = [];

  // Object to store user signup information
  signupObj: any = {
    userName: '',
    email: '',
    password: '',
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Retrieve signup users from local storage on component initialization
    const localData = localStorage.getItem('signUpUsers');
    if (localData != null) {
      this.signupUsers = JSON.parse(localData);
    }
  }

  // Handle user signup
  onSignUp() {
    // Add new user to the signupUsers array
    this.signupUsers.push(this.signupObj);

    // Save updated signupUsers array to local storage
    localStorage.setItem('signUpUsers', JSON.stringify(this.signupUsers));

    // Reset the signupObj
    this.signupObj = {
      userName: '',
      email: '',
      password: '',
    };
  
    // Display success message with SweetAlert
    Swal.fire({
      title: 'Success!',
      text: 'You have successfully signed up.',
      icon: 'success',
      timer: 2000, // Set the timer to 2 seconds
      showConfirmButton: false, // Disable the "OK" button
    });

    // Redirect to the login page after 2 seconds
    setTimeout(() => {
      this.router.navigate(['/login']); // Replace '/login' with the actual path of your login page
    }, 2000);
  }
}
