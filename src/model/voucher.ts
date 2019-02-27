export class Voucher {
    static __classname__ = 'Voucher';
    id: number;
    qrCode = '';
    vendorId = '';
    productIds: number[] = [];
    price: number = null;
    currency: string;
    value: number;
    booklet: string;
    used_at: Date;
}
