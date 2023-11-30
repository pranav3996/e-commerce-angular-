import { Injectable } from '@angular/core';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private Authenticated = false;

  constructor(private userService: UserService) {}

  isAuthenticated(): boolean {
    return this.Authenticated;
  }

  login() {
    this.Authenticated = true;
    return this.Authenticated;
  }

  logout() {
    this.Authenticated = false;
  }

  getUsername(username: string): void {
    // Upon successful login, set the username
    this.userService.username = username;
  }
}
