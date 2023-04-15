export const wait = (time: number): Promise<number> =>
  new Promise<number>((res) => setTimeout(res, time));

export default wait;
