import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Products } from 'types/product';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private readonly PRODUCTS_KEY = 'products_list';
  private readonly USER_DATA_KEY = 'user_data';

  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    // Inizializza lo storage
    const storage = await this.storage.create();
    this._storage = storage;
  }

  // Salva la lista dei prodotti
  async saveProducts(products: Products): Promise<void> {
    await this._storage?.set(this.PRODUCTS_KEY, products);
  }

  // Carica la lista dei prodotti
  async loadProducts(): Promise<Products | null> {
    return await this._storage?.get(this.PRODUCTS_KEY);
  }

  // Cancella la lista dei prodotti
  async clearProducts(): Promise<void> {
    await this._storage?.remove(this.PRODUCTS_KEY);
  }

  // Salva i dati utente (userCode e location)
  async saveUserData(userData: { userCode?: string; location?: string }): Promise<void> {
    const currentData = await this.loadUserData();
    const updatedData = { ...currentData, ...userData };
    await this._storage?.set(this.USER_DATA_KEY, updatedData);
  }

  // Carica i dati utente (userCode e location)
  async loadUserData(): Promise<{ userCode: string; location: string } | null> {
    return await this._storage?.get(this.USER_DATA_KEY);
  }

  // Cancella i dati utente (userCode e location)
  async clearUserData(): Promise<void> {
    await this._storage?.remove(this.USER_DATA_KEY);
  }
}
