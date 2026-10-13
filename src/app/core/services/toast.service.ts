import { Injectable, signal } from '@angular/core';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Signal-Based UI Service (Toast Notification)
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * export class ToastService {
 *   private toasts$ = new BehaviorSubject<Toast[]>([]);
 *   toasts = this.toasts$.asObservable();
 *   show(msg) { this.toasts$.next([...this.toasts$.value, msg]); }
 * }
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * We store toast notifications directly in a readonly Signal:
 * readonly toasts = this._toasts.asReadonly();
 *
 * 💡 WHY THIS DECISION WAS MADE:
 * 1. Zero RxJS boilerplate (no BehaviorSubject, no subscription leaks).
 * 2. Directly consumable in template via toasts() with fine-grained Zoneless CD.
 * 3. Immutable updates via signal.update().
 *
 * 📖 OFFICIAL DOCS: https://angular.dev/guide/signals
 * -----------------------------------------------------------------------------
 */

export interface ToastMessage {
  id: string;
  title: string;
  message?: string;
  type: 'success' | 'info' | 'error' | 'warning';
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private readonly _toasts = signal<ToastMessage[]>([]);
  readonly toasts = this._toasts.asReadonly();

  show(title: string, message?: string, type: ToastMessage['type'] = 'success', durationMs = 3500): void {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const toast: ToastMessage = { id, title, message, type };

    this._toasts.update(current => [...current, toast]);

    setTimeout(() => {
      this.dismiss(id);
    }, durationMs);
  }

  success(title: string, message?: string): void {
    this.show(title, message, 'success');
  }

  info(title: string, message?: string): void {
    this.show(title, message, 'info');
  }

  error(title: string, message?: string): void {
    this.show(title, message, 'error', 5000);
  }

  dismiss(id: string): void {
    this._toasts.update(current => current.filter(t => t.id !== id));
  }
}
