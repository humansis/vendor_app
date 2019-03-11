import { NgModule } from '@angular/core';
import { HeaderComponent } from './header/header';
import { CalculatorComponent } from './calculator/calculator';
import { IonicModule } from 'ionic-angular';
import { MatButtonModule } from '@angular/material';
import { Network } from '@ionic-native/network';


@NgModule({
    declarations: [
        HeaderComponent,
        CalculatorComponent
    ],
    imports: [
        IonicModule,
        MatButtonModule
    ],
    exports: [
        HeaderComponent,
        CalculatorComponent
    ],
    providers: [
        Network
    ]
})
export class ComponentsModule { }
