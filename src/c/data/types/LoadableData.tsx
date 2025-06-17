export class LoadableData<T, E = Error> {
    public readonly value: T | null;
    public readonly loading: boolean;
    public readonly error: E | null;

    constructor(args: { value: T | null; loading: boolean; error: E | null }) {
        this.value = args.value;
        this.loading = args.loading;
        this.error = args.error;
    }

    static value<T>(value: T): LoadableData<T> {
        return new LoadableData<T>({
            value: value,
            loading: false,
            error: null,
        });
    }

    static error<T, E>(error: E, value?: T): LoadableData<T, E> {
        return new LoadableData({
            value: value || null,
            loading: false,
            error: error,
        });
    }

    static loading<T, E>(): LoadableData<T, E> {
        return new LoadableData<T, E>({
            value: null,
            loading: true,
            error: null,
        });
    }
}
