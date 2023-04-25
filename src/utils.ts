export async function retry<T>(fn: () => Promise<T>, count = 5) {
  for (let i = 0, time = 1000; i < count; i++) {
    try {
      const r = await fn();
      return r;
    } catch (error) {
      if (i + 1 === count) {
        throw error;
      }
      await sleep(time);
      if (time * 2 <= 2 * 60 * 1000) {
        time = time * 2;
      }
    }
  }
  throw new Error('Did not run retry function');
}

export function sleep(ms: number): Promise<void> {
  return new Promise((res) => {
    setTimeout(() => res(), ms);
  });
}

export function padLeft(text: string, length: number, space = ' ') {
  return space.repeat(length - text.length) + text;
}
