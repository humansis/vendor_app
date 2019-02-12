export class Voucher {
    static __classname__ = 'Voucher';
    id: string;
    qrCode: string = '';
    vendorId: string = '';
    productIds: number[] = [];
    price: number = null;
    currency: string;
    value: number;
    booklet: string;
}