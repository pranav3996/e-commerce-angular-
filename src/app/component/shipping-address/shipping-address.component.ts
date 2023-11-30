import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDataService } from 'src/app/service/form-data.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-shipping-address',
  templateUrl: './shipping-address.component.html',
  styleUrls: ['./shipping-address.component.css'],
})
export class ShippingAddressComponent implements OnInit {
  // formData: any;
  userData: any;
  editingUser: any;
  isEditing = false;
  constructor(
    private router: Router,
    private formDataService: FormDataService
  ) {}
  ngOnInit() {
    this.formDataService.getUserData().subscribe(data => {
      this.userData = data;
      this.editingUser = { ...data };
    });
  }
  

  submitForm() {
    this.saveChanges();
    // Display SweetAlert
    Swal.fire({
      title: 'Order Confirmed!',
      text: 'Redirecting to the products page...',
      icon: 'success',
      showConfirmButton: false,
      timer: 5000, // 5 seconds
    });

    // Redirect to the products page after 5 seconds
    setTimeout(() => this.router.navigate(['/products']), 5000);
  }
  startEditing() {
    this.editingUser = { ...this.userData };
    this.isEditing = true;
  }
  
  saveChanges() {
    this.formDataService.setUserData(this.editingUser);
    this.isEditing = false;
  }
}
