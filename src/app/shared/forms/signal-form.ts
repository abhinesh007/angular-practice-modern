import { signal, computed, WritableSignal, Signal } from '@angular/core';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Functional Signal Forms Helper
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * const control = new FormControl('', [Validators.required]);
 * // Observable statusChanges, valueChanges, manual unsubscriptions,
 * // zone.js change detection triggers on every keystroke.
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * Pure Signal Form Primitive:
 * const field = createFormField('', [required()]);
 * // 1. `field.value()` is a WritableSignal!
 * // 2. `field.error()` is a pure computed() signal!
 * // 3. `field.isValid()` is automatically derived with zero Observable overhead!
 * // 4. Works seamlessly in Zoneless Angular.
 *
 * 📖 OFFICIAL DOCS: https://angular.dev/guide/signals
 * -----------------------------------------------------------------------------
 */

export type ValidatorFn<T> = (value: T) => string | null;

export interface FormField<T> {
  readonly value: WritableSignal<T>;
  readonly touched: WritableSignal<boolean>;
  readonly dirty: WritableSignal<boolean>;
  readonly error: Signal<string | null>;
  readonly isValid: Signal<boolean>;
  set: (val: T) => void;
  markTouched: () => void;
  reset: () => void;
}

export function createFormField<T>(
  initialValue: T,
  validators: ValidatorFn<T>[] = []
): FormField<T> {
  const value = signal<T>(initialValue);
  const touched = signal<boolean>(false);
  const dirty = signal<boolean>(false);

  // Pure computed validation signal:
  const error = computed(() => {
    const current = value();
    for (const validator of validators) {
      const err = validator(current);
      if (err) return err;
    }
    return null;
  });

  const isValid = computed(() => error() === null);

  return {
    value,
    touched,
    dirty,
    error,
    isValid,
    set: (val: T) => {
      dirty.set(true);
      value.set(val);
    },
    markTouched: () => touched.set(true),
    reset: () => {
      value.set(initialValue);
      touched.set(false);
      dirty.set(false);
    }
  };
}

// Common Modern Signal Validators
export function required(message = 'This field is required'): ValidatorFn<string> {
  return (value: string) => {
    return !value || !value.trim() ? message : null;
  };
}

export function minLength(min: number, message?: string): ValidatorFn<string> {
  return (value: string) => {
    return value && value.trim().length < min
      ? message || `Must be at least ${min} characters`
      : null;
  };
}

export function emailValidator(message = 'Enter a valid email address'): ValidatorFn<string> {
  return (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return value && !emailRegex.test(value.trim()) ? message : null;
  };
}

export function phoneValidator(message = 'Enter a valid 10-digit phone number'): ValidatorFn<string> {
  return (value: string) => {
    const clean = value ? value.replace(/\D/g, '') : '';
    return clean.length !== 10 ? message : null;
  };
}

export function pinCodeValidator(message = 'Enter a valid 6-digit postal code'): ValidatorFn<string> {
  return (value: string) => {
    const clean = value ? value.trim() : '';
    return !/^\d{6}$/.test(clean) ? message : null;
  };
}
