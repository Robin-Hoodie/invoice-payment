// Taken from https://github.com/Microsoft/TypeScript/issues/14094#issuecomment-373782604
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
export type XOR<T, U> = T | U extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U;
