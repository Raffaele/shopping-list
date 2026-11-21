/** Case-insensitive identity of a remembered name. */
export function toSuggestionKey(name: string): string {
  return name.trim().toLowerCase();
}
