// Type definitions for Permissions (Array.io)
// Project: http://array.io
// Definitions by: Anton Shramko <https://github.com/friktor>
// TypeScript Version: 2.9

export interface RequestResponse {
  allowed: boolean,
  name: string,
}

export enum Permission {
  AudioCapture,
  VideoCapture,
  Notification
}

export abstract class Permissions {
  request(system: Permission[]): Promise<RequestResponse[]>;
  granted(system: Permission): Promise<boolean>;
}