import { Component, OnInit } from "@angular/core";
import { Product } from "types/product";
import { Prodotti } from "src/data/source";
import { AlertController, NavController } from "@ionic/angular";
import { MailService } from "../services/mail.service";
import { ToastService } from "../services/toast.service";

@Component({
  selector: "app-product-table",
  templateUrl: "./product-table.page.html",
  styleUrls: ["./product-table.page.scss"],
})
export class ProductTablePage implements OnInit {
  products: Product[] = Prodotti;
  removingProducts = new Set<Product>();
  isLoading: boolean = false;

  constructor(
    private alertController: AlertController,
    private mailService: MailService,
    private toastService: ToastService,
    private navCtrl: NavController
  ) {}

  ngOnInit() {}

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
    const index = this.products.indexOf(product);
    if (index > -1) {
      // Aggiungi la classe "removing" per avviare l'animazione
      this.removingProducts.add(product);

      // Attendi l'animazione prima di rimuovere il prodotto
      setTimeout(() => {
        this.products.splice(index, 1);
        this.removingProducts.delete(product);
        this.toastService.showToast({
          type: "success",
          message: "Prodotto Eliminato",
        });
      }, 1000); // timeout con la durata dell'animazione
    }
  }

  sendProducts() {
    this.mailService.registerUser(this.products).subscribe({
      next: (res: any) => {
        this.products.splice(0, this.products.length);
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
}
