import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements AfterViewInit, OnDestroy {
  form: FormGroup; // Utilizzo di FormGroup per tutto il form
  result = '';
  scanActive = false;

  
  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      shopName: ['', [Validators.required]],
      userCode: ['', [Validators.required]],
      price: [0, [Validators.required, Validators.pattern(/^[0-9]+$/)]], // Campo numerico richiesto
      Note: ['',], // Campo di testo facoltativo
      productCode: [ '', Validators.required], // Campo disabilitato
      isPromotion: [false], // Campo toggle per la promozione
    });
  }



  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      this.scanActive = true;
      const result = await BarcodeScanner.startScan();
      console.log('scan: ', result);
      if (result.hasContent) {
        this.result = result.content;
        this.form.patchValue({
          productCode: this.result
        });
        this.scanActive = false;
      }
    }
  }

  async checkPermission() {
    const status = await BarcodeScanner.checkPermission({ force: true });
    return status.granted;
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ngAfterViewInit(): void {
    // BarcodeScanner.prepare();
  }

  ngOnDestroy(): void {
    BarcodeScanner.stopScan();
  }


  
}
