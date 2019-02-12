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
import { ModalPage } from '../pages/modal/modal';

// Plugins
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { BarcodeScanner } from '@ionic-native/barcode-scanner';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatButtonModule, MatSelectModule } from '@angular/material';
import { LoginProvider } from '../providers/login/login';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { VoucherProvider } from '../providers/voucher/voucher';
import { IonicStorageModule } from '@ionic/storage';


@NgModule({
  declarations: [
    MyApp,

    // Pages 
    ScanPage,
    ProductsPage,
    LoginPage,
    ModalPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    NgxQRCodeModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatSelectModule,
    HttpClientModule,
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,

    // Pages
    ScanPage,
    ProductsPage,
    LoginPage,
    ModalPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},

    // Plugins
    BarcodeScanner,
    LoginProvider,
    VoucherProvider
  ]
})
export class AppModule {}
