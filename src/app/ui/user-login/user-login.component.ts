// user-login.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/service/auth.service';
import { UserService } from 'src/app/service/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css'],
})
export class UserLoginComponent implements OnInit {
  constructor(private router: Router, private authService: AuthService,private userService: UserService) {}

  // Variables to manage login and signup data
  isLoggedIn: boolean = false;
  loginObj: any = {
    userName: '',
    password: '',
  };
  signupUsers: any[] = [];
  signupObj: any = {
    userName: '',
    email: '',
    password: '',
  };

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
      timer: 5000, // Set the timer to 5 seconds
      showConfirmButton: false, // Disable the "OK" button
    });

    // Redirect to the login page after 5 seconds
    setTimeout(() => {
      this.router.navigate(['/login']); // Replace '/login' with the actual path of your login page
    }, 5000);
  }

  // Handle user login
  onLogin() {
    // Check if the entered username and password match any existing user
    const isUserExist = this.signupUsers.find(
      (user) =>
        user.userName == this.loginObj.userName &&
        user.password == this.loginObj.password
    );

    if (isUserExist !== undefined) {
      console.log('Login successful');
      this.authService.login();
     this.userService.username= this.loginObj.userName;
      this.router.navigate(['/products']);
      this.isLoggedIn = true;
    } else {
      // Display error message with SweetAlert for incorrect credentials
      Swal.fire({
        title: 'Wrong Credentials!',
        text: 'Please go to the Login page...',
        icon: 'error',
        showConfirmButton: false,
        timer: 5000, // 5 seconds
      });
    }
  }
}
