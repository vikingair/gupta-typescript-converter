// utility types from https://github.com/total-typescript/ts-reset
type NonFalsy<T> = T extends false | 0 | "" | null | undefined | 0n
  ? never
  : NonNullable<T>;

interface Array<T> {
  filter(predicate: BooleanConstructor, thisArg?: unknown): NonFalsy<T>[];
}

interface ReadonlyArray<T> {
  filter(predicate: BooleanConstructor, thisArg?: unknown): NonFalsy<T>[];
}
