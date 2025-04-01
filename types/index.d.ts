type FormType = "sign-in" | "sign-up";

// Fix for jsonwebtoken types
declare module "jsonwebtoken" {
  type Secret = string | Buffer;

  export interface SignOptions {
    expiresIn?: string | number;
    algorithm?: string;
    audience?: string | string[];
    issuer?: string;
    jwtid?: string;
    subject?: string;
    noTimestamp?: boolean;
    header?: object;
    keyid?: string;
  }

  export function sign(payload: string | object | Buffer, secretOrPrivateKey: Secret, options?: SignOptions): string;

  export function verify(token: string, secretOrPrivateKey: Secret, options?: object): string | object;
}
