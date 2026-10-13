import { Pipe, PipeTransform } from '@angular/core';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Standalone Pure Formatting Pipe
 * -----------------------------------------------------------------------------
 * Standalone pipe imported directly into components where needed.
 * -----------------------------------------------------------------------------
 */

@Pipe({
  name: 'inr',
  standalone: true
})
export class InrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    if (value === null || value === undefined || isNaN(value)) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  }
}
