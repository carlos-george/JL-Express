
export class AppErrors {

    public readonly message: string;
    public readonly statusCod: number;

    constructor(message: string, statusCod = 400) {

        this.message = message;
        this.statusCod = statusCod;

    }

}
