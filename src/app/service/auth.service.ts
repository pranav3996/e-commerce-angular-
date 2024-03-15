import { Injectable } from '@angular/core';
import { UserService } from './user.service';
import { User } from '../ui/user.model';
import { BehaviorSubject, catchError, tap, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

export interface AuthResponseData {
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  isLoggedIn = false;
  errorMessage: string = '';
  userSub = new BehaviorSubject<User | null>(null);
  clearTimeout: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private userService: UserService
  ) {}
  signUp(email: string, password: string) {
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyCMBjtCu8e-nc9WXO-w6WfGFwZkC3_o3AU',
        { email, password, returnSecureToken: true }
      )
      .pipe(catchError(this.getErrorHandler), tap(this.handleUser.bind(this)));
  }

  login(email: string, password: string) {
    // this.isLoggedIn = true;
    return this.http
      .post<AuthResponseData>(
        'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyCMBjtCu8e-nc9WXO-w6WfGFwZkC3_o3AU',
        { email, password, returnSecureToken: true }
      )
      .pipe(catchError(this.getErrorHandler), tap(this.handleUser.bind(this)));
  }

  handleUser = (response: AuthResponseData) => {
    const expireDate = new Date(
      new Date().getTime() + +response.expiresIn * 1000
    );
    const user = new User(
      response.email,
      response.localId,
      response.idToken,
      expireDate
    );
    console.log('handler user' + user);

    this.userSub.next(user);
    localStorage.setItem('userData', JSON.stringify(user));

    // user can logout after 1hr (3600s)
    this.autoLogout(+response.expiresIn * 1000);
  };
  getErrorHandler = (errorRes: HttpErrorResponse) => {
    this.errorMessage = 'Error Occurred ';
    if (!errorRes.error || !errorRes.error.error) {
      return throwError(this.errorMessage);
    }
    const errorMessageFromServer = errorRes.error.error.message;
    console.error('Error from server:', errorMessageFromServer);
    switch (errorRes.error.error.message) {
      case 'EMAIL_EXISTS':
        this.errorMessage = 'Email Already EXISTS ';
        break;

      case 'INVALID_LOGIN_CREDENTIALS':
        this.errorMessage = 'INVALID LOGIN CREDENTIALS ';
        break;
      // case 'EMAIL_NOT_FOUND':
      //   this.errorMessage = 'Email NOT FOUND ';
      //   break;

      // case 'invalid-password':
      //   this.errorMessage = 'Invalid password';
      //   break;

      default:
        this.errorMessage = 'An unknown error occurred';
    }

    return throwError(this.errorMessage);
  };

  autoLogin() {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      let userData: {
        email: string;
        localId: string;
        _token: string;
        expirationDate: string;
      } = JSON.parse(storedUserData);
      if (!userData) {
        return;
      }
      let user = new User(
        userData.email,
        userData.localId,
        userData._token,
        new Date(userData.expirationDate)
      );
      if (user.token) {
        this.userSub.next(user);
      }

      // user refresh after half n hour than set like this
      //present date and getTime give number if milli seconds
      let date = new Date().getTime();

      let expirationDate = new Date(userData.expirationDate).getTime();
      this.autoLogout(expirationDate - date);
    } else {
      // Handle the case where 'userData' is not present in localStorage
      console.error('User data not found in localStorage');
    }
  }
  autoLogout(expirationDate: number) {
    console.log('expirationDate' + expirationDate);

    this.clearTimeout = setTimeout(() => {
      this.logout();
    }, expirationDate);
  }
  logout() {
    // this.isLoggedIn = false;
    this.userSub.next(null);
    this.router.navigate(['']);
    localStorage.removeItem('userData');
    if (this.clearTimeout) {
      clearTimeout(this.clearTimeout);
    }
  }
  isAuthenticated(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.isLoggedIn);
      }, 1000);
    });
  }

  getUsername(username: string): void {
    // Upon successful login, set the username
    this.userService.username = username;
  }
}
