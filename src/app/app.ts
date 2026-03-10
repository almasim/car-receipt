import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewForm } from "./new-form/new-form";
import { DarkModeButton } from './dark-mode-button/dark-mode-button';
import { CookiePopupimplements } from './cookie-popup/cookie-popup';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NewForm, DarkModeButton,CookiePopupimplements],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('car-receipt');
}
