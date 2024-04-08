interface IDataBase {
  list<T>(
    callback?: (condition: T, index?: number | undefined) => T | unknown,
  ): Promise<T | unknown>;

  create<T>(payload: T): Promise<T | unknown>;

  update<T>(
    payload: T,
    callback:
      | ((condition: T, index?: number | undefined) => T | unknown)
      | string,
  ): Promise<T | unknown>;

  delete<T>(
    callback: (condition: T, index?: number | undefined) => T | unknown,
  ): Promise<T | unknown>;

  find<T>(
    callback: (condition: T, index?: number | undefined) => T | unknown,
  ): Promise<T | unknown>;
}

export default IDataBase;
