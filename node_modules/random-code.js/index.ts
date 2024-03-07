interface Config {
  length?: number;
  prefix?: string;
  postfix?: string;
}

declare module "random-code.js" {
  export function generateOne(config: Config): string;
}
