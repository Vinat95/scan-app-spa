import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { RouteReuseStrategy } from "@angular/router";
import { IonicModule, IonicRouteStrategy } from "@ionic/angular";
import { AppComponent } from "./app.component";
import { AppRoutingModule } from "./app-routing.module";
import { MailService } from "./services/mail.service";
import { HTTP_INTERCEPTORS, HttpClientModule } from "@angular/common/http";
import { LoadingService } from "./services/loading.service";
import { SpinnerInterceptor } from "./interceptors/spinner.interceptor";
import { ToastService } from "./services/toast.service";
import { ErrorInterceptor } from "./interceptors/error.interceptor";
import { S3Service } from "./services/s3.service";

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [
    MailService,
    S3Service,
    LoadingService,
    ToastService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: SpinnerInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
