import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Toast } from "types/toast";

@Injectable({
  providedIn: "root",
})
export class ToastService {
  private toastSubject = new Subject<Toast | null>();
  toast$ = this.toastSubject.asObservable();

  showToast(toast: Toast) {
    this.toastSubject.next(toast);
    setTimeout(() => {
      this.hideAlert();
    }, 2000);
  }

  hideAlert() {
    this.toastSubject.next(null);
  }
}
