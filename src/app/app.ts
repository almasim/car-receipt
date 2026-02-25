import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NewForm } from "./new-form/new-form";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NewForm],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('car-receipt');

}
