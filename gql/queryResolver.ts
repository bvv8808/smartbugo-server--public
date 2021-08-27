import removeTag from "../lib/removeTag";

// @ts-ignore
const db = require("../db/db");
const { v4: uuidv4 } = require("uuid");

// @ts-ignore
const { getDateStr } = require("../utils/formatConverter");

const sampleToken = "e780437a-7981-4ad4-a127-937b27d1214e";

const main3 = async () => await db.getCountForMain();

// # 장례지도사 로그인 (login)
const user1 = async ({ uid, pw, deviceKind, deviceKey }) => {
  // 1. uid, pw로 회원 no 가져오기
  // 2. token 생성
  // 3. update set deviceKey, token
  // 4. return token

  const no = await db.findUser(uid, pw);
  if (no === 0) return "";

  const token = uuidv4();

  const successUpdate = await db.loginMaster(no, deviceKind, deviceKey, token);
  console.log(successUpdate);
  return successUpdate ? token : "";
};

// # 일반회원 로그인 (loginNormal)
const user2 = async ({
  name,
  phone,
  deviceKind,
  deviceKey,
  primaryValue,
  privateNum,
}) => {
  // # 일반회원 로그인
  // 1. primaryValue로 이미 존재하는 회원인지 판별
  // 2. token 생성
  // 3. 존재할 경우 update set deviceKey, token, phone, name
  // 3-1. 존재하지 않을 경우 insert
  // 4. return token

  const existId = await db.findUserByPV(primaryValue, 2);

  const token = uuidv4();
  let result = false;
  if (existId.length) {
    result = await db.updateUserNormal({
      deviceKey,
      deviceKind,
      token,
      phone,
      name,
      primaryValue,
      uid: existId,
    });
  } else {
    const newUser = await db.addUser(
      { deviceKey, deviceKind, token, phone, name, privateNum, primaryValue },
      2
    );
    result = await db.updateForNewUser(newUser.no, newUser.id, name, phone);
  }
  return result ? token : "";
};

// # 회원종류 받아오기 (getTypeByToken)
const user3 = async ({ token }) => {
  if (!(await db.authToken(token))) return 0;
  return await db.getTypeByToken(token);
};

const user4 = async ({ token }) => {
  return await db.getMaster(token);
};

// # 자신이 부의금 서비스를 신청한 부고들과 그 계좌 정보들 (getAppliedBugoAndAccount)
const account1 = async ({ token }) => {
  // 1. token으로 primaryValue 가져오기
  // 2. primaryValue로 Sangju.access가 true인 row 가져오기 (bugoId, account)
  // 3. bugoId로 부고 정보 얻어와서 붙이기
  // 4. return
  const myInfo = await db.getInfoByToken(token);

  if (!myInfo) {
    console.log("@@ 유효하지 않은 토큰");
    return [];
  }

  const { name, phone, uid } = myInfo;
  //
  // const result = await db.getAppliedBugoAndAccount(myInfo.name, myInfo.phone);
  const result = await db.getAppliedBugoAndAccount(uid);
  return result;
};

// # 자신의 정산계좌 정보 (getMyCalcAccount)
const account2 = async ({ token }) => await db.getCalcAccountByToken(token);
const account3 = async ({ token }) => {
  const uid = await db.getUidByToken(token);
  if (!uid) return 0;
  return await db.getMyCalcPrice(uid);
};
// # 부고리스트 (getBugoList)
const bugo1 = async ({ token, bugoId, page, searchKeyword }) => {
  // const uid = await db.getUidByToken(token);
  // console.log(uid, token);
  // if (!uid) return [];

  let list = [];
  if (bugoId) list = await db.getBugoById(bugoId);
  else list = await db.getBugoList({ page, searchKeyword });

  console.log(list);
  return list;
};

// # 특정 부고 상주들의 상세 데이터 (getAppliedSangju)
const bugo2 = async ({ token, bugoId }) => {
  if (!(await db.authToken(token))) return null;
  return await db.getAppliedSangju(bugoId);
};

// # 일반 회원: 자신이 속한 부고들 (getMyBugoList)
const bugo3 = async ({ token, page }) => {
  const myInfo = await db.getInfoByToken(token);
  if (!myInfo) {
    console.log("@@ 유효하지 않은 토큰");
    return [];
  }

  const { name, phone, level, uid } = myInfo;
  const a = await db.getBugoByInfo(name, phone, uid, page);
  console.log(a);
  return a;
};

// # 특정 부고의 조문 메시지
const msg1 = async ({ bugoId }) => await db.getMsgs(bugoId);

// # 지정한 카테고리에 해당하는 화환 리스트 (getFlowerByCategory)
const flower1 = async ({ token, category, page }) => {
  const categoryParser = {
    "3단 화환": 10,
    "3단 특화환": 20,
    바구니: "q0",
  };
  return await db.getFlowerByCategory(categoryParser[category], page);
};

// # 자신이 보내거나 받은 화환 내역 리스트 (getMyFlower)
const flower2 = async ({ token }) => {
  const no = await db.getUserNoByToken(token);

  if (!no) return null;
  const logs = await db.getFlowerLogOfCommon(no);
  console.log(logs);
  let sendList = [];
  let receivedList = [];
  for (let l of logs) {
    const date = new Date(l.orderTime);
    l.orderTime = `${date.getFullYear()}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;
    if (no === l.senderNo) {
      let copied = { ...l };
      delete copied.senderNo;
      delete copied.receiverNo;
      sendList.push(copied);
    }
    if (no === l.receiverNo) {
      let copied = { ...l };
      delete copied.senderNo;
      delete copied.receiverNo;
      sendList.push(copied);
    }
  }
  return { send: sendList, received: receivedList };
};
// const flower3 = async ({ token, bugoId }) => {
//   // # 특정 부고로 보내진 화환 내역
//   const result = await db.getLogFlowerByBugoId(bugoId);
//   return result;
// };
// const flower4 = async ({ token }) => {
//   // # 특정 장례지도사가 등록한 부고에 보내진 화환 내역
//   const uid = await db.getUidByToken(token);
//   const arrBugoId = await db.getBugoIdByWriter(uid);
//   let strBugoIds = "(";
//   for (let item of arrBugoId) {
//     strBugoIds += item.id + ",";
//   }
//   strBugoIds = strBugoIds.substring(0, strBugoIds.length - 1) + ")";
//   const result = await db.getLogFlowerInBugoIds(strBugoIds);

//   return result;
// };

// # 화환상품ID로 상품 데이터 받아오기 (getFlowerById)
const flower3 = async ({ fid }) => {
  return await db.getFlowerById(fid);
};

// # 특정 부고에 화환 보낸사람 (getFlowerSenderByBuoId)
const flower4 = async ({ bugoId }) => await db.getFlowerSenderOfBugo(bugoId);

// # 조문내역(장례지도사) - 부의금 서비스 (appliedService)
const log1 = async ({ token }) => {
  const uid = await db.getUidByToken(token);
  if (!uid) return [];

  const result = await db.getAccountLogByMbId(uid);
  return result.map((r) => {
    r.sangju = JSON.parse(r.sangjus)[0].wr_1_name;
    delete r.sangjus;
    return r;
  });
};

// # 조문내역(장례지도사) - 부고장 (bugoListOfMaster)
const log2 = async ({ token }) => {
  const uid = await db.getUidByToken(token);
  if (!uid) return null;
  const bugoList = await db.getBugoByWriter(uid);
  const result = bugoList.map(async (b) => {
    let newObj: any = {};
    newObj.bugoId = b.bugoId;
    newObj.deceasedName = b.deceased.name;
    newObj.funeralName = b.funeral.name;
    newObj.binso = b.funeral.binso;
    newObj.imprintTime = b.imprintTime;
    newObj.calcPrice = await db.getBugoCalcOfMaster(uid, b.bugoId);

    newObj.sangju = JSON.parse(b.sangjus)[0].wr_1_name;

    return newObj;
  });
  return result;
};

// # 조문내역(장례지도사) - 화환내역 (flowerOfMaster)
const log3 = async ({ token }) => {
  const uid = await db.getUidByToken(token);
  if (!uid) return null;

  const result = await db.getFlowerLogOfMaster(uid);

  return result.map((r) => {
    r.sangju = JSON.parse(r.sangjus)[0].wr_1_name;
    const date = new Date(r.orderTime);
    r.orderTime = `${date.getFullYear()}.${(date.getMonth() + 1)
      .toString()
      .padStart(2, "0")}.${date.getDate().toString().padStart(2, "0")}`;

    delete r.sangjus;
    return r;
  });
};

// # 화환 주문 내역 상세 데이터 (flowerOrderData)
const log4 = async ({ token, odid }) => {
  if (!(await db.getUidByToken(token))) return null;

  const result = await db.getOrderData(odid);
  return result.map((r) => {
    r.sender = { name: r.senderName, phone: r.senderPhone };
    r.receiver = { name: r.receiverName, phone: r.receiverPhone };
    r.destination = `${r.dAddr}, ${r.dDetail}`;

    delete r.senderName;
    delete r.senderPhone;
    delete r.receiverName;
    delete r.receiverPhone;
    delete r.dAddr;
    delete r.dDetail;

    return r;
  })[0];
};
const main1 = async () => await db.getTotalSangju();

const main2 = async ({ token }) => {
  const info = await db.getInfoByToken(token);
  console.log(info);
  if (!info) return "손님";
  return info.name;
};

const payment1 = async ({ token }) => {
  const { phone } = await db.getInfoByToken(token);
  return phone ?? null;
};
// # 자주묻는질문
const faq = async () => {
  const faq = await db.getFAQ();
  return faq.map((item) => {
    item.question = removeTag(item.question);
    item.answer = removeTag(item.answer);
    return item;
  });
};

const etc1 = async ({ token }) => {
  const { name, phone } = await db.getInfoByToken(token);
  return { name, phone };
};
const etc2 = async ({ title }) => await db.etcContent(title);

module.exports = {
  user1,
  user2,
  user3,
  user4,
  account1,
  account2,
  account3,
  bugo1,
  bugo2,
  bugo3,
  msg1,
  flower1,
  flower2,
  flower3,
  flower4,
  // flower5,
  log1,
  log2,
  log3,
  log4,
  faq,
  main1,
  main2,
  main3,
  payment1,
  etc1,
  etc2,
};
