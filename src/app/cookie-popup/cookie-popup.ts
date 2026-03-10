"use client";
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'app-cookie-popup',
  imports: [CommonModule],
  templateUrl: './cookie-popup.html',
  styleUrl: './cookie-popup.css',
})
export class CookiePopupimplements implements OnInit {

  showPopup = false;
  constructor(private storage: StorageService) {}

  ngOnInit(): void {
     
    const consent = this.storage.get('cookieConsent');

    if (!consent) {
      this.showPopup = true;
    }
  }

  acceptCookies() {
    this.storage.set('cookieConsent', 'accepted');
    this.showPopup = false;
  }

  rejectCookies() {
    this.storage.set('cookieConsent', 'rejected');
    this.showPopup = false;
  }
}