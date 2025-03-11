import {BetDTO} from "./bet.client";

export class CacheRepository<T> {
    private static FAR_AWAY = 9999999999999;

    private caches = new Map<string, {expireAt: number, data: T}>();

    constructor(private expirationMs: number) {}

    get(id: string): T | null {
        if (!this.caches.has(id)) {
            return null;
        }

        const { expireAt, data } = this.caches.get(id)!;
        if (Date.now() > expireAt) {
            return null;
        }

        return data;
    }

    set(id: string, data: T, notExpire = false){
        const expireAt = notExpire
            ? CacheRepository.FAR_AWAY
            : Date.now() + this.expirationMs;
        this.caches.set(id, {expireAt, data});
    }
}
