module.exports = (bugo) => {
  bugo.funeral = {
    name: bugo.funeralName,
    address: bugo.funeralAddr,
    binso: bugo.binso,
  };
  if (bugo.xy) {
    const xy = bugo.xy.split("/");
    bugo.funeral.x = xy[0];
    bugo.funeral.y = xy[1];
  }
  bugo.deceased = {
    name: bugo.deceasedName,
    age: bugo.deceasedAge,
    time: bugo.deceasedTime,
    gender: bugo.deceasedGender,
  };
  delete bugo.funeralName;
  delete bugo.funeralAddr;
  delete bugo.binso;
  delete bugo.xy;
  delete bugo.deceasedName;
  delete bugo.deceasedAge;
  delete bugo.deceasedTime;
  delete bugo.deceasedGender;

  return bugo;
};
