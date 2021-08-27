const axios = require("axios");

export default async () => {
  try {
    const result = await axios.post(
      "https://api.bizppurio.com/v1/token",
      {},
      {
        headers: {
          Authorization: `Basic ${process.env.BIZ}`,
        },
      }
    );

    return result.data;
  } catch (e) {
    console.log("@ Error in getBizToken \n", e);
  }
};
