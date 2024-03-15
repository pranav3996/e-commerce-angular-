import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import { Router } from '@angular/router';
import { CartService } from 'src/app/service/cart.service';
import { FormDataService } from 'src/app/service/form-data.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { CdkDragEnter, moveItemInArray } from '@angular/cdk/drag-drop';

interface User {
  username: string;
  email: string;
  mobile: string;
  address: string;
  zip: string;
  state: string;
  city: string;
}
interface CitiesByState {
  [key: string]: string[];
}
interface StateByCity {
  [key: string]: string;
}
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
})
export class CheckoutComponent implements OnInit {
  // Array to store products in the cart
  public products: any = [];

  // Variable to store the total cost of the items in the cart
  public grandTotal!: number;

  // Configuration for PayPal payment
  public payPalConfig?: IPayPalConfig;

  // Flag to show a success message after payment
  public showSuccess: any;

  user: User = {
    username: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    state: '',
    zip: '',
  };
  stateByCity: StateByCity = {};
  flattenedCities: string[] = [];

  constructor(
    private cartService: CartService,
    private router: Router,
    private formDataService: FormDataService,

  ) {
 
    Object.keys(this.citiesByState).forEach((state) => {
      this.citiesByState[state].forEach((city) => {
        this.stateByCity[city] = state;
        this.flattenedCities.push(city);
      });
    });
  }



  ngOnInit(): void {
    // Initialize PayPal configuration
    this.initConfig();

    // Fetch products in the cart from the CartService
    this.cartService.getProducts().subscribe((res) => {
      // Assign received products to the component's products array
      this.products = res;

      // Calculate and assign the total cost of items in the cart
      this.grandTotal = this.cartService.getTotalPrice();
    });
  }

  // Method to remove an item from the cart
  removeItem(item: any) {
    this.cartService.removeCartItem(item);
    console.log('Item removed from the cart');
  }

  // Method to handle form submission
  onSubmit() {


    console.log('Form submitted:', this.user);
    this.formDataService.setUserData(this.user);
    this.router.navigate(['/view']);

  }

  // Method to update the quantity of an item in the cart
  updateQuantity(item: any, newQuantity: number) {
    // Call the service method to update the quantity
    this.cartService.updateQuantity(item, newQuantity);
    item.quantity = Math.max(1, newQuantity);

    // Update the total cost of items in the cart
    this.getTotalPrice();
    console.log(
      'After updating quantity, new total cost:',
      this.getTotalPrice()
    );
  }

  // Method to get the total cost of items in the cart
  getTotalPrice(): number {
    // Call the service method to get the total cost
    this.grandTotal =
      JSON.parse(localStorage.getItem('cart_total') as any) || [];
    return this.cartService.getTotalPrice();
  }

  // Method to initialize PayPal configuration
  private initConfig(): void {
    var Client_ID =
      'AfRdDCfUoQG-FZTY6z3-02s2RPbvn37HWjp_8J3OsAYhFGLYFgENC_a2GQTHb_l1S9u_uL2yazopBxgv';
    this.payPalConfig = {
      currency: 'EUR',
      clientId: `${Client_ID}`,
      createOrderOnClient: (data) =>
        <ICreateOrderRequest>{
          intent: 'CAPTURE',
          purchase_units: [
            {
              amount: {
                currency_code: 'EUR',
                value: `${this.grandTotal}`,
                breakdown: {
                  item_total: {
                    currency_code: 'EUR',
                    value: `${this.grandTotal}`,
                  },
                },
              },
              items: [
                {
                  name: 'Enterprise Subscription',
                  quantity: '1',
                  category: 'DIGITAL_GOODS',
                  unit_amount: {
                    currency_code: 'EUR',
                    value: `${this.grandTotal}`,
                  },
                },
              ],
            },
          ],
        },
      advanced: {
        commit: 'true',
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
      },
      onApprove: (data, actions) => {
        actions.order.get().then((details: any) => {
          console.log('OnApprove - Order details:', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('OnClientAuthorization - Transaction status:', data.status);
        if (data.status === 'COMPLETED') {
          this.router.navigate(['/view']);
        }
        this.showSuccess = true;
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);
      },
      onError: (err) => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('OnClick', data, actions);
      },
    };
  }

  checkout_positions = [
    { index: 0, name: 'Buy_Items' },
    { index: 1, name: 'Payment_Options' },
    { index: 2, name: 'Billing_Address' },
  ];
  public widgetList = ['Buy_Items', 'Payment_Options', 'Billing_Address'];
  selectedWidgetList = [];
  selectedCardList = [];
  @ViewChild('dropListContainer', { static: false })
  dropListContainer?: ElementRef;

  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };
  dragEntered(event: CdkDragEnter<number>) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;

    this.dragDropInfo = { dragIndex, dropIndex };
    moveItemInArray(this.checkout_positions, dragIndex, dropIndex);
    console.log('this.checkout_positions', this.checkout_positions);
  }

  dragAndDropEnabled = true;
  isDragActive = false;
  buttonLabel = 'Disable Drag and Drop';
  toggleDragDrop() {
    this.isDragActive = !this.isDragActive;
    this.dragAndDropEnabled = !this.dragAndDropEnabled;
    this.buttonLabel = this.dragAndDropEnabled
      ? 'Disable Drag and Drop'
      : 'Enable Drag and Drop';
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

  onCityChange() {
    this.user.state = this.stateByCity[this.user.city] || '';
    if (!this.user.city) {
      this.user.state = '';
    }
  }

  onStateChange() {
    if (!this.user.state) {
      this.user.city = '';
    }
  
  }
 
  // validateUsername(): boolean {
  //   // Regular expression pattern for letters and spaces only
  //   const regex = /^[a-zA-Z\s]*$/;
  
  //   // Check if the input is empty or has not been touched
  //   if (!this.user.username || this.user.username.trim() === '') {
  //     return false;
  //   }
  
  //   // Return true if the username matches the pattern
  //   return regex.test(this.user.username.trim());
  // }
  validateUsername(): { isValid: boolean, message: string } {
    // Regular expression pattern for letters and spaces only
    const regex = /^[a-zA-Z\s]*$/;
  
    // Check if the input is empty or has not been touched
    if (!this.user.username && this.user.username.trim() === '') {
      return { isValid: false, message: "Username is required." };
    }
  
    // Return true if the username matches the pattern
    return { isValid: regex.test(this.user.username.trim()), message: "" };
  }
  //   isFormValid(): boolean {
  //   // Add your custom validation logic here
  //   // For example, check if all required fields are filled
  //   return this.user.username.trim() !== '' &&
  //          this.user.email.trim() !== '' &&
  //          this.user.mobile.trim() !== '' &&
  //          this.user.address.trim() !== '' &&
  //          this.user.city.trim() !== '' &&
  //          this.user.state.trim() !== '' &&
  //          this.user.zip.trim() !== '';
  // }
  
}
