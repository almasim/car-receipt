import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';

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
      date: [this.today,Validators.required],
      licencePlate: ['',Validators.required],
      kmRan: ['',[Validators.required,Validators.min(0)]],
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
  
  formatPrice(price: number): string {
    return price.toLocaleString('hu-HU', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    });
  }

  get overall(): string {
    const parts = this.repairForm.get('partsCost')?.value || 0;
    const diagnostics = this.repairForm.get('diagnosticsCost')?.value || 0;
    const wage = this.repairForm.get('wage')?.value || 0;
    const technicalExam = this.repairForm.get('technicalExam')?.value || 0;

    return this.formatPrice(Number(parts) + Number(diagnostics) + Number(wage)+Number(technicalExam));
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
        if (!trimmed) return ''; 
        const cleaned = trimmed.replace(/^-+\s*/, '');
        return trimmed.startsWith('-') ? trimmed : `- ${trimmed}`;
      })
      .join('\n');

    if (formatted !== value) {
      control.setValue(formatted, { emitEvent: false });
    }
  }

  generatePdf(id: number,form:FormGroup): void {
    console.log("inside")
    const doc = new jsPDF();

    doc.setFontSize(22);
    doc.text(`${form.get('carName')?.value}`, 105, 20, { align: 'left' });
    doc.text(`Date: ${form.get('date')?.value}`, 105, 30, { align: 'right' });
    doc.setFontSize(12);
    doc.text(`LicensePlate: ${form.get('licencePlate')?.value}`, 105, 40, { align: 'left' });
    if(form.get('partsUsed')?.value){
      doc.text(`Parts used: ${form.get('partsUsed')?.value}`, 105, 50, { align: 'left' });
    }
    if(form.get('partsBroughtEnabled')?.value && form.get('partsBrought')?.value){
      doc.text(`Parts brought by customer: ${form.get('partsBrought')?.value}`, 105, 60, { align: 'left' });
    }
    if(form.get('moreFoultsEnabled')?.value && form.get('moreFoults')?.value){
      doc.text(`More foults: ${form.get('moreFoults')?.value}`, 105, 70, { align: 'left' });
    }
    if(form.get('partsCost')?.value){
      doc.text(`Parts cost: ${this.formatPrice(form.get('partsCost')?.value)} Ft`, 105, 80, { align: 'left' });
    }
    if(form.get('diagnosticsCost')?.value){
      doc.text(`Diagnostics cost: ${this.formatPrice(form.get('diagnosticsCost')?.value)} Ft`, 105, 90, { align: 'left' });
    }
    if(form.get('technicalExam')?.value){
      doc.text(`Technical exam: ${this.formatPrice(form.get('technicalExam')?.value)} Ft`, 105, 100, { align: 'left' });
    }
    doc.text(`Wage: ${this.formatPrice(form.get('wage')?.value)} Ft`, 105, 110, { align: 'left' });
    doc.text(`Overall: ${this.overall} Ft`, 105, 120, { align: 'left' });

    doc.save(`${form.get('date')?.value}-${id}car-repair-receipt.pdf`);
  }

  onSubmit() {
    if (this.repairForm.valid) {
      this.generatePdf(1,this.repairForm);
    } else {
      console.error('Form is invalid');
    }
  }
}
