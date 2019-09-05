/**
 * @param bytes {number} input number
 * @param decimal {number} decimal unit
 * @param format {boolean} output unit format
 */
export default function(bytes, decimal = 2, format = true) {
  if (bytes == 0) {
    return "0 Byte";
  }
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let x = 0;
  let bytes_copy = bytes;
  while (bytes_copy >= k) {
    bytes_copy /= k;
    x++;
  }
  let formated_nr = parseFloat(bytes_copy.toFixed(decimal));
  if (format) {
    return formated_nr + sizes[x];
  }
  return formated_nr;
}
