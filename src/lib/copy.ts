/** Clipboard writes reject when the document isn't focused, the page isn't in a
 *  secure context, or the permission is denied. Returning a boolean lets callers
 *  skip the success tick — and the analytics event — for a copy that never
 *  actually happened. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
