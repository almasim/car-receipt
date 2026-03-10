import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-dark-mode-button',
  imports: [],
  templateUrl: './dark-mode-button.html',
  styleUrl: './dark-mode-button.css',
  providers: [CookieService],
})
export class DarkModeButton {
  isDarkmode: string = 'no';
    constructor(
      private cookieService: CookieService,
      @Inject(PLATFORM_ID) private platformId: Object
    ){
      this.isDarkmode = this.cookieService.get('isDarkMode');
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
      this.cookieService.set('isDarkMode', 'yes');
      document.body.classList.add('dark-mode');
    } else {
      this.cookieService.set('isDarkMode', 'no');
      document.body.classList.remove('dark-mode');
    }
  }
}
