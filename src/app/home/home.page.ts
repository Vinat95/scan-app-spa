import { Component, OnDestroy } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { BarcodeScanner } from "@capacitor-community/barcode-scanner";
import { Prodotti } from "src/data/source";
import { ToastService } from "../services/toast.service";
import { Insegne } from "src/data/shops";
import { Insignia } from "types/shops";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { convertBase64ToBlob } from "../helpers/base64toblob";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnDestroy {
  remainingChars: number = 250; //lunghezza massima del campo note
  shopNames: Insignia[] = Insegne;
  photoUrls: string[] = [];
  form: FormGroup; // Utilizzo di FormGroup per tutto il form
  result = "";
  successMessage: string = ""; // Variabile per gestire il messaggio di successo
  scanActive = false;

  constructor(private fb: FormBuilder, private toastService: ToastService) {
    this.form = this.fb.group({
      shopName: ["", [Validators.required]],
      userCode: [
        "",
        [Validators.required, Validators.maxLength(2), Validators.minLength(2)],
      ],
      price: [null, [Validators.required]], // Campo prezzo richiesto
      note: ["", [Validators.maxLength(250)]], // Campo di testo facoltativo
      ean: ["", [Validators.required, Validators.pattern(/^\d{13}$/)]],
      inPromo: [false], // Campo toggle per la promozione
      date: [null],
      photos: this.fb.array([]),
    });

    // Monitora i cambiamenti nel campo delle note
    this.form.get("note")?.valueChanges.subscribe((value) => {
      this.remainingChars = 250 - value.length;
    });
  }

  getEanErrorText(): string {
    const eanControl = this.form.get("ean");

    if (!eanControl) return "";

    // Se il campo è vuoto e non è stato toccato, non mostriamo errori
    if (!eanControl.value && eanControl.pristine) {
      return ""; // Nessun errore se non è stato modificato e il campo è vuoto
    }

    // Caso di errore: campo obbligatorio
    if (eanControl.invalid && eanControl.hasError("required")) {
      return "Il codice ean è obbligatorio";
    }

    // Caso di errore: formato non valido (13 cifre numeriche)
    // Questo errore deve comparire sia quando si scrive nel campo che quando si tocca fuori e si ritorna
    if (eanControl.invalid || eanControl.hasError("pattern")) {
      return "Il codice ean ha bisogno di 13 cifre numeriche";
    }

    return "";
  }

  disablePhotoButton(): boolean {
    return (
      this.form.get("userCode")?.value === "" ||
      this.photoUrls.length >= 3 ||
      this.form.get("userCode")?.value.length !== 2
    );
  }

  //Le foto ci sono?
  hasPhotos(): boolean {
    return (this.form.get("photos") as FormArray).length > 0;
  }

  async startScanner() {
    const allowed = await this.checkPermission();
    if (allowed) {
      this.scanActive = true;
      const result = await BarcodeScanner.startScan();
      if (result.hasContent) {
        this.result = result.content;
        this.form.patchValue({
          ean: this.result,
        });
        this.scanActive = false;
      }
    }
  }

  async takePhoto() {
    const permissions = await Camera.checkPermissions();
    if (permissions.camera !== "granted") {
      const result = await Camera.requestPermissions();
      if (result.camera !== "granted") {
        alert("Permesso fotocamera non concesso");
        return;
      }
    }
    try {
      const image = await Camera.getPhoto({
        quality: 90, // Qualità dell'immagine
        resultType: CameraResultType.DataUrl, // Tipo di risultato: Base64, URI, ecc.
        source: CameraSource.Camera, // Usa la fotocamera
      });

      // Ora hai l'immagine sotto forma di data URL
      if (image.dataUrl) {
        // Converti il base64 in un Blob
        const blob = convertBase64ToBlob(image.dataUrl, "image/jpeg");

        // Crea un oggetto File dal Blob
        const file = new File(
          [blob],
          `${this.form.get("userCode")?.value}-${Date.now()}`,
          { type: "image/jpeg" }
        );
        const photoUrl = URL.createObjectURL(file);
        this.photoUrls.push(photoUrl);

        (this.form.get("photos") as FormArray).push(this.fb.control(file));
      }
    } catch (error) {
      console.error("Errore durante la cattura della foto:", error);
    }
  }

  removePhoto(index: number) {
    // Revoca l'URL temporaneo per liberare memoria
    URL.revokeObjectURL(this.photoUrls[index]);

    // Rimuovi la foto dall'array di URL temporanei
    this.photoUrls.splice(index, 1);

    // Rimuovi la foto dal Form
    (this.form.get("photos") as FormArray).removeAt(index);
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
      const currentDate = new Date();
      const formattedDate = `${currentDate.getFullYear().toString().slice(2)}${(
        currentDate.getMonth() + 1
      )
        .toString()
        .padStart(2, "0")}${currentDate
        .getDate()
        .toString()
        .padStart(2, "0")}, ${currentDate
        .getHours()
        .toString()
        .padStart(2, "0")}${currentDate
        .getMinutes()
        .toString()
        .padStart(2, "0")}${currentDate
        .getSeconds()
        .toString()
        .padStart(2, "0")}`;

      this.form.patchValue({
        date: formattedDate,
      });

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
      (this.form.get("photos") as FormArray).clear();
      //Svuota gli url temporanei
      this.photoUrls.forEach((url) => URL.revokeObjectURL(url));
      this.photoUrls = [];
    } else {
      console.log("Il modulo non è valido");
    }
  }
}
