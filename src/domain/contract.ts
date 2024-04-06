export class Contract {

    constructor(
        public id: string,
        public address: string,
        public index: number,
    ) {
    }

    static fromDict(data: any): Contract {
        return new Contract(data.id, data.address, data.index);
    }
}
