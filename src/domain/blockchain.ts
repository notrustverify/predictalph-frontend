export class Blockchain {
    name: string;
    type: 'devnet' | 'mainnet' | 'testnet';
    node: string;

    constructor(name: string, type: "devnet" | "mainnet" | "testnet", node: string) {
        this.name = name;
        this.type = type;
        this.node = node;
    }

    equals(other: Blockchain): boolean {
        return other.name === this.name &&
            other.type === this.type;
    }
}
