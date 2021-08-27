import axios from "axios";

export default async (x: number, y: number) => {
  const result = await axios.get(
    `https://apis.openapi.sk.com/tmap/geo/coordconvert?version=1&lat=${y}&lon=${x}&fromCoord=KATECH&toCoord=WGS84GEO&appKey=${process.env.TMAP_KEY}`
  );
  const { lat, lon } = result.data.coordinate;

  return `${lat}/${lon}`;
};
