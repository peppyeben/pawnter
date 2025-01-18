export function FormatPrice(price: number) {
    return "$" + price.toLocaleString();
}

export function FormatBNB(amount: number) {
    return amount + " BNB";
}
