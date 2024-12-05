import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { Prodotti } from "src/data/source";
import { Product } from "types/product";
import { ToastService } from "../services/toast.service";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnDestroy {
  form: FormGroup; // Utilizzo di FormGroup per tutto il form
  result = "";
  successMessage: string = ""; // Variabile per gestire il messaggio di successo
  scanActive = false;
  products: Product[] = Prodotti;

  constructor(private fb: FormBuilder, private toastService: ToastService) {
    this.form = this.fb.group({
      shopName: ["", [Validators.required]],
      userCode: ["", [Validators.required]],
      price: [null, [Validators.required]], // Campo numerico richiesto
      note: [""], // Campo di testo facoltativo
      code: ["", Validators.required], // Campo disabilitato
      inPromo: [false], // Campo toggle per la promozione
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      this.scanActive = true;
      const result = await BarcodeScanner.startScan();
      console.log("scan: ", result);
      if (result.hasContent) {
        this.result = result.content;
        this.form.patchValue({
          code: this.result,
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

  ngOnDestroy(): void {
    BarcodeScanner.stopScan();
  }

  // Funzione per aggiungere il prodotto all'array
  addProduct() {
    if (this.form.valid) {
      const productData = this.form.value;
      this.products.push(productData);

      this.toastService.showToast({
        type: "success",
        message: "Prodotto aggiunto con successo",
      });
      this.form.reset(); // Pulisci il modulo
    } else {
      console.log("Il modulo non è valido");
    }
  }
}
