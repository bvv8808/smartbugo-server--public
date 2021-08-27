import getBizToken from "./getBizToken";
import template from "./msgTemplate";
import axios from "axios";
const dict: Payload = {
  accountName: "#{예금주}",
  accountBank: "#{은행}",
  accountNum: "#{계좌}",
  sangju: "#{상주}",
  consumer: "#{고객명}",
  price: "#{가격}",
  itemName: "#{상품명}",
  tel: "#{대표전화}",
  odid: "#{주문번호}",
  today: "#{오늘날짜}",
};
const staticDict = [
  ["#{앱링크}", "kakao2611e2bcedae961efdc1ad282a6fb4c6://link/"],
];

type TemplateType =
  | "serviceDeposit"
  | "serviceAccount"
  | "afterFlower"
  | "flowerDeposit"
  | "sample";
type Payload = {
  accountName?: string;
  accountBank?: string;
  accountNum?: string;
  sangju?: string;
  consumer?: string;
  price?: string;
  itemName?: string;
  tel?: string;
  today?: string;
  odid?: string;
};

export default async (
  mode: "at" | "lms",
  templateType: TemplateType,
  payload: Payload,
  phoneToSend
) => {
  try {
    const token = await getBizToken();
    const tem = template[templateType];

    let msgBody = tem.body;

    for (let entry of Object.entries(payload)) {
      console.log(entry[0], entry[1], dict[entry[0]]);
      msgBody = msgBody.replace(dict[entry[0]], entry[1]);
    }

    msgBody = msgBody.replace("#{대표전화}", "02-1588-0007");

    let apiBody: any = {
      account: "ioplanit",
      type: mode,
      from: "15880007",
      to: phoneToSend,
      refkey: process.env.REFKEY,
      content: {},
    };

    if (mode === "at") {
      apiBody.content.at = {
        senderkey: process.env.BIZ_PROFILE_KEY,
        templatecode: tem.code,
        message: msgBody,
      };
    } else if (mode === "lms") {
      apiBody.content.lms = {
        subject: tem.name,
        message: msgBody,
        // file: [
        //   {
        //     type: "IMG",
        //     key: process.env.LOGO_IMG_KEY,
        //   },
        // ],
      };
    }

    if (templateType === "afterFlower") {
      apiBody.content.at.button = [
        {
          name: "앱 바로가기",
          type: "AL",
          scheme_android: "kakao052b379246fc01d7ae997bfe927b53d5://link",
          scheme_ios: "kakao052b379246fc01d7ae997bfe927b53d5://link",
        },
      ];
    }

    console.log("@ sendBizTalk : apiBody @\n", JSON.stringify(apiBody));

    const result = await axios.post(
      "https://api.bizppurio.com/v3/message",
      apiBody,
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          Authorization: `${token.type} ${token.accesstoken}`,
        },
      }
    );

    return result.data;
  } catch (e) {
    console.log("@ Error in sendBizTalk \n", e.data);
    return null;
  }
};
