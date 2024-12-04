import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ProductTablePageRoutingModule } from "./product-table-routing.module";
import { ProductTablePage } from "./product-table.page";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProductTablePageRoutingModule,
  ],
  declarations: [ProductTablePage],
})
export class ProductTablePageModule {}
