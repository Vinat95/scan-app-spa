import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class S3Service {
  http = inject(HttpClient);

  uploadImage(payload: any) {
    return this.http.post(`${environment.host}/aws/upload/`, payload);
  }

  deleteImage(key: string) {
    return this.http.delete(`${environment.host}/aws/images/${key}`);
  }
}
