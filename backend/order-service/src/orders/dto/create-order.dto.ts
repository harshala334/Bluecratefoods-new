export class CreateOrderDto {
    storeId: string;
    items: {
        menuItemId: string;
        name: string;
        quantity: number;
        price: number;
    }[];
    totalAmount: number;
    customerName?: string;
    address?: string;
    phone?: string;
    userEmail?: string;
}
