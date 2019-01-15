/**
 * 256 * 3 * w * h = length
 * w ~= h
 *
 * 256 * 3 * r^2 = length
 *           r^2 = length / 256 / 3
 *           r   = sqrt (length / 256 / 3)
 * */
export function dataSizeToImageSize(length: number) {
  const n=Math.floor( length / 256 / 3);
  const h=Math.floor(Math.sqrt(n));
  const w=n/h;
  return [w,h]
}


