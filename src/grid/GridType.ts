export type GridType<T> = {
  [key: number]: {
    [key: number]: T
  }
}