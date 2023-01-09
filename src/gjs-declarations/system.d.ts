declare module "system" {
  export const programArgs: string[];
  export const programInvocationName: string;
  export const programPath: string;
  export const version: string;
  export function exit(code: number): void;
}
