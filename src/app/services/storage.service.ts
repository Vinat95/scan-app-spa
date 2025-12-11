import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { Products } from 'types/product';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  private readonly PRODUCTS_KEY = 'products_list';
  private readonly USER_CODE_KEY = 'user_code';

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

  // Salva il codice utente
  async saveUserCode(userCode: string): Promise<void> {
    await this._storage?.set(this.USER_CODE_KEY, userCode);
  }

  // Carica il codice utente
  async loadUserCode(): Promise<string | null> {
    return await this._storage?.get(this.USER_CODE_KEY);
  }

  // Cancella il codice utente
  async clearUserCode(): Promise<void> {
    await this._storage?.remove(this.USER_CODE_KEY);
  }
}
