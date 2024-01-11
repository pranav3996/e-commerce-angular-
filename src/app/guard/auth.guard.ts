// auth.guard.ts
import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable, map, take } from 'rxjs';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // Inject the AuthService and Router in the constructor
  constructor(private authService: AuthService, private router: Router) {}

  // Implement the canActivate method required by the CanActivate interface
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Check if the route is not the login route and the user is not authenticated
  //   if (state.url !== 'login' && !this.authService.isAuthenticated()) {
  //     // Redirect to the login page
  //     this.router.navigate(['/login']);
  //     return false; // Prevent access to the protected route
  //   }
  //   // Allow access to the protected route if the user is authenticated
  //   return true;
  // }
     // with url tree
     return this.authService.userSub.pipe(take(1),
     map((user) => {
       if (!user) {
         return this.router.createUrlTree(['']);
       }
       return true;
     })
   );
 }
}
