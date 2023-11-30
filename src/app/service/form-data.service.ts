// form-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FormDataService {
 
  private userData = new BehaviorSubject<any>({});

  getUserData() {
    return this.userData.asObservable();
  }

  setUserData(data: any) {
    this.userData.next(data);
  }
}
