import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDataService } from 'src/app/service/form-data.service';
import Swal from 'sweetalert2';
interface CitiesByState {
  [key: string]: string[];
}
interface StateByCity {
  [key: string]: string;
}
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
  flattenedCities: string[] = [];
  constructor(
    private router: Router,
    private formDataService: FormDataService
  ) {
    Object.keys(this.citiesByState).forEach((state) => {
      this.citiesByState[state].forEach((city) => {
        this.stateByCity[city] = state;
        this.flattenedCities.push(city);
      });
    });
  }
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
  citiesByState: CitiesByState = {
    AndhraPradesh: ['Vijayawada', 'Visakhapatnam', 'Tirupati'],
    ArunachalPradesh: ['Itanagar', 'Naharlagun'],
    Assam: ['Guwahati', 'Dibrugarh', 'Jorhat'],
    Bihar: ['Patna', 'Gaya', 'Muzaffarpur'],
    Chhattisgarh: ['Raipur', 'Bhilai', 'Durg'],
    Goa: ['Panaji', 'Margao', 'Vasco da Gama'],
    Gujarat: ['Ahmedabad', 'Surat', 'Vadodara'],
    Haryana: ['Chandigarh', 'Faridabad', 'Gurgaon'],
    HimachalPradesh: ['Shimla', 'Kullu', 'Manali'],
    Jharkhand: ['Ranchi', 'Jamshedpur', 'Dhanbad'],
    Karnataka: ['Bangalore', 'Mysore', 'Hubli'],
    Kerala: ['Thiruvananthapuram', 'Kochi', 'Kozhikode'],
    MadhyaPradesh: ['Bhopal', 'Indore', 'Gwalior'],
    Maharashtra: ['Mumbai', 'Pune', 'Nagpur'],
    Manipur: ['Imphal', 'Thoubal'],
    Meghalaya: ['Shillong', 'Tura'],
    Mizoram: ['Aizawl', 'Lunglei'],
    Nagaland: ['Kohima', 'Dimapur'],
    Odisha: ['Bhubaneswar', 'Cuttack', 'Puri'],
    Punjab: ['Chandigarh', 'Amritsar', 'Ludhiana'],
    Rajasthan: ['Jaipur', 'Jodhpur', 'Udaipur'],
    Sikkim: ['Gangtok', 'Namchi'],
    TamilNadu: ['Chennai', 'Coimbatore', 'Madurai'],
    Telangana: ['Hyderabad', 'Warangal', 'Karimnagar'],
    Tripura: ['Agartala', 'Dharmanagar'],
    UttarPradesh: ['Lucknow', 'Kanpur', 'Varanasi'],
    Uttarakhand: ['Dehradun', 'Haridwar', 'Rishikesh'],
    WestBengal: ['Kolkata', 'Howrah', 'Durgapur'],
  };

  Object = Object;
  stateByCity: StateByCity = {};
  onCityChange() {
    this.editingUser.state = this.stateByCity[this.editingUser.city] || '';
    if (!this.editingUser.city) {
      this.editingUser.state = '';
    }
  }

  onStateChange() {
    if (!this.editingUser.state) {
      this.editingUser.city = '';
    }
  
  }
}
