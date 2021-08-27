export default () => {
  const date = new Date();
  const r = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(5, "0");
  console.log(r);
  return date.getTime().toString() + r;
};
