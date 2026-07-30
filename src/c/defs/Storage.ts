export default class Storage {
    private readonly isLocalStorageAvailable: boolean;
    private readonly map: Record<string, unknown>;

    constructor() {
        this.isLocalStorageAvailable = isLocalStorageAvailable();
        this.map = {};
    }

    setItem(key: string, value: string | Array<object> | object): void {
        let parsedValue: string | Array<object> | object = value;
        if (Array.isArray(value) || (value instanceof Object && value.constructor === Object)) {
            parsedValue = JSON.stringify(value);
        } else {
            parsedValue.toString();
        }

        if (this.isLocalStorageAvailable) {
            window.localStorage.setItem(key, parsedValue as string);
        } else {
            this.map[key] = parsedValue;
        }
    }

    removeItem(key: string): void {
        if (this.isLocalStorageAvailable) {
            window.localStorage.removeItem(key);
        } else {
            delete this.map[key];
        }
    }

    getItem(key: string): string | unknown | null {
        if (this.isLocalStorageAvailable) {
            return window.localStorage.getItem(key);
        } else {
            return this.map[key] || null;
        }
    }
}

function isLocalStorageAvailable(): boolean {
    const test = 'test';
    try {
        window.localStorage.setItem(test, test);
        window.localStorage.removeItem(test);
        return true;
    } catch (_) {
        return false;
    }
}
