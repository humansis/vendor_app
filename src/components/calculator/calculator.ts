import { Component, Input, Output, EventEmitter } from '@angular/core';

/**
 * Generated class for the CalculatorComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
	selector: 'calculator',
	templateUrl: 'calculator.html'
})
export class CalculatorComponent {

	@Input() value: number;
    @Output() valueChange = new EventEmitter<number>();
    
	@Output() addToBasketEvent = new EventEmitter<null>();

	constructor() {}

	clickOnNumber(number) {
        if (this.value && this.value != 0) {
            this.value = this.value * 10 + number;
        } else {
            this.value = number;
        }
        this.valueChange.emit(this.value);
	}

	backspace() {
        this.value = Math.trunc(this.value / 10);
		this.valueChange.emit(this.value);
	}

	addToBasket(product) {
        this.addToBasketEvent.emit();
	}

}
