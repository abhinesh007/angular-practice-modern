import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="mt-auto border-t border-gray-800/80 bg-gray-950/70 py-10 text-gray-400">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex flex-col md:flex-row items-center justify-between gap-6">
          <div class="flex items-center gap-3">
            <div class="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
              N
            </div>
            <span class="text-white font-semibold text-sm">NovaStore Modern Angular</span>
          </div>

          <div class="text-xs text-gray-400 text-center md:text-right space-y-1">
            <p>Built with Angular 22 Zoneless • Signals &amp; Resource API • Control Flow &#64;for / &#64;if / &#64;defer</p>
            <p class="text-gray-400">Dual Stores: Native Signal Store &amp; &#64;ngrx/signals • Signal-Driven Forms</p>
          </div>
        </div>
      </div>
    </footer>
  `
})
export class FooterComponent {}
