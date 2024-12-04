import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'home', // Riferimento alla Home Page
        loadChildren: () => import('./../home/home.module').then(m => m.HomePageModule),
      },
      {
        path: 'product-table', // Riferimento alla pagina Product Table
        loadChildren: () => import('./../product-table/product-table.module').then(m => m.ProductTablePageModule),
      },
      {
        path: '',
        redirectTo: 'home', // Redirect alla Home Page di default
        pathMatch: 'full',
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
