export namespace Keychain {
  export type Transaction = string;
  export type ChainId = string;
  export type Signed = string;
  export type Key = string;

  export enum Algorithm {
    AES256,
  }

  export enum Curve {
    SECP256K1
  }

  export interface MapOfKeys {
    [dapp: string]: ActiveKey,
  }
}

export interface ActiveKey {
  key: Keychain.Key;
  // Active key instanse for sign - simlink bind to static Keychain.sign
  sign(chainId: Keychain.ChainId, transaction: Keychain.Transaction): Promise<Keychain.Signed>;
}

export interface KeyStore {
  getKey(dapp: string): ActiveKey;
  keys: Keychain.MapOfKeys;
}

export abstract class Keychain {
  static sign(key: Keychain.Key, chainId: Keychain.ChainId, transaction: Keychain.Transaction): Promise<Keychain.Signed>;
  static create(key: Keychain.Key, algorithm: Keychain.Algorithm, curve: Keychain.Curve): Promise<boolean>;
  static list(): Promise<Keychain.Key[]>;

  // Default key by current dapp 
  defaultKey: ActiveKey;
}