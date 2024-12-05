import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProductTablePage } from "./product-table.page";

const routes: Routes = [
  {
    path: "",
    component: ProductTablePage,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductTablePageRoutingModule {}
