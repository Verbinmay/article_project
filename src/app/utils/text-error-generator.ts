export const textErrorGenerator = {
  beString(what: string): string {
    return `${what} must be a string`;
  },
  beBetween(what: string, min: number, max: number): string {
    return `${what} must be between ${min} and ${max} characters`;
  },
};
