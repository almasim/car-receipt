import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';
import { StorageService } from '../services/storage.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dark-mode-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dark-mode-button.html',
  styleUrl: './dark-mode-button.css',
  providers: [CookieService],
})
export class DarkModeButton {
  isDarkmode: string = 'no';
  consent: string | null = null;
  constructor(
    private cookieService: CookieService,
    private storage: StorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ){
    this.consent = this.storage.get('cookieConsent');
    this.consent=="accepted"?this.isDarkmode = this.cookieService.get('isDarkMode'):null;
  }

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {

      if (this.isDarkmode === 'yes') {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
    }
  }

  toggleDarkMode(event: Event) {
    if (!isPlatformBrowser(this.platformId)) return;
    const isChecked = (event.target as HTMLInputElement).checked;
    
    if (isChecked) {
      document.body.classList.add('dark-mode');
      this.consent=="accepted"?this.cookieService.set('isDarkMode', 'yes'):null;
    } else {
      document.body.classList.remove('dark-mode');
      this.consent=="accepted"?this.cookieService.set('isDarkMode', 'no'):null;
    }
  }
}
