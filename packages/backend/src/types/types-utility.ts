// Taken from https://gist.github.com/staltz/368866ea6b8a167fbdac58cddf79c1bf
export type NestedPick<T, K1 extends keyof T, K2 extends keyof T[K1]> = {
  [P1 in K1]: {
    [P2 in K2]: T[K1][K2];
  };
};
