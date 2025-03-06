// This file is made to be importable in both the main code and renderer code.
// To serve that purpose, it's types and interfaces only.

// TODO:LEARN: there's a "namespace" keyword; what's that good for?

export interface Zow {
  ping(): Promise<string>;
}

export function presume_Zow(x: any): x is Zow {
  return true;
}
