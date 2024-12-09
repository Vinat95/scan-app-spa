import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";
import { Products } from "types/product";

@Injectable({
  providedIn: "root",
})
export class MailService {
  private http = inject(HttpClient);

  registerUser(products: Products) {
    return this.http.post(`${environment.host}/email/send/`, products);
  }
}
