import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const uniqueSorted = <T>(arr: T[]): T[] => [...new Set(arr)].toSorted();

/**
 * Shamelessly stolen from ts-essentials
 * @see https://github.com/ts-essentials/ts-essentials/
 */
export type StrictExtract<Type, Union extends Partial<Type>> = Extract<
  Type,
  Union
>;
