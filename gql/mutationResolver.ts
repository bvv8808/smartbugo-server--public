// @ts-ignore

import orderId from "../lib/orderId";

import sendBizTalk from "../lib/BizTalk/sendBizTalk";
import impPaymentCheck from "../lib/impPaymentCheck";

// @ts-ignore
const qs = require("querystring");
// const bankCodeBook = require("../lib/bankCode");
const authAccount = require("../lib/authAccount");

// @ts-ignore
const db = require("../db/db");

const user1 = async ({ input }) => {
  // # 장례지도사 회원가입

  return !!(await db.addUser(input, 3)).no;
};
const user2 = async ({ code }) => {
  // # 영업사원코드 확인
  const result = await db.confirmCode(code);
  return !!result;
};
const user3 = async ({ uid }) => {
  // # 영업사원 아이디 중복체크
  return await db.checkId(uid);
};
const user4 = async ({ di }) => !!(await db.findUserByPV(di, 3));
const user5 = async ({ input }) => await db.updateMaster(input);
const account1 = async ({ mode, token, odid, account }) => {
  // # 정산 계좌나 부의금 서비스 등록
  const { name, bank, num } = account;
  if (mode === "calc") {
    const authResult = await authAccount(name, bank, num);
    if (!authResult) return { code: 1, msg: "유효하지 않은 계좌 정보입니다" };

    // const no = await db.getUserNoByToken(token)
    const result = await db.applyCalcAccount(token, name, bank, num);
    return result
      ? { code: 0, msg: "" }
      : { code: 2, msg: "내부 오류로 실패했습니다" };
  } else if (mode === "service") {
    const authResult = await authAccount(name, bank, num);
    if (!authResult) return { code: 1, msg: "유효하지 않은 계좌 정보입니다" };
    const result = await db.updateServiceAccount(odid, name, bank, num);
    return result
      ? { code: 0, msg: "" }
      : { code: 2, msg: "내부 오류로 실패했습니다" };
  }

  return true;
};
const account2 = async ({ token, account }) => {
  // # 계좌 인증
  if (!db.authToken(token)) {
    console.warn("@ mut.account2 : 토큰 인증 실패");
    return false;
  }
  const { name, bank, num } = account;
  return authAccount(name, bank, num);
};
const msg1 = async ({ token, sender, msg, bugoId }) => {
  // # 부고 메시지 남기기
  console.log("##: ", sender, msg, bugoId);
  if (!(await db.authToken(token))) return false;
  const result = await db.addMsg(sender, msg, bugoId);
  return result;
};
const bugo1 = async ({ token, input }) => {
  // # 부고 생성
  console.log("!! ", input);
  try {
    const writer = await db.getUidByToken(token);
    const createdBugoId = await db.addBugo(input, writer);
    // const sangjus = JSON.parse(input.sangjus);
    // const failedCount = await db.addSangjus(sangjus, createdBugoId);
    // console.log("등록 실패한 상주 수: ", failedCount);
    return createdBugoId;
    return 0;
  } catch (e) {
    console.log("# Error in mutationResolver.bugo1\n", e);
    return 0;
  }
};
const bugo2 = async ({ token, bugoId, input }) => {
  // # 부고 수정
  try {
    await db.updateBugo(input, bugoId);
    // const sangjus = JSON.parse(input.sangjus);
    // const failedCount = await db.addSangjus(sangjus, bugoId);
    // console.log("등록 실패한 상주 수: ", failedCount);
    return true;
  } catch (e) {
    console.log("# Error in mutationResolver.bugo1\n", e);
    return false;
  }
};

const bugo3 = async ({ token, bugoId }) => {
  // # 부고 삭제
  try {
    if (!(await db.authToken(token))) return false;
    return await db.deleteBugo(bugoId);
  } catch (e) {
    console.log("# Error in mutationResolver.bugo1\n", e);
    return false;
  }
};

const send1 = async ({ token, mode, phone, odid }) => {
  // # 부의금 계좌를 문자나 카톡으로 전송
  // mode: at | lms

  const uid = await db.getUidByToken(token);
  console.log(uid, mode, phone, odid);
  if (!uid) return false;

  const appliedLog = await db.getAppliedLogByOdid(odid);
  // accountName, accountBank, accountNum, sangju

  console.log(await sendBizTalk(mode, "serviceAccount", appliedLog, phone));

  return true;
};

const payment1 = async ({ token, input }) => {
  // # 화환 결제 처리
  console.log(token, input);

  // 결제한 사람
  const myInfo = await db.getInfoByToken(token);
  if (!myInfo) return { code: -1, msg: "유효하지 않은 토큰입니다" };

  // // 화환 받는 상주
  const receiver = await db.getUserByInfo(input.sangju);

  const { name, phone, level, uid, code } = myInfo;
  const odid = orderId();

  // custom_wreath에 추가
  const wreathResult = await db.addFlowerLog(
    odid,
    input.orderPerson,
    input.phrases,
    input.flower,
    input.destination,
    input.billing,
    input.sangju,
    input.bugoId,
    input.deceasedName
  );
  if (!wreathResult) return { code: 1, msg: "내부 오류로 인해 실패했습니다" };

  // g5_shop_order에 추가
  const orderResult = await db.addOrderFlower(
    odid,
    myInfo,
    input.orderPerson,
    input.destination,
    input.flower,
    input.billing,
    input.bugoId,
    input.sangju
  );
  if (!orderResult) return { code: 2, msg: "내부 오류로 인해 실패했습니다" };

  // custom_account에 추가 (장례지도사가 대행한 경우, 일반회원이 보낸 경우 구분)

  // 화환 받은 상주에게 정산 항목 등록
  const accountResult = await db.addCalcLog_flower(
    odid,
    receiver ?? { ...input.sangju, level: 2 },
    input.billing.method === "무통장" ? "대기" : "완료",
    input.flower
  );
  if (!accountResult) return { code: 3, msg: "내부 오류로 인해 실패했습니다" };

  // // 장례지도사가 대행한 경우: 해당 장례지도사에게 정산 항목 등록
  if (level === 3) {
    const accountResult = await db.addCalcLog_flower(
      odid,
      myInfo,
      input.billing.method === "무통장" ? "대기" : "완료",
      input.flower
    );
    if (!accountResult)
      return { code: 3, msg: "내부 오류로 인해 실패했습니다" };
  }

  if (input.billing.method === "무통장") {
    // 입금 계좌 안내 비즈톡 발송
    const bloomingAccount = {
      bank: "KB 국민은행",
      num: "649301-04-103886",
    };
    const body = {
      accountBank: bloomingAccount.bank,
      accountNum: bloomingAccount.num,
      consumer: input.sangju.name,
      price: input.flower.price + input.flower.deliveryFee,
    };
    await sendBizTalk(
      input.billing.bizTalkType,
      "flowerDeposit",
      body,
      input.orderPerson.phone
    );
  } else {
    // 결제 완료 비즈톡 발송
    const now = new Date();

    const today = `${now.getFullYear()}/${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}/${now.getDate().toString().padStart(2, "0")}`;
    const body = {
      price: `${input.flower.price + input.flower.deliveryFee}`,
      odid,
      today,
      itemName: input.flower.name,
    };
    await sendBizTalk(
      // input.billing.bizTalkType,
      "at",
      "afterFlower",
      body,
      input.orderPerson.phone
    );
  }

  return { code: 0, msg: "성공" };
};
const payment2 = async ({ token, input }) => {
  // # 부의금 서비스 신청 처리

  // 부의금서비스 신청 가격
  const servicePrice = await db.getServicePrice();

  // 결제한 사람
  const myInfo = await db.getUserByToken(token);
  if (!myInfo) return { code: -1, msg: "유효하지 않은 토큰입니다" };

  // 부의금서비스 신청 대상 (상주)
  const appliedInfo = await db.getUserByInfo(input.sangju);

  input.sangju.relation = await db.getSangjuRelationByInfo(
    input.sangju.name,
    input.sangju.phone
  );
  const { name, phone, level, uid, code } = myInfo;
  const odid = orderId();

  // 부의금서비스 신청내역 추가
  const applyResult = await db.addAppliedLog({
    input,
    odid,
    appliedInfo,
    masterId: level === 3 ? uid : null,
  });

  // 정산내역에 추가 (장례지도사)
  if (level === 3) {
    const moneyCode = code.split(":")[1];
    const calcPrice = moneyCode.length
      ? servicePrice * (Number(moneyCode.split(".")[1]) / 100)
      : 0;

    const calcResult = await db.addCalcLog_money({
      odid,
      uid,
      level,
      name,
      sname: null,
      sphone: null,
      price: servicePrice,
      calcPrice,
    });
    if (!calcResult) return { code: -1, msg: "내부 오류로 실패 했습니다" };
  }
  // 결제내역에 추가
  await db.addOrder(odid, input, myInfo, servicePrice);

  // 무통장입금일 경우 비즈톡 발송
  if (input.billing.method === "무통장") {
    const bloomingAccount = {
      bank: "KB 국민은행",
      num: "649301-04-103886",
    };
    const body = {
      accountBank: bloomingAccount.bank,
      accountNum: bloomingAccount.num,
      consumer: input.sangju.name,
      price: "4,900",
    };
    await sendBizTalk(
      input.billing.bizTalkType,
      "serviceDeposit",
      body,
      input.sangju.phone
    );
  }

  return { code: 0, msg: "성공" };
};

// 부의금 서비스 신청 가능한 상주인지 확인
const payment3 = async ({ bugoId, sangju }) =>
  await db.appliableSangju(bugoId, sangju);

// 결제 성공 여부 확인
const payment4 = async ({ token, mid }) => await impPaymentCheck(mid);
const counsel = async ({ token, email, content }) => {
  // # 1:1문의하기
  const user = await db.getUserByToken(token);
  if (!user) return false;
  return await db.addCounsel(email, content, user.mb_id, user.mb_name);
};
const leave = async ({ token, memo }) => {
  // # 회원 탈퇴
  console.log("!!", token, memo);
  return await db.leaveUser(token, memo);
};

const etc1 = async ({ countType }) => {
  await db.plusCount(countType);
};

const test = async () => {
  const now = new Date();

  const today = `${now.getFullYear()}/${(now.getMonth() + 1)
    .toString()
    .padStart(2, "0")}/${now.getDate().toString().padStart(2, "0")}`;
  const body = {
    price: `10,000`,
    odid: "202105171234",
    today,
    itemName: "화환1",
  };
  await sendBizTalk(
    // input.billing.bizTalkType,
    "at",
    "afterFlower",
    body,
    "01073763452"
  );

  return true;
};

module.exports = {
  user1,
  user2,
  user3,
  user4,
  user5,
  account1,
  account2,
  msg1,
  bugo1,
  bugo2,
  bugo3,
  send1,
  payment1,
  payment2,
  payment3,
  payment4,
  counsel,
  leave,
  etc1,
  test,
};
