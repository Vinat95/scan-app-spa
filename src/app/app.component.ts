import { Component } from "@angular/core";
import { LoadingService } from "./services/loading.service";
import { Toast } from "types/toast";
import { ToastService } from "./services/toast.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  toast: Toast | null = null;
  isLoading = this.loadingService.loading$;

  constructor(
    private loadingService: LoadingService,
    private toastService: ToastService
  ) {
    this.toastService.toast$.subscribe((toast) => {
      this.toast = toast;
    });
  }
}
