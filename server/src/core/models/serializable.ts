export interface Serializable<T, K> {
  serialize(): K;
  deserialize(args: K): T;
}

export function toObject<T>(value: T): T {
  return JSON.parse(
    JSON.stringify(
      value,
      (key, value) =>
        typeof value === 'bigint' ? Number(value.toString()) : value, // return everything else unchanged
    ),
  );
}
