"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var router = require("express").Router();
var db = require("./db/db");
var sendBizTalk_1 = require("./lib/BizTalk/sendBizTalk");
var impPaymentCheck_1 = require("./lib/impPaymentCheck");
var orderId_1 = require("./lib/orderId");
var getDifferenceDay = function (date) {
    if (date.split("-").length !== 3) {
        console.error('Invalid date format. Correct format is "yyyy-MM-dd".');
        return 0;
    }
    var targetDay = new Date(date).getTime();
    var now = new Date().getTime();
    return Math.round((targetDay - now) / (1000 * 60 * 60 * 24));
};
var insertComma = function (money) {
    var strMoney = money.toString();
    var firstPartLength = strMoney.length % 3;
    var firstPart = strMoney.slice(0, firstPartLength);
    var rest = strMoney.slice(firstPartLength);
    if (!rest)
        return firstPart;
    var restPart = "";
    var cnt = 0;
    for (var i = 0; i < rest.length; i++) {
        restPart += rest[i];
        if (++cnt === 3) {
            cnt = 0;
            restPart += ",";
        }
    }
    restPart = restPart.substring(0, restPart.length - 1);
    var result = firstPart ? firstPart + "," + restPart : restPart;
    return result;
};
var nowPlusHours = function (hour) {
    var now = new Date();
    now.getTime();
    var goal = new Date(now.getTime() + 1000 * 60 * 60 * hour);
    return goal.getFullYear() + "\uB144 " + (goal.getMonth() + 1) + "\uC6D4 " + goal.getDate() + "\uC77C " + goal.getHours() + "\uC2DC " + goal.getMinutes() + "\uBD84";
};
var a = nowPlusHours(3);
var bloomingAccount = "국민 은행 649301-04-103886";
router.get("/obituary", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bugoId, list, msgs, flowerSenders, today, _a, date, time, arrDate, arrTime, days;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                bugoId = req.query.b;
                if (!bugoId) {
                    next(new Error("Invalid URL"));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db.getBugoById(bugoId)];
            case 1:
                list = _b.sent();
                return [4 /*yield*/, db.getMsgs(bugoId)];
            case 2:
                msgs = _b.sent();
                return [4 /*yield*/, db.getFlowerSenderOfBugo(bugoId)];
            case 3:
                flowerSenders = _b.sent();
                today = new Date(list[0].imprintTime.split(" ")[0]);
                _a = list[0].imprintTime.split(" "), date = _a[0], time = _a[1];
                arrDate = date.split("-");
                arrTime = time.split(":");
                days = ["일", "월", "화", "수", "목", "금", "토"];
                days[today.getDay()];
                list[0].imprint = {};
                list[0].imprint.time = arrDate[0] + "\uB144 " + arrDate[1] + "\uC6D4 " + arrDate[2] + "\uC77C (" + days[today.getDay()] + "\uC694\uC77C) " + arrTime[0] + "\uC2DC " + arrTime[1] + "\uBD84";
                list[0].imprint.rest = getDifferenceDay(date);
                console.log("@@ msg : ", list[0].imprint.rest);
                res.render("obituary", {
                    bugo: list[0],
                    msgs: msgs.slice(0, 3),
                    flowerSenders: flowerSenders,
                });
                return [2 /*return*/];
        }
    });
}); });
router.get("/condolenceMsg", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bugoId, msgs;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                bugoId = req.query.b;
                if (!bugoId) {
                    // res.render('error', {msg: '유효하지 않은 주소'})
                }
                return [4 /*yield*/, db.getMsgs(bugoId)];
            case 1:
                msgs = _a.sent();
                console.log(msgs);
                res.render("condolenceMsg", { msgs: msgs });
                return [2 /*return*/];
        }
    });
}); });
router.get("/wreath", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bugoId;
    return __generator(this, function (_a) {
        bugoId = req.query.b;
        res.render("wreath", { data: { bugoId: bugoId !== null && bugoId !== void 0 ? bugoId : 0 } });
        return [2 /*return*/];
    });
}); });
router.get("/wreathDetail", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bugoId, flowerId;
    return __generator(this, function (_b) {
        _a = req.query, bugoId = _a.b, flowerId = _a.f;
        db.getFlowerById(flowerId).then(function (flower) {
            res.render("wreathDetail", { data: { bugoId: bugoId !== null && bugoId !== void 0 ? bugoId : 0, item: flower } });
        });
        return [2 /*return*/];
    });
}); });
router.get("/orderForm", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, bugoId, flowerId, data, bugoList;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.query, bugoId = _a.b, flowerId = _a.f;
                data = {};
                if (!bugoId) return [3 /*break*/, 2];
                return [4 /*yield*/, db.getBugoById(bugoId)];
            case 1:
                bugoList = _b.sent();
                data.bugo = bugoList[0];
                _b.label = 2;
            case 2:
                db.getFlowerById(flowerId).then(function (flower) {
                    data.flower = flower;
                    res.render("orderForm", { data: data });
                });
                return [2 /*return*/];
        }
    });
}); });
router.get("/searchBugo", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        res.render("search", { data: { flowerId: req.query.f } });
        return [2 /*return*/];
    });
}); });
// router.get("/payment", (req, res, next) => {
//   res.render("wreath", { data: { bugoId: 0, fromPayment: true } });
// });
router.post("/payment", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("@@@@ ", req.body);
        res.render("payment", { data: req.body });
        return [2 /*return*/];
    });
}); });
router.post("/paymentBank", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("@@@@ ", req.body);
        res.render("paymentBank", { data: req.body });
        return [2 /*return*/];
    });
}); });
router.get("/condolenceMoney", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bugoId;
    return __generator(this, function (_a) {
        bugoId = req.query.b;
        if (!bugoId) {
            next(new Error("Invalid URL"));
            return [2 /*return*/];
        }
        db.getAppliedSangju(bugoId).then(function (data) {
            res.render("condolenceMoney", { accounts: data });
        });
        return [2 /*return*/];
    });
}); });
router.get("/sendObituary", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bugoId, list, _a, date, time, arrDate, arrTime, ampm, h, deceasedTime;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                bugoId = req.query.b;
                if (!bugoId) {
                    next(new Error("Invalid URL"));
                    return [2 /*return*/];
                }
                return [4 /*yield*/, db.getBugoById(bugoId)];
            case 1:
                list = _b.sent();
                if (!list.length) {
                    next(new Error("Invalid URL"));
                    return [2 /*return*/];
                }
                _a = list[0].imprintTime.split(" "), date = _a[0], time = _a[1];
                arrDate = date.split("-");
                arrTime = time.split(":");
                ampm = "오전";
                h = arrTime[0];
                if (arrTime[0] >= 12) {
                    ampm = "오후";
                    h = Number(arrTime[0]) - 12;
                }
                deceasedTime = arrDate[0] + "\uB144 " + arrDate[1] + "\uC6D4 " + arrDate[2] + "\uC77C " + ampm + " " + h + "\uC2DC " + arrTime[1] + "\uBD84";
                res.render("sendObituary", {
                    bugo: {
                        deceasedName: list[0].deceased.name,
                        sangju: JSON.parse(list[0].sangjus)[0].wr_1_name,
                        deceasedTime: deceasedTime,
                        bugoId: bugoId,
                    },
                });
                return [2 /*return*/];
        }
    });
}); });
router.get("/content", function (req, res, next) {
    var title = req.query.title;
    var keys = ["c1", "c2", "c3", "c4"];
    var dict = {
        c1: "전자금융거래 이용약관",
        c2: "개인정보 수집 및 이용안내",
        c3: "개인정보 제 3자 제공/위탁안내",
        c4: "개인정보 제 3자 동의 (배송 및 주문처리 목적)",
    };
    if (keys.includes(title)) {
        db.etcContent(dict[title].replace(/ /g, "")).then(function (content) {
            return res.render("content", { title: dict[title], content: content });
        });
    }
    else {
        db.etcContent(title).then(function (content) {
            return res.render("content", { title: title, content: content });
        });
    }
});
//
// [POST1] 조문 메시지 추가
router.post("/msg", function (req, res, next) {
    console.log(req.body);
    var _a = req.body, sender = _a.sender, content = _a.content, bugoId = _a.bugoId;
    db.addMsg(sender, content, bugoId).then(function () {
        res.send("success");
    });
});
router.post("/existApplied", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var bugoId;
    return __generator(this, function (_a) {
        bugoId = req.body.bugoId;
        if (!bugoId) {
            next(new Error("Invalid URL"));
            return [2 /*return*/];
        }
        db.getAppliedSangju(bugoId).then(function (data) {
            res.send(!!data.length);
        });
        return [2 /*return*/];
    });
}); });
// [POST2] 부의금 계좌 전송
router.post("/sendAccount", function (req, res, next) {
    var _a = req.body, account = _a.account, method = _a.method, phoneToSend = _a.phoneToSend;
    var name = account.name, accountName = account.accountName, accountBank = account.accountBank, accountNum = account.accountNum;
    sendBizTalk_1.default(method, "serviceAccount", { sangju: name, accountName: accountName, accountBank: accountBank, accountNum: accountNum }, phoneToSend)
        .then(function () {
        res.send("success");
    })
        .catch(function (e) {
        console.log("@ Biz Talk Error in routes/sendAccount\n", e);
        res.send("fail");
    });
});
router.get("/wreathData", function (req, res, next) {
    var _a = req.query, category = _a.category, page = _a.page;
    console.log("@ request Wreath Data : ", req.body);
    db.getFlowerByCategory(category, page)
        .then(function (list) {
        res.json({ code: 0, list: list });
    })
        .catch(function (e) {
        console.log("#1 Error in wreathData\n", e);
        res.json({ code: -1 });
    });
});
router.get("/bugoList", function (req, res, next) {
    var _a = req.query, page = _a.page, keyword = _a.keyword;
    console.log(req.query);
    db.getBugoList({ searchKeyword: keyword, page: page })
        .then(function (list) {
        var parsed = list.map(function (item) {
            var newItem = {};
            var _a = item.imprintTime.split(" "), date = _a[0], time = _a[1];
            var arrDate = date.split("-");
            newItem.bugoId = item.bugoId;
            newItem.sangju = JSON.parse(item.sangjus)[0].wr_1_name;
            newItem.deceased = item.deceased.name;
            newItem.funeral = item.funeral.name;
            newItem.binso = item.funeral.binso;
            newItem.imprint = arrDate[1] + "/" + arrDate[2] + " " + time.substring(0, 5);
            newItem.etc = getDifferenceDay(date) < 0 ? "발인 완료" : "상중";
            return newItem;
        });
        res.json({ list: parsed });
    })
        .catch(function (e) {
        console.log("@@ bugoList : ", e);
        res.json({ list: [] });
    });
});
router.post("/payBank", function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        console.log("@ 결제 완료 ", req.body);
        paymentProcess(req.body, false).then(function (odid) { return res.send(odid); });
        return [2 /*return*/];
    });
}); });
router.get("/payment", function (req, res) {
    // # 결제 완료 화면
    var _a = req.query, mid = _a.merchant_uid, isSuccess = _a.imp_success, odid = _a.odid;
    if (odid) {
        db.payment(odid, "odid").then(function (v) {
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
    impPaymentCheck_1.default(mid)
        .then(function (r) {
        console.log("#2 : ", mid);
        if (r.code === 0)
            return db.payment(mid, "mid");
        else
            return null;
    })
        .then(function (v) { return __awaiter(void 0, void 0, void 0, function () {
        var now, today, body;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("@ v @", v);
                    if (!v) {
                        res.render("afterPayment", { data: { isSuccess: false, code: 2 } });
                        return [2 /*return*/, null];
                    }
                    now = new Date();
                    today = now.getFullYear() + "/" + (now.getMonth() + 1)
                        .toString()
                        .padStart(2, "0") + "/" + now.getDate().toString().padStart(2, "0");
                    body = {
                        price: "" + (v.price + v.deliveryFee),
                        odid: v.odid,
                        today: today,
                        itemName: v.flowerName,
                    };
                    return [4 /*yield*/, sendBizTalk_1.default(
                        // input.billing.bizTalkType,
                        "at", "afterFlower", body, v.ordererPhone)];
                case 1:
                    _a.sent();
                    v.totalPrice = insertComma(v.price + v.deliveryFee) + "원";
                    v.limitDatetime = "입금 기한 : " + a;
                    v.account = bloomingAccount;
                    v.destAddress = v.destAddress.split("/")[0];
                    res.render("afterPayment", { data: v });
                    return [2 /*return*/];
            }
        });
    }); });
});
router.post("/registerMid", function (req, res) {
    console.log("@@ registerMid @@ ", req.body);
    paymentProcess(req.body, true);
    res.send("ok");
});
var paymentProcess = function (payload, cardReady) { return __awaiter(void 0, void 0, void 0, function () {
    var s, sangju, destination, flower, orderer, receiver, odid, bugo, wreathResult, accountResult, bloomingAccount_1, body;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                s = JSON.parse(payload.sangju);
                sangju = {
                    name: s.wr_1_name,
                    relation: s.wr_1_type,
                    phone: s.wr_1_tel,
                };
                destination = {
                    address: payload.dest.split(",")[1],
                    detail: payload.dest.split(",")[0],
                    memo: payload.memo,
                };
                flower = JSON.parse(payload.flower);
                orderer = JSON.parse(payload.orderer);
                return [4 /*yield*/, db.getUserByInfo(sangju)];
            case 1:
                receiver = _a.sent();
                odid = orderId_1.default();
                return [4 /*yield*/, db.getBugoById(payload.bugoId)];
            case 2:
                bugo = (_a.sent())[0];
                return [4 /*yield*/, db.addFlowerLog(odid, orderer, payload.phrase.split(","), flower, destination, payload.billing, sangju, bugo.bugoId, bugo.deceased.name)];
            case 3:
                wreathResult = _a.sent();
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
                db.addOrderFlower(odid, null, orderer, destination, flower, payload.billing, bugo.bugoId, sangju, cardReady)
                    .then(function (r) {
                    console.log("success!! ", r);
                })
                    .catch(function (e) {
                    console.log("fail!! ", e);
                });
                return [4 /*yield*/, db.addCalcLog_flower(odid, receiver !== null && receiver !== void 0 ? receiver : __assign(__assign({}, sangju), { level: 2 }), payload.billing.method === "무통장" ? "대기" : "완료", flower)];
            case 4:
                accountResult = _a.sent();
                if (!(payload.billing.method === "무통장")) return [3 /*break*/, 6];
                bloomingAccount_1 = {
                    bank: "KB 국민은행",
                    num: "649301-04-103886",
                };
                body = {
                    accountBank: bloomingAccount_1.bank,
                    accountNum: bloomingAccount_1.num,
                    consumer: sangju.name,
                    price: flower.price + flower.deliveryFee,
                };
                return [4 /*yield*/, sendBizTalk_1.default(payload.bizType, "flowerDeposit", body, orderer.phone)];
            case 5:
                _a.sent();
                _a.label = 6;
            case 6: return [2 /*return*/, odid];
        }
    });
}); };
module.exports = router;
