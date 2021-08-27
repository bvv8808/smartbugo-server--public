const router = require("express").Router();
const db = require("./db/db");
import sendBizTalk from "./lib/BizTalk/sendBizTalk";
import impPaymentCheck from "./lib/impPaymentCheck";
import orderId from "./lib/orderId";

const getDifferenceDay = (date) => {
  if (date.split("-").length !== 3) {
    console.error('Invalid date format. Correct format is "yyyy-MM-dd".');
    return 0;
  }

  const targetDay = new Date(date).getTime();
  const now = new Date().getTime();

  return Math.round((targetDay - now) / (1000 * 60 * 60 * 24));
};
const insertComma = (money: number) => {
  const strMoney = money.toString();
  const firstPartLength = strMoney.length % 3;
  const firstPart = strMoney.slice(0, firstPartLength);
  const rest = strMoney.slice(firstPartLength);

  if (!rest) return firstPart;

  let restPart = "";
  let cnt = 0;
  for (let i = 0; i < rest.length; i++) {
    restPart += rest[i];
    if (++cnt === 3) {
      cnt = 0;
      restPart += ",";
    }
  }
  restPart = restPart.substring(0, restPart.length - 1);
  const result = firstPart ? firstPart + "," + restPart : restPart;
  return result;
};
const nowPlusHours = (hour: number) => {
  const now = new Date();
  now.getTime();

  const goal = new Date(now.getTime() + 1000 * 60 * 60 * hour);

  return `${goal.getFullYear()}년 ${
    goal.getMonth() + 1
  }월 ${goal.getDate()}일 ${goal.getHours()}시 ${goal.getMinutes()}분`;
};

const a = nowPlusHours(3);
const bloomingAccount = "국민 은행 649301-04-103886";

router.get("/obituary", async (req, res, next) => {
  const bugoId = req.query.b;
  if (!bugoId) {
    next(new Error("Invalid URL"));
    return;
  }
  // getBugoList
  // getMsgByBugoId
  // getFlowerSenderByBugoId

  let list = await db.getBugoById(bugoId);
  const msgs = await db.getMsgs(bugoId);
  const flowerSenders = await db.getFlowerSenderOfBugo(bugoId);
  const today = new Date(list[0].imprintTime.split(" ")[0]);
  const [date, time] = list[0].imprintTime.split(" ");
  const arrDate = date.split("-");
  const arrTime = time.split(":");
  const days = ["일", "월", "화", "수", "목", "금", "토"];
  days[today.getDay()];
  list[0].imprint = {};
  list[0].imprint.time = `${arrDate[0]}년 ${arrDate[1]}월 ${arrDate[2]}일 (${
    days[today.getDay()]
  }요일) ${arrTime[0]}시 ${arrTime[1]}분`;
  list[0].imprint.rest = getDifferenceDay(date);

  console.log("@@ msg : ", list[0].imprint.rest);
  res.render("obituary", {
    bugo: list[0],
    msgs: msgs.slice(0, 3),
    flowerSenders,
  });
});

router.get("/condolenceMsg", async (req, res, next) => {
  const bugoId = req.query.b;
  if (!bugoId) {
    // res.render('error', {msg: '유효하지 않은 주소'})
  }
  const msgs = await db.getMsgs(bugoId);
  console.log(msgs);
  res.render("condolenceMsg", { msgs });
});
router.get("/wreath", async (req, res, next) => {
  const bugoId = req.query.b;
  res.render("wreath", { data: { bugoId: bugoId ?? 0 } });
});
router.get("/wreathDetail", async (req, res, next) => {
  const { b: bugoId, f: flowerId } = req.query;
  db.getFlowerById(flowerId).then((flower) => {
    res.render("wreathDetail", { data: { bugoId: bugoId ?? 0, item: flower } });
  });
});
router.get("/orderForm", async (req, res, next) => {
  const { b: bugoId, f: flowerId } = req.query;
  let data: any = {};
  if (bugoId) {
    const bugoList = await db.getBugoById(bugoId);
    data.bugo = bugoList[0];
  }
  db.getFlowerById(flowerId).then((flower) => {
    data.flower = flower;
    res.render("orderForm", { data });
  });
});
router.get("/searchBugo", async (req, res, next) => {
  res.render("search", { data: { flowerId: req.query.f } });
});
// router.get("/payment", (req, res, next) => {
//   res.render("wreath", { data: { bugoId: 0, fromPayment: true } });
// });
router.post("/payment", async (req, res, next) => {
  console.log("@@@@ ", req.body);
  res.render("payment", { data: req.body });
});
router.post("/paymentBank", async (req, res, next) => {
  console.log("@@@@ ", req.body);
  res.render("paymentBank", { data: req.body });
});
router.get("/condolenceMoney", async (req, res, next) => {
  const bugoId = req.query.b;
  if (!bugoId) {
    next(new Error("Invalid URL"));
    return;
  }
  db.getAppliedSangju(bugoId).then((data) => {
    res.render("condolenceMoney", { accounts: data });
  });
});
router.get("/sendObituary", async (req, res, next) => {
  const bugoId = req.query.b;
  if (!bugoId) {
    next(new Error("Invalid URL"));
    return;
  }

  let list = await db.getBugoById(bugoId);
  if (!list.length) {
    next(new Error("Invalid URL"));
    return;
  }

  // convert time
  const [date, time] = list[0].imprintTime.split(" ");
  const arrDate = date.split("-");
  const arrTime = time.split(":");
  let ampm = "오전";
  let h = arrTime[0];
  if (arrTime[0] >= 12) {
    ampm = "오후";
    h = Number(arrTime[0]) - 12;
  }
  const deceasedTime = `${arrDate[0]}년 ${arrDate[1]}월 ${arrDate[2]}일 ${ampm} ${h}시 ${arrTime[1]}분`;

  res.render("sendObituary", {
    bugo: {
      deceasedName: list[0].deceased.name,
      sangju: JSON.parse(list[0].sangjus)[0].wr_1_name,
      deceasedTime,
      bugoId: bugoId,
    },
  });
});

router.get("/content", (req, res, next) => {
  const title = req.query.title;
  const keys = ["c1", "c2", "c3", "c4"];
  const dict = {
    c1: "전자금융거래 이용약관",
    c2: "개인정보 수집 및 이용안내",
    c3: "개인정보 제 3자 제공/위탁안내",
    c4: "개인정보 제 3자 동의 (배송 및 주문처리 목적)",
  };
  if (keys.includes(title)) {
    db.etcContent(dict[title].replace(/ /g, "")).then((content) =>
      res.render("content", { title: dict[title], content })
    );
  } else {
    db.etcContent(title).then((content) =>
      res.render("content", { title, content })
    );
  }
});

//

// [POST1] 조문 메시지 추가
router.post("/msg", (req, res, next) => {
  console.log(req.body);
  const { sender, content, bugoId } = req.body;

  db.addMsg(sender, content, bugoId).then(() => {
    res.send("success");
  });
});
router.post("/existApplied", async (req, res, next) => {
  const { bugoId } = req.body;
  if (!bugoId) {
    next(new Error("Invalid URL"));
    return;
  }
  db.getAppliedSangju(bugoId).then((data) => {
    res.send(!!data.length);
  });
});
// [POST2] 부의금 계좌 전송
router.post("/sendAccount", (req, res, next) => {
  const { account, method, phoneToSend } = req.body;
  const { name, accountName, accountBank, accountNum } = account;
  sendBizTalk(
    method,
    "serviceAccount",
    { sangju: name, accountName, accountBank, accountNum },
    phoneToSend
  )
    .then(() => {
      res.send("success");
    })
    .catch((e) => {
      console.log("@ Biz Talk Error in routes/sendAccount\n", e);
      res.send("fail");
    });
});

router.get("/wreathData", (req, res, next) => {
  const { category, page } = req.query;
  console.log("@ request Wreath Data : ", req.body);

  db.getFlowerByCategory(category, page)
    .then((list) => {
      res.json({ code: 0, list });
    })
    .catch((e) => {
      console.log("#1 Error in wreathData\n", e);
      res.json({ code: -1 });
    });
});

router.get("/bugoList", (req, res, next) => {
  const { page, keyword } = req.query;
  console.log(req.query);

  db.getBugoList({ searchKeyword: keyword, page })
    .then((list) => {
      const parsed = list.map((item) => {
        let newItem: any = {};

        const [date, time] = item.imprintTime.split(" ");

        const arrDate = date.split("-");

        newItem.bugoId = item.bugoId;
        newItem.sangju = JSON.parse(item.sangjus)[0].wr_1_name;
        newItem.deceased = item.deceased.name;
        newItem.funeral = item.funeral.name;
        newItem.binso = item.funeral.binso;
        newItem.imprint = `${arrDate[1]}/${arrDate[2]} ${time.substring(0, 5)}`;
        newItem.etc = getDifferenceDay(date) < 0 ? "발인 완료" : "상중";

        return newItem;
      });
      res.json({ list: parsed });
    })
    .catch((e) => {
      console.log("@@ bugoList : ", e);
      res.json({ list: [] });
    });
});

router.post("/payBank", async (req, res, next) => {
  console.log("@ 결제 완료 ", req.body);

  paymentProcess(req.body, false).then((odid) => res.send(odid));
});

router.get("/payment", (req, res) => {
  // # 결제 완료 화면
  const { merchant_uid: mid, imp_success: isSuccess, odid } = req.query;
  if (odid) {
    db.payment(odid, "odid").then((v) => {
      v.totalPrice = insertComma(v.price + v.deliveryFee) + "원";
      v.limitDatetime = a;
      v.account = bloomingAccount;
      v.destAddress = v.destAddress.split("/")[0];
      res.render("afterPayment", { data: v });
    });
    return;
  }
  if (isSuccess === "false") {
    console.log("!!!!");
    res.render("afterPayment", { data: { isSuccess: false, code: 1 } });
    return;
  }

  impPaymentCheck(mid)
    .then((r) => {
      console.log("#2 : ", mid);
      if (r.code === 0) return db.payment(mid, "mid");
      else return null;
    })
    .then(async (v) => {
      console.log("@ v @", v);
      if (!v) {
        res.render("afterPayment", { data: { isSuccess: false, code: 2 } });

        return null;
      }
      const now = new Date();

      const today = `${now.getFullYear()}/${(now.getMonth() + 1)
        .toString()
        .padStart(2, "0")}/${now.getDate().toString().padStart(2, "0")}`;
      const body = {
        price: `${v.price + v.deliveryFee}`,
        odid: v.odid,
        today,
        itemName: v.flowerName,
      };
      await sendBizTalk(
        // input.billing.bizTalkType,
        "at",
        "afterFlower",
        body,
        v.ordererPhone
      );
      v.totalPrice = insertComma(v.price + v.deliveryFee) + "원";
      v.limitDatetime = "입금 기한 : " + a;
      v.account = bloomingAccount;
      v.destAddress = v.destAddress.split("/")[0];
      res.render("afterPayment", { data: v });
    });
});

router.post("/registerMid", (req, res) => {
  console.log("@@ registerMid @@ ", req.body);
  paymentProcess(req.body, true);
  res.send("ok");
});

const paymentProcess = async (payload, cardReady) => {
  const s = JSON.parse(payload.sangju);
  const sangju = {
    name: s.wr_1_name,
    relation: s.wr_1_type,
    phone: s.wr_1_tel,
  };

  const destination = {
    address: payload.dest.split(",")[1],
    detail: payload.dest.split(",")[0],
    memo: payload.memo,
  };
  const flower = JSON.parse(payload.flower);
  const orderer = JSON.parse(payload.orderer);

  const receiver = await db.getUserByInfo(sangju);
  const odid = orderId();

  const bugo = (await db.getBugoById(payload.bugoId))[0];

  const wreathResult = await db.addFlowerLog(
    odid,
    orderer,
    payload.phrase.split(","),
    flower,
    destination,
    payload.billing,
    sangju,
    bugo.bugoId,
    bugo.deceased.name
  );

  // const orderResult = await db.addOrderFlower(
  //   odid,
  //   null,
  //   orderer,
  //   destination,
  //   flower,
  //   payload.billing,
  //   bugo.bugoId,
  //   sangju,
  //   cardReady
  // );
  db.addOrderFlower(
    odid,
    null,
    orderer,
    destination,
    flower,
    payload.billing,
    bugo.bugoId,
    sangju,
    cardReady
  )
    .then((r) => {
      console.log("success!! ", r);
    })
    .catch((e) => {
      console.log(`fail!! `, e);
    });

  const accountResult = await db.addCalcLog_flower(
    odid,
    receiver ?? { ...sangju, level: 2 },
    payload.billing.method === "무통장" ? "대기" : "완료",
    flower
  );

  if (payload.billing.method === "무통장") {
    // 입금 계좌 안내 비즈톡 발송
    const bloomingAccount = {
      bank: "KB 국민은행",
      num: "649301-04-103886",
    };
    const body = {
      accountBank: bloomingAccount.bank,
      accountNum: bloomingAccount.num,
      consumer: sangju.name,
      price: flower.price + flower.deliveryFee,
    };
    await sendBizTalk(payload.bizType, "flowerDeposit", body, orderer.phone);
  }

  return odid;
};

module.exports = router;
