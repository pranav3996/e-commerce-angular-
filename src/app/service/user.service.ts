// user.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // Private variable to store the username
  private _username: string = '';

  // Getter method to retrieve the username
  get username(): string {
    return this._username;
  }

  // Setter method to set the username
  set username(username: string) {
    this._username = username;
  }
}
