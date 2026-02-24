import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-form',
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './new-form.html',
  styleUrl: './new-form.css',
})
export class NewForm {
  repairForm:FormGroup;
  today: string = new Date().toISOString().split('T')[0];
  isPartsBrought: boolean = false;

  constructor(private fb: FormBuilder) {
    this.repairForm = this.fb.group({
      carName: ['',Validators.required],
      licencePlate: ['',Validators.required],
      kmRan: [0,[Validators.required,Validators.min(0)]],
      partsUsed: [''],
      partsBroughtEnabled: [false],
      partsBrought: [''],
      moreFoultsEnabled: [false],
      moreFoults: [''],
      partsCost: [0,Validators.min(0)],
      diagnosticsCost: [0,Validators.min(0)],
      technicalExam: [0,Validators.min(0)],
      wage: [0,[Validators.required,Validators.min(0)]],
    });

    this.repairForm.get('partsBroughtEnabled')?.valueChanges.subscribe(enabled => {
      if (!enabled) {
        this.repairForm.get('partsBrought')?.setValue('');
      }
    });
  }
  

  get overall(): number {
    const parts = this.repairForm.get('partsCost')?.value || 0;
    const diagnostics = this.repairForm.get('diagnosticsCost')?.value || 0;
    const wage = this.repairForm.get('wage')?.value || 0;
    return Number(parts) + Number(diagnostics) + Number(wage);
  }

  formatTextareaWithDash(controlName: string): void {
    const control = this.repairForm.get(controlName);
    if (!control) return;

    const value: string = control.value;
    if (!value) return;

    const formatted = value
      .split('\n')
      .map(line => {
        const trimmed = line.trim();
        if (!trimmed) return ''; // keep empty lines clean
        return trimmed.startsWith('-') ? trimmed : `- ${trimmed}`;
      })
      .join('\n');

    if (formatted !== value) {
      control.setValue(formatted, { emitEvent: false }); // prevent loop
    }
  }

  onSubmit() {
    if (this.repairForm.valid) {
      console.log(this.repairForm.value);
    } else {
      console.error('Form is invalid');
    }
  }
}
