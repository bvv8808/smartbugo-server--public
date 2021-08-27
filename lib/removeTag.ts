export default (str: string) => {
  let skip = false;
  let removed = "";
  for (const c of str) {
    if (c === "<") {
      skip = true;
      continue;
    } else if (c === ">") {
      skip = false;
      continue;
    }
    !skip && (removed += c);
  }
  console.log(removed);
  return removed;
};
