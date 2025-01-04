// export class CustomAPIError extends Error {
//     statusCode: number;
//     constructor(message: any, statusCode: number) {
//         super(message);
//         this.statusCode = statusCode;
//     }
// }

// export const createCustomError = (msg: any, statusCode: number) => {
//     return new CustomAPIError({ success: false, data: msg }, statusCode);
// };

export class CustomAPIError extends Error {
    statusCode: number;
    success: boolean;

    constructor(message: string, statusCode: number = 500) {
        super(message);
        this.name = "CustomAPIError";
        this.statusCode = statusCode;
        this.success = false;
    }
}
