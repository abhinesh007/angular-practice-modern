import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Standalone Toast Component & Built-in Control Flow
 * -----------------------------------------------------------------------------
 * Demonstrates:
 * 1. Functional inject(ToastService)
 * 2. Modern @for (toast of toastService.toasts(); track toast.id)
 * 3. Modern @if control flow
 * 4. Tailwind micro-animations and dismiss interactions
 * -----------------------------------------------------------------------------
 */

@Component({
  selector: 'app-toast',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-xl backdrop-blur-md transition-all duration-300 animate-slide-in border"
          [class.bg-emerald-950\\/90]="toast.type === 'success'"
          [class.border-emerald-500\\/40]="toast.type === 'success'"
          [class.text-emerald-100]="toast.type === 'success'"
          [class.bg-rose-950\\/90]="toast.type === 'error'"
          [class.border-rose-500\\/40]="toast.type === 'error'"
          [class.text-rose-100]="toast.type === 'error'"
          [class.bg-sky-950\\/90]="toast.type === 'info'"
          [class.border-sky-500\\/40]="toast.type === 'info'"
          [class.text-sky-100]="toast.type === 'info'"
          role="alert"
        >
          <!-- Status Icon -->
          <div class="mt-0.5 shrink-0">
            @if (toast.type === 'success') {
              <svg class="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            } @else if (toast.type === 'error') {
              <svg class="w-5 h-5 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            } @else {
              <svg class="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          </div>

          <!-- Content -->
          <div class="flex-1 min-w-0">
            <h4 class="font-semibold text-sm">{{ toast.title }}</h4>
            @if (toast.message) {
              <p class="text-xs opacity-90 mt-0.5 leading-relaxed">{{ toast.message }}</p>
            }
          </div>

          <!-- Dismiss Button -->
          <button
            type="button"
            (click)="toastService.dismiss(toast.id)"
            class="text-gray-400 hover:text-white transition-colors p-1 -mr-1 -mt-1 rounded-lg"
            aria-label="Close notification"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      }
    </div>
  `
})
export class ToastComponent {
  readonly toastService = inject(ToastService);
}
