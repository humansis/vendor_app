import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'calculator',
    templateUrl: 'calculator.html'
})
export class CalculatorComponent {

    @Input() value: number;
    @Output() valueChange = new EventEmitter<number>();

    @Output() addToBasketEvent = new EventEmitter<null>();

    /**
     * Click on calculator number
     * @param  number
     */
    clickOnNumber(number) {
        if (this.value && this.value !== 0) {
            this.value = this.value * 10 + number;
        } else {
            this.value = number;
        }
        this.valueChange.emit(this.value);
    }

    /**
     * Delete last number clicked
     */
    backspace() {
        this.value = Math.trunc(this.value / 10);
        this.valueChange.emit(this.value);
    }

    /**
     * Add product to basket
     * @param  product
     */
    addToBasket(product) {
        this.addToBasketEvent.emit();
    }
}
