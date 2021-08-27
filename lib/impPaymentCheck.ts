import axios from "axios";

export default async (mid: string) => {
  try {
    const tokenObj = (
      await axios.post("https://api.iamport.kr/users/getToken", {
        imp_key: process.env.IMP_KEY,
        imp_secret: process.env.IMP_SECRET,
      })
    ).data;

    if (tokenObj.code !== 0)
      return { code: tokenObj.code, msg: tokenObj.message };
    const accessToken = tokenObj.response.access_token;

    console.log(`## https://api.iamport.kr/payments/find/${mid}`);
    const findResult = (
      await axios.get(`https://api.iamport.kr/payments/find/${mid}`, {
        headers: {
          Authorization: accessToken,
        },
      })
    ).data;
    if (findResult.code !== 0)
      return { code: findResult.code, msg: findResult.message };

    return { code: 0, msg: "success" };
  } catch (e) {
    console.log(e.data);
    return { code: -1, msg: "" };
  }
};
