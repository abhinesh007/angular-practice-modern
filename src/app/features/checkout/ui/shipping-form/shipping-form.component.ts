import { Component, ChangeDetectionStrategy, computed } from '@angular/core';
import {
  createFormField,
  required,
  minLength,
  emailValidator,
  phoneValidator,
  pinCodeValidator
} from '../../../../shared/forms/signal-form';
import { ShippingAddress } from '../../../../core/models/order.model';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Signal Forms & Template @let Scoping
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * <form [formGroup]="shippingForm">
 *   <input formControlName="fullName" />
 *   <div *ngIf="shippingForm.get('fullName')?.touched && shippingForm.get('fullName')?.invalid">
 *     {{ shippingForm.get('fullName')?.errors?.['required'] }}
 *   </div>
 * </form>
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * 1. Each form field is a pure Signal Form primitive with reactive validation.
 * 2. Template uses the new native `@let` keyword for clean local variable assignment:
 *    `@let error = fullName.touched() && fullName.error();`
 *    `@if (error) { <span>{{ error }}</span> }`
 * 3. `isShippingValid()` is a pure computed() boolean signal with zero overhead.
 *
 * 📖 OFFICIAL DOCS:
 * - https://angular.dev/guide/templates/let-declarations
 * - https://angular.dev/guide/signals
 * -----------------------------------------------------------------------------
 */

@Component({
  selector: 'app-shipping-form',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="space-y-4">
      <h3 class="text-base font-bold text-white mb-2 flex items-center gap-2">
        <span>Shipping Destination</span>
        <span class="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono">
          Signal Form
        </span>
      </h3>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <!-- Full Name -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-gray-300">Full Name *</label>
          <input
            type="text"
            [value]="fullName.value()"
            (input)="fullName.set($any($event.target).value)"
            (blur)="fullName.markTouched()"
            placeholder="e.g. Abhinesh Gour"
            class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-950 border text-white placeholder-gray-500 outline-none transition-colors"
            [class.border-gray-800]="!fullName.touched() || !fullName.error()"
            [class.border-rose-500]="fullName.touched() && fullName.error()"
          />
          @let nameErr = fullName.touched() && fullName.error();
          @if (nameErr) {
            <p class="text-[11px] text-rose-400 font-medium">{{ fullName.error() }}</p>
          }
        </div>

        <!-- Phone Number -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-gray-300">Phone Number *</label>
          <input
            type="tel"
            [value]="phone.value()"
            (input)="phone.set($any($event.target).value)"
            (blur)="phone.markTouched()"
            placeholder="10-digit mobile number"
            class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-950 border text-white placeholder-gray-500 outline-none transition-colors"
            [class.border-gray-800]="!phone.touched() || !phone.error()"
            [class.border-rose-500]="phone.touched() && phone.error()"
          />
          @let phoneErr = phone.touched() && phone.error();
          @if (phoneErr) {
            <p class="text-[11px] text-rose-400 font-medium">{{ phone.error() }}</p>
          }
        </div>

        <!-- Email Address -->
        <div class="sm:col-span-2 space-y-1.5">
          <label class="block text-xs font-semibold text-gray-300">Email Address (for order receipts) *</label>
          <input
            type="email"
            [value]="email.value()"
            (input)="email.set($any($event.target).value)"
            (blur)="email.markTouched()"
            placeholder="name@company.com"
            class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-950 border text-white placeholder-gray-500 outline-none transition-colors"
            [class.border-gray-800]="!email.touched() || !email.error()"
            [class.border-rose-500]="email.touched() && email.error()"
          />
          @let emailErr = email.touched() && email.error();
          @if (emailErr) {
            <p class="text-[11px] text-rose-400 font-medium">{{ email.error() }}</p>
          }
        </div>

        <!-- Street Address -->
        <div class="sm:col-span-2 space-y-1.5">
          <label class="block text-xs font-semibold text-gray-300">Street Address &amp; House/Flat No. *</label>
          <input
            type="text"
            [value]="street.value()"
            (input)="street.set($any($event.target).value)"
            (blur)="street.markTouched()"
            placeholder="e.g. 14 Tech Residency, Outer Ring Road"
            class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-950 border text-white placeholder-gray-500 outline-none transition-colors"
            [class.border-gray-800]="!street.touched() || !street.error()"
            [class.border-rose-500]="street.touched() && street.error()"
          />
          @let streetErr = street.touched() && street.error();
          @if (streetErr) {
            <p class="text-[11px] text-rose-400 font-medium">{{ street.error() }}</p>
          }
        </div>

        <!-- City -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-gray-300">City / District *</label>
          <input
            type="text"
            [value]="city.value()"
            (input)="city.set($any($event.target).value)"
            (blur)="city.markTouched()"
            placeholder="e.g. Bengaluru"
            class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-950 border text-white placeholder-gray-500 outline-none transition-colors"
            [class.border-gray-800]="!city.touched() || !city.error()"
            [class.border-rose-500]="city.touched() && city.error()"
          />
          @let cityErr = city.touched() && city.error();
          @if (cityErr) {
            <p class="text-[11px] text-rose-400 font-medium">{{ city.error() }}</p>
          }
        </div>

        <!-- Postal Code -->
        <div class="space-y-1.5">
          <label class="block text-xs font-semibold text-gray-300">PIN / Postal Code *</label>
          <input
            type="text"
            [value]="postalCode.value()"
            (input)="postalCode.set($any($event.target).value)"
            (blur)="postalCode.markTouched()"
            placeholder="e.g. 560103"
            class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-gray-950 border text-white placeholder-gray-500 outline-none transition-colors"
            [class.border-gray-800]="!postalCode.touched() || !postalCode.error()"
            [class.border-rose-500]="postalCode.touched() && postalCode.error()"
          />
          @let pinErr = postalCode.touched() && postalCode.error();
          @if (pinErr) {
            <p class="text-[11px] text-rose-400 font-medium">{{ postalCode.error() }}</p>
          }
        </div>

      </div>
    </div>
  `
})
export class ShippingFormComponent {
  // Signal Form Fields
  readonly fullName = createFormField('Abhinesh Gour', [
    required('Full name is required'),
    minLength(3, 'Name must be at least 3 characters')
  ]);

  readonly email = createFormField('abhinesh.gour@example.com', [
    required('Email is required'),
    emailValidator('Invalid email address')
  ]);

  readonly phone = createFormField('9876543210', [
    required('Phone number is required'),
    phoneValidator('Enter a valid 10-digit mobile number')
  ]);

  readonly street = createFormField('14 Tech Residency, Outer Ring Road', [
    required('Street address is required')
  ]);

  readonly city = createFormField('Bengaluru', [
    required('City is required')
  ]);

  readonly postalCode = createFormField('560103', [
    required('Postal code is required'),
    pinCodeValidator('Postal code must be 6 digits')
  ]);

  // Derived Form-Level Validity Signal
  readonly isShippingValid = computed(() =>
    this.fullName.isValid() &&
    this.email.isValid() &&
    this.phone.isValid() &&
    this.street.isValid() &&
    this.city.isValid() &&
    this.postalCode.isValid()
  );

  // Derived Data Payload
  readonly shippingData = computed<ShippingAddress>(() => ({
    fullName: this.fullName.value().trim(),
    email: this.email.value().trim(),
    phone: this.phone.value().trim(),
    street: this.street.value().trim(),
    city: this.city.value().trim(),
    postalCode: this.postalCode.value().trim()
  }));

  markAllTouched(): void {
    this.fullName.markTouched();
    this.email.markTouched();
    this.phone.markTouched();
    this.street.markTouched();
    this.city.markTouched();
    this.postalCode.markTouched();
  }
}
