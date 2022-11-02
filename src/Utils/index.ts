export function debounce(func: Function, timeout = 300) {
  let timer: number;
  return () => {
    clearTimeout(timer);
    timer = setTimeout(() => { func(); }, timeout);
  };
}