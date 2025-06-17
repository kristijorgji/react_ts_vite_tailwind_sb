import 'i18next';
import Resources from './resources';

type ExtractPlaceholders<S extends string> = S extends `${infer _Start}{{${infer Param}}}${infer Rest}`
    ? Param | ExtractPlaceholders<Rest>
    : never;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type PlaceholdersToParams<S extends string> = S extends never ? {} : { [K in ExtractPlaceholders<S>]: string };

type ParamsFromResources<R> = {
    [N in keyof R]: {
        [K in keyof R[N]]: PlaceholdersToParams<R[N][K] & string>;
    };
};

type Params = ParamsFromResources<Resources>;

declare module 'i18next' {
    interface CustomTypeOptions {
        resources: Resources;
    }

    interface TFunction {
        <N extends keyof Resources, K extends keyof Resources[N]>(
            key: `${Extract<N, string>}:${Extract<K, string>}`,
            options: keyof Params[N][K] extends never ? undefined | object : Params[N][K]
        ): string;
    }
}
