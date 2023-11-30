// api.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  // Base URL for the API
  private baseURL = 'https://fakestoreapi.com/products';
  // Alternate base URL for testing
  // private baseURL =  'https://dummyjson.com/products';

  // Injecting the HttpClient service in the constructor
  constructor(private http: HttpClient) {}

  // Method to fetch product data from the API
  getProduct() {
    // Sending an HTTP GET request to the API and handling the response
    return this.http.get<any>(this.baseURL).pipe(
      map((response: any) => {
        // Mapping the response data if necessary
        // (In this case, the mapping is not required, it's just returning the response as is)
        return response;
      })
    );
  }
}
