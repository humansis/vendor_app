import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';

// Pages
import { ScanPage } from '../pages/scan/scan';
import { LoginPage } from '../pages/login/login';
import { ProductsPage } from '../pages/products/products';

// Plugins
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule, MatSelectModule } from '@angular/material';


@NgModule({
  declarations: [
    MyApp,

    // Pages 
    ScanPage,
    ProductsPage,
    LoginPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    NgxQRCodeModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSelectModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    // Pages
    ScanPage,
    ProductsPage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    // Plugins
    BarcodeScanner
  ]
})
export class AppModule {}
