import { Component } from "@angular/core";
import { Product, Products } from "types/product";
import { Prodotti } from "src/data/source";
import { AlertController, NavController } from "@ionic/angular";
import { MailService } from "../services/mail.service";
import { ToastService } from "../services/toast.service";
import { S3Service } from "../services/s3.service";
import { firstValueFrom } from "rxjs";

@Component({
  selector: "app-product-table",
  templateUrl: "./product-table.page.html",
  styleUrls: ["./product-table.page.scss"],
})
export class ProductTablePage {
  removingProducts = new Set<Product>();
  isLoading: boolean = false;
  editingPriceProduct: Product | null = null;
  productsList: Products = Prodotti;
  photoUrls: string[] = [];
  expandedProduct: any = null; // Tiene traccia del prodotto selezionato

  constructor(
    private alertController: AlertController,
    private mailService: MailService,
    private s3Service: S3Service,
    private toastService: ToastService,
    private navCtrl: NavController
  ) {}

  togglePhotoGallery(product: any): void {
    //Pulizia pre apertura
    this.revokePhotoUrls(this.photoUrls);
    // Se il prodotto è già selezionato, chiudi la galleria
    if (this.expandedProduct === product) {
      this.expandedProduct = null;
    } else {
      product.photos.forEach((photo: File, index: number) => {
        this.photoUrls[index] = URL.createObjectURL(photo);
      });
      // Altrimenti, apri la galleria per il prodotto selezionato
      this.expandedProduct = product;
    }
  }

  revokePhotoUrls(photoUrls: Array<string>) {
    this.photoUrls.forEach((url: string, index: number) => {
      URL.revokeObjectURL(this.photoUrls[index]);
    });
    this.photoUrls = [];
  }

  async confirmRemoveProduct(product: Product) {
    const alert = await this.alertController.create({
      header: "Conferma Eliminazione",
      message: "Sei sicuro di voler eliminare questo prodotto?",
      buttons: [
        {
          text: "Annulla",
          role: "cancel",
          handler: () => {
            console.log("Eliminazione annullata"); // Debug per l'annullamento
          },
        },
        {
          text: "Elimina",
          role: "confirm",
          handler: () => {
            this.removeProduct(product); // Procedi con l'eliminazione
          },
        },
      ],
    });

    await alert.present();
  }

  removeProduct(product: Product) {
    const index = this.productsList.products.indexOf(product);
    if (index > -1) {
      // Aggiungi la classe "removing" per avviare l'animazione
      this.removingProducts.add(product);

      // Revoca gli URL temporanei prima di rimuovere il prodotto
      this.revokePhotoUrls(this.photoUrls);

      // Attendi l'animazione prima di rimuovere il prodotto
      setTimeout(() => {
        this.productsList.products.splice(index, 1);
        this.removingProducts.delete(product);
        this.toastService.showToast({
          type: "success",
          message: "Prodotto Eliminato",
        });
      }, 1000); // timeout con la durata dell'animazione
    }
  }

  async uploadPhotosAndSendEmail() {
    for (const product of this.productsList.products) {
      if (product.photos.length > 0) {
        const formData = new FormData();
        // Aggiungi tutte le foto al FormData
        product.photos.forEach((photo) => {
          formData.append("files", photo);
        });
        // Usa firstValueFrom per ottenere la risposta dell'upload in modo asincrono
        const response: any = await firstValueFrom(
          this.s3Service.uploadImage(formData)
        );
        // Aggiorna l'array di foto con gli URL ritornati
        product.photos = response.urls;
      } else {
        product.photos = []; // Se non ci sono file, lascia l'array vuoto
      }
    }

    // Una volta completati tutti gli upload, invia la mail
    this.sendProducts();
  }

  sendProducts() {
    this.mailService.sendProducts(this.productsList).subscribe({
      next: (res: any) => {
        this.productsList.products.splice(0, this.productsList.products.length);
        this.toastService.showToast({
          type: "success",
          message: res.message,
        });
        this.navCtrl.navigateForward("/tabs/home");
      },
      error: (error) => {
        this.toastService.showToast({
          type: "error",
          message: "Errore durante l'invio: " + error.message,
        });
      },
    });
  }

  enableEditPrice(product: Product) {
    this.editingPriceProduct = product; // Abilita la modifica per il prodotto
  }

  isEditingPrice(product: Product): boolean {
    return this.editingPriceProduct === product; // Verifica se è in modifica
  }

  formatDate(date: string): string {
    const [datePart, timePart] = date.split(", ");

    let year = datePart.slice(0, 2); // aa
    const month = datePart.slice(2, 4); // mm
    const day = datePart.slice(4, 6); // gg

    year = parseInt(year, 10) < 50 ? `20${year}` : `19${year}`;

    const hours = timePart.slice(0, 2); // hh
    const minutes = timePart.slice(2, 4); // mm
    const seconds = timePart.slice(4, 6); // ss

    return `${day}/${month}/${year}, ${hours}:${minutes}:${seconds}`;
  }

  savePrice(product: Product) {
    if (this.editingPriceProduct === product) {
      this.editingPriceProduct = null; // Disabilita la modifica
      this.toastService.showToast({
        type: "success",
        message: `Prezzo del prodotto ${product.ean} aggiornato a ${product.price}€!`,
      });
      // Se necessario, aggiorna anche il backend qui
    }
  }
}
