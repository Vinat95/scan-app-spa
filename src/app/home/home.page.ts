import { Component, OnDestroy } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { Prodotti } from "src/data/source";
import { Product } from "types/product";
import { ToastService } from "../services/toast.service";
import { Insegne } from "src/data/shops";
import { Insignia } from "types/shops";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnDestroy {
  remainingChars: number = 250; //lunghezza massima del campo note
  shopNames: Insignia[] = Insegne;
  form: FormGroup; // Utilizzo di FormGroup per tutto il form
  result = "";
  successMessage: string = ""; // Variabile per gestire il messaggio di successo
  scanActive = false;
  // products: Product[] = Prodotti;

  constructor(private fb: FormBuilder, private toastService: ToastService) {
    this.form = this.fb.group({
      shopName: ["", [Validators.required]],
      userCode: ["", [Validators.required]],
      price: [null, [Validators.required]], // Campo prezzo richiesto
      note: ["", [Validators.maxLength(250)]], // Campo di testo facoltativo
      ean: ["", [Validators.required, Validators.pattern(/^\d{13}$/)]],
      inPromo: [false], // Campo toggle per la promozione
      date: [null],
    });

    // Monitora i cambiamenti nel campo delle note
    this.form.get("note")?.valueChanges.subscribe((value) => {
      this.remainingChars = 250 - value.length;
    });
  }

  getEanHelperText(): string {
    const eanControl = this.form.get("ean");

    // Caso iniziale: nessuna interazione con il campo
    if (eanControl?.pristine) {
      return "Il codice scansionato apparirà qui";
    }

    // Caso predefinito: non ci sono errori specifici ma l'utente ha iniziato a scrivere
    return "";
  }

  getEanErrorText(): string {
    const eanControl = this.form.get("ean");

    if (!eanControl) return "";

    // Caso di errore: campo obbligatorio
    if (
      eanControl.invalid &&
      eanControl.hasError("required") &&
      eanControl.touched
    ) {
      return "Il codice ean è obbligatorio";
    }

    // Caso di errore: formato non valido
    if (eanControl.invalid && eanControl.hasError("pattern")) {
      return "Il codice ean ha bisogno di 13 cifre numeriche";
    }

    return "";
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
          ean: this.result,
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
      // Ottieni la data e l'ora correnti nel formato desiderato
      const currentDate = new Date().toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // Utilizza il formato 24 ore
      });

      this.form.patchValue({
        date: currentDate,
      });

      // this.products.push(this.form.value);
      Prodotti.products.push({ ...this.form.value });
      this.toastService.showToast({
        type: "success",
        message: "Prodotto aggiunto con successo",
      });

      // Resetta solo i campi non bloccati
      this.form.reset({
        shopName: this.form.get("shopName")?.value,
        userCode: this.form.get("userCode")?.value,
        price: null,
        note: "",
        ean: "",
        inPromo: false,
      });
    } else {
      console.log("Il modulo non è valido");
    }
  }
}
