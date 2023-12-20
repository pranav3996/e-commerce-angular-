import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from 'src/app/service/cart.service';
import { FormDataService } from 'src/app/service/form-data.service';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { environment } from 'src/environments/environment';
import { CdkDragEnter, moveItemInArray } from '@angular/cdk/drag-drop';

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

  // Form group for user information
  // userForm: FormGroup;

  // Configuration for PayPal payment
  public payPalConfig?: IPayPalConfig;
  
  // Flag to show a success message after payment
  public showSuccess: any;

  user = {
    username: '',
    email:'',
    mobile:'',
    address:'',
    city:'',
    state:'',
    zip:'',
  };
  constructor(
    private cartService: CartService, 
    private router: Router,
    private formDataService: FormDataService
  ) {
    // Initialize the user information form with validation
    // this.userForm = this.fb.group({
    //   userName: ['', [Validators.required]],
    //   email: ['', [Validators.required]],
    //   mobile: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
    //   address: ['', [Validators.required]],
    //   city: ['', [Validators.required]],
    //   state: ['', [Validators.required]],
    //   zip: ['', [Validators.required]],
    // });
  }

  // Lifecycle hook called after the component is initialized
  
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
    // Check if the user information form is valid
    // if (this.userForm.valid) {
    //   // Get the form data
    //   const formData = this.userForm.value;
    //   console.log('Form submitted successfully:', formData);

    //   // Save form data to the FormDataService
    //   // this.formDataService.setFormData(formData);

    //   // Navigate to another component with the form data
    //   // this.router.navigate(['view'], {
    //   //   queryParams: { formData: JSON.stringify(formData) },
    //   // });
    // } else {
    //   console.log('Form is invalid. Please check the fields.');
    // }
  }

  // Method to update the quantity of an item in the cart
  updateQuantity(item: any, newQuantity: number) {
    // Call the service method to update the quantity
    this.cartService.updateQuantity(item, newQuantity);
    item.quantity = Math.max(1, newQuantity);

    // Update the total cost of items in the cart
    this.getTotalPrice();
    console.log('After updating quantity, new total cost:', this.getTotalPrice());
  }

  // Method to get the total cost of items in the cart
  getTotalPrice(): number {
    // Call the service method to get the total cost
    this.grandTotal = JSON.parse(localStorage.getItem('cart_total') as any) || [];
    return this.cartService.getTotalPrice();
  }

  // Method to initialize PayPal configuration
  private initConfig(): void {
    var Client_ID='AfRdDCfUoQG-FZTY6z3-02s2RPbvn37HWjp_8J3OsAYhFGLYFgENC_a2GQTHb_l1S9u_uL2yazopBxgv'
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
    { index: 2, name: 'Billing_Address'},
  

];
public widgetList = ['Buy_Items', 'Payment_Options', 'Billing_Address'];
selectedWidgetList = [];
selectedCardList = [];
@ViewChild('dropListContainer', { static: false }) dropListContainer?: ElementRef;

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

// isSelected(widget: string): boolean {
//   return this.selectedWidgetList.includes(widget);
// }
// onClickCheckbox() {
//   this.selectedCardList = []
//   this.selectedWidgetList.forEach(y => {
//       this.defaultdashboardPositions.forEach(x => {
//           if (x.name == y) {
//               this.selectedCardList.push(x);
//           }
//       })
//   });
//   const sortedArray = this.selectedCardList.sort((a, b) => a.index - b.index);
//   const rearrangedArray = sortedArray.map((item, i) => {
//       if (item.index !== i) { item.index = i; }
//       return item;
//   });
//   this.selectedCardList = [];
//   this.selectedCardList = rearrangedArray;
// }
// onResetToDefault(){
//   this.selectedCardList = [];
//   this.selectedCardList = this.defaultdashboardPositions;
//   this.selectedWidgetList=this.selectedCardList.map(x=>x.name);
// }

dragAndDropEnabled = true;
isDragActive = false;
buttonLabel = 'Disable Drag and Drop';
toggleDragDrop() {
  this.isDragActive = !this.isDragActive;
  this.dragAndDropEnabled = !this.dragAndDropEnabled;
  this.buttonLabel = this.dragAndDropEnabled ? 'Disable Drag and Drop' : 'Enable Drag and Drop';
}
}
