import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Product } from "types/product";

@Injectable({
  providedIn: "root",
})
export class MailService {
  private http = inject(HttpClient);

  registerUser(products: Product[]) {
    return this.http.post(`${environment.host}/email/send/`, products);
  }
}
