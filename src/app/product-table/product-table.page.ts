import { Component, OnInit } from "@angular/core";
import { Product } from "types/product.dto";
import { Prodotti } from "src/data/source";
import { AlertController } from "@ionic/angular";

@Component({
  selector: "app-product-table",
  templateUrl: "./product-table.page.html",
  styleUrls: ["./product-table.page.scss"],
})
export class ProductTablePage implements OnInit {
  products: Product[] = Prodotti;

  constructor(private alertController: AlertController) {}

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

  private removeProduct(product: Product) {
    const index = this.products.indexOf(product); // Trova l'indice del prodotto
    if (index > -1) {
      this.products.splice(index, 1); // Rimuovi il prodotto dall'array
      console.log("Prodotto rimosso:", product);
    }
  }
}
