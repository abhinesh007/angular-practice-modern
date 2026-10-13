import { Component, ChangeDetectionStrategy } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './core/layout/navbar/navbar.component';
import { FooterComponent } from './core/layout/footer/footer.component';
import { ToastComponent } from './shared/ui/toast/toast.component';

/**
 * -----------------------------------------------------------------------------
 * 🎓 MODERN ANGULAR PATTERN: Standalone Root Application Shell
 * -----------------------------------------------------------------------------
 *
 * 🔄 OLD WAY (Angular 2 - 15):
 * Declared inside AppModule, required FormsModule/CommonModule/RouterModule in imports.
 *
 * 🚀 MODERN WAY (Angular 18 - 22):
 * Pure standalone root shell declaring only the components it directly renders.
 * -----------------------------------------------------------------------------
 */

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, FooterComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {}
