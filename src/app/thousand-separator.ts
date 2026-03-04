import { Directive , ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appThousandSeparator]',
})
export class ThousandSeparator {

  constructor(
    private el: ElementRef,
    private control: NgControl 
  ) { }
  @HostListener('input', ['$event'])
  onInput(event: Event) {
    let value = (event.target as HTMLInputElement).value;

    value=value.replace(/\D/g, '');
    if (this.control?.control) {
      this.control.control.setValue(value, { emitEvent: false });
    }
    const formatted = value?Number(value).toLocaleString('hu-HU'): '';
    this.el.nativeElement.value = formatted;
  }
  @HostListener('blur')
  onBlur() {
    const rawValue = this.control?.control?.value;

    if (rawValue !== null && rawValue !== undefined) {
      this.el.nativeElement.value = rawValue;
    }
  }
}
