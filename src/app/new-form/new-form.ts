import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { jsPDF } from 'jspdf';
import { NgxDocViewerModule } from 'ngx-doc-viewer';
import '../../assets/fonts/OpenSans-Regular-normal.js';
import { ThousandSeparator } from '../thousand-separator';


@Component({
  selector: 'app-new-form',
  imports: [ReactiveFormsModule,CommonModule,NgxDocViewerModule,ThousandSeparator],
  templateUrl: './new-form.html',
  styleUrl: './new-form.css',
})
export class NewForm {
  repairForm:FormGroup;
  today: string = new Date().toISOString().split('T')[0];
  isPartsBrought: boolean = false;
  docPreview: string = '';

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
      hours: [1,[Validators.required,Validators.min(1)]],
      wage: [0,[Validators.required,Validators.min(0)]],

      extraCosts:this.fb.array([])
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

  addExtraCost() {
    this.extraCosts.push(
      this.fb.group({
        name: [''],
        amount: [0]
      })
    );
  }

  removeExtraCost(index: number) {
    this.extraCosts.removeAt(index);
  }

  get extraCosts(): FormArray {
    return this.repairForm.get('extraCosts') as FormArray;
  }

  get overall(): string {
    const parts = this.repairForm.get('partsCost')?.value || 0;
    const diagnostics = this.repairForm.get('diagnosticsCost')?.value || 0;
    const wage = this.repairForm.get('wage')?.value || 0;
    const technicalExam = this.repairForm.get('technicalExam')?.value || 0;
    const extraTotal = this.extraCosts.controls
      .map(c => Number(c.get('amount')?.value || 0))
      .reduce((a, b) => a + b, 0);

    return this.formatPrice(Number(parts) + Number(diagnostics) + Number(wage)+Number(technicalExam)+Number(extraTotal));
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
    const doc = new jsPDF();
    doc.setFont('OpenSans-Regular', 'normal');
    doc.setFontSize(26);
    doc.text(`${form.get('carName')?.value}`, 20, 20, { align: 'left' });
    doc.setFontSize(22);
    doc.text(`${new Date(form.get('date')?.value).toLocaleDateString('hu-HU')}`, 200, 20, { align: 'right' });
    doc.text(`Rendszám: ${form.get('licencePlate')?.value}`, 20, 40, { align: 'left' });
    doc.setFontSize(16);

    let yPosition = 50;

    if(form.get('partsUsed')?.value){
      let partsString = form.get('partsUsed')?.value.split('\n').map((line: string) => `${line.trim()}`).join('\n');

      doc.setFontSize(18);

      //todo: if partsString is not empty, then print the header and the content, otherwise skip
      //todo: if string is too long, then split it into multiple lines
      doc.text(`Anyag:`, 20, yPosition, { align: 'left' });
      doc.setFontSize(16);
      for (let line of partsString.split('\n')) {
        yPosition += 7;
        doc.text(line, 25, yPosition, { align: 'left' });
      }

      yPosition += 10;
    }

    if(form.get('partsBroughtEnabled')?.value && form.get('partsBrought')?.value){
      let partsBroughtString = form.get('partsBrought')?.value.split('\n').map((line: string) => `${line.trim()}`).join('\n');

      doc.text(`Ügyfél hozta:`, 20, yPosition, { align: 'left' });
      for (let line of partsBroughtString.split('\n')) {
        yPosition += 7;
        doc.text(line, 25, yPosition, { align: 'left' });
      }

      yPosition += 10;
    }

    if(form.get('moreFoultsEnabled')?.value && form.get('moreFoults')?.value){
      let moreFoultsString = form.get('moreFoults')?.value.split('\n').map((line: string) => `${line.trim()}`).join('\n');
      
      doc.text(`További hibák:`, 20, yPosition, { align: 'left' });
      for (let line of moreFoultsString.split('\n')) {
        yPosition += 7;
        doc.text(line, 25, yPosition, { align: 'left' });
      }

      yPosition += 10;
    }

    if(form.get('partsCost')?.value){
      doc.text(`Anyag ára: ${this.formatPrice(form.get('partsCost')?.value)} Ft`, 20, yPosition, { align: 'left' });

      yPosition += 10;
    }
    if(form.get('diagnosticsCost')?.value){
      doc.text(`Diagnosztika: ${this.formatPrice(form.get('diagnosticsCost')?.value)} Ft`, 20, yPosition, { align: 'left' });
      yPosition += 10;
    }
    if(form.get('technicalExam')?.value){
      
      doc.text(`Műszaki vizsga: ${this.formatPrice(form.get('technicalExam')?.value)} Ft`, 20, yPosition, { align: 'left' });
      yPosition += 10;
    }
    
    doc.text(`Munkadíj (${form.get('hours')?.value} óra): ${this.formatPrice(form.get('wage')?.value)} Ft`, 20, yPosition, { align: 'left' });

    yPosition += 10;

    const extraCosts = form.get('extraCosts') as FormArray;
    if (extraCosts && extraCosts.length > 0) {
      extraCosts.controls.forEach((control, index) => {
        const name = control.get('name')?.value;
        const amount = control.get('amount')?.value;

        if (name && amount) {
          doc.text(
            `${name}: ${this.formatPrice(amount)} Ft`,
            20,
            yPosition,
            { align: 'left' }
          );
          yPosition += 10;
        }
      });
    } 
    doc.setFontSize(18);
    doc.text(`Összesen: ${this.overall} Ft`, 20, yPosition + 10, { align: 'left' });

    if(id === 1){
      this.docPreview = doc.output('datauristring');
    }else{
     doc.save(`${form.get('date')?.value}-${id}car-repair-receipt.pdf`);
    }
  }

  onSubmit() {
    if (this.repairForm.valid) {
      this.generatePdf(1,this.repairForm);
    } else {
      console.error('Form is invalid');
    }
  }
}
