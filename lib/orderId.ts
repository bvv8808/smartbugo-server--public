export default () => {
  const date = new Date();
  const arrDT = [
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate(),
    date.getHours() + 1,
    date.getMinutes(),
    date.getSeconds(),
    Math.round(date.getMilliseconds() / 10),
  ];
  return arrDT.map((dt) => dt.toString().padStart(2, "0")).join("");
};
