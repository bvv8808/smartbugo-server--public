const axios = require("axios");
// @ts-ignore
const bankCodeBook = require("./bankCode");
// @ts-ignore
const qs = require("querystring");

module.exports = async (name, bank, num) => {
  try {
    const body = {
      imp_key: process.env.IMP_KEY,
      imp_secret: process.env.IMP_SECRET,
    };

    const tokenResult = await axios.post(
      "https://api.iamport.kr/users/getToken",
      body
    );
    const token = tokenResult.data.response.access_token;

    const authBody = {
      bank_code: bankCodeBook[bank],
      bank_num: num,
    };
    const authResult = await axios.get(
      `https://api.iamport.kr/vbanks/holder?${qs.stringify(authBody)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (authResult.data.code !== 0)
      throw new Error("[authResult.data.code !== 0]");

    return authResult.data.response.bank_holder === name;
  } catch (e) {
    console.error("# Error in mutationResolver.account2\n", e);
    return false;
  }
};
