import { ChosenProduct } from "./chosenProduct";

export class Voucher {
    static __classname__ = 'Voucher';
    id: string;
    qrCode: string = '';
    vendorId: string = '';
    products: ChosenProduct[] = [];
    price: number = null;
    currency: string;
    value: number;
    booklet: string;
    used_at: Date;
}