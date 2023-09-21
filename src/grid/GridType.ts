type GridType<T> = {
  [key: number]: {
    [key: number]: T
  }
}

export default GridType