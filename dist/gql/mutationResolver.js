"use strict";
// @ts-ignore
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
var orderId_1 = require("../lib/orderId");
var sendBizTalk_1 = require("../lib/BizTalk/sendBizTalk");
var impPaymentCheck_1 = require("../lib/impPaymentCheck");
// @ts-ignore
var qs = require("querystring");
// const bankCodeBook = require("../lib/bankCode");
var authAccount = require("../lib/authAccount");
// @ts-ignore
var db = require("../db/db");
var user1 = function (_a) {
    var input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.addUser(input, 3)];
                case 1: 
                // # 장례지도사 회원가입
                return [2 /*return*/, !!(_b.sent()).no];
            }
        });
    });
};
var user2 = function (_a) {
    var code = _a.code;
    return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.confirmCode(code)];
                case 1:
                    result = _b.sent();
                    return [2 /*return*/, !!result];
            }
        });
    });
};
var user3 = function (_a) {
    var uid = _a.uid;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.checkId(uid)];
                case 1: 
                // # 영업사원 아이디 중복체크
                return [2 /*return*/, _b.sent()];
            }
        });
    });
};
var user4 = function (_a) {
    var di = _a.di;
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db.findUserByPV(di, 3)];
            case 1: return [2 /*return*/, !!(_b.sent())];
        }
    }); });
};
var user5 = function (_a) {
    var input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db.updateMaster(input)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    }); });
};
var account1 = function (_a) {
    var mode = _a.mode, token = _a.token, odid = _a.odid, account = _a.account;
    return __awaiter(void 0, void 0, void 0, function () {
        var name, bank, num, authResult, result, authResult, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    name = account.name, bank = account.bank, num = account.num;
                    if (!(mode === "calc")) return [3 /*break*/, 3];
                    return [4 /*yield*/, authAccount(name, bank, num)];
                case 1:
                    authResult = _b.sent();
                    if (!authResult)
                        return [2 /*return*/, { code: 1, msg: "유효하지 않은 계좌 정보입니다" }];
                    return [4 /*yield*/, db.applyCalcAccount(token, name, bank, num)];
                case 2:
                    result = _b.sent();
                    return [2 /*return*/, result
                            ? { code: 0, msg: "" }
                            : { code: 2, msg: "내부 오류로 실패했습니다" }];
                case 3:
                    if (!(mode === "service")) return [3 /*break*/, 6];
                    return [4 /*yield*/, authAccount(name, bank, num)];
                case 4:
                    authResult = _b.sent();
                    if (!authResult)
                        return [2 /*return*/, { code: 1, msg: "유효하지 않은 계좌 정보입니다" }];
                    return [4 /*yield*/, db.updateServiceAccount(odid, name, bank, num)];
                case 5:
                    result = _b.sent();
                    return [2 /*return*/, result
                            ? { code: 0, msg: "" }
                            : { code: 2, msg: "내부 오류로 실패했습니다" }];
                case 6: return [2 /*return*/, true];
            }
        });
    });
};
var account2 = function (_a) {
    var token = _a.token, account = _a.account;
    return __awaiter(void 0, void 0, void 0, function () {
        var name, bank, num;
        return __generator(this, function (_b) {
            // # 계좌 인증
            if (!db.authToken(token)) {
                console.warn("@ mut.account2 : 토큰 인증 실패");
                return [2 /*return*/, false];
            }
            name = account.name, bank = account.bank, num = account.num;
            return [2 /*return*/, authAccount(name, bank, num)];
        });
    });
};
var msg1 = function (_a) {
    var token = _a.token, sender = _a.sender, msg = _a.msg, bugoId = _a.bugoId;
    return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // # 부고 메시지 남기기
                    console.log("##: ", sender, msg, bugoId);
                    return [4 /*yield*/, db.authToken(token)];
                case 1:
                    if (!(_b.sent()))
                        return [2 /*return*/, false];
                    return [4 /*yield*/, db.addMsg(sender, msg, bugoId)];
                case 2:
                    result = _b.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
var bugo1 = function (_a) {
    var token = _a.token, input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        var writer, createdBugoId, e_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // # 부고 생성
                    console.log("!! ", input);
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, db.getUidByToken(token)];
                case 2:
                    writer = _b.sent();
                    return [4 /*yield*/, db.addBugo(input, writer)];
                case 3:
                    createdBugoId = _b.sent();
                    // const sangjus = JSON.parse(input.sangjus);
                    // const failedCount = await db.addSangjus(sangjus, createdBugoId);
                    // console.log("등록 실패한 상주 수: ", failedCount);
                    return [2 /*return*/, createdBugoId];
                case 4:
                    e_1 = _b.sent();
                    console.log("# Error in mutationResolver.bugo1\n", e_1);
                    return [2 /*return*/, 0];
                case 5: return [2 /*return*/];
            }
        });
    });
};
var bugo2 = function (_a) {
    var token = _a.token, bugoId = _a.bugoId, input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        var e_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db.updateBugo(input, bugoId)];
                case 1:
                    _b.sent();
                    // const sangjus = JSON.parse(input.sangjus);
                    // const failedCount = await db.addSangjus(sangjus, bugoId);
                    // console.log("등록 실패한 상주 수: ", failedCount);
                    return [2 /*return*/, true];
                case 2:
                    e_2 = _b.sent();
                    console.log("# Error in mutationResolver.bugo1\n", e_2);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var bugo3 = function (_a) {
    var token = _a.token, bugoId = _a.bugoId;
    return __awaiter(void 0, void 0, void 0, function () {
        var e_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 3, , 4]);
                    return [4 /*yield*/, db.authToken(token)];
                case 1:
                    if (!(_b.sent()))
                        return [2 /*return*/, false];
                    return [4 /*yield*/, db.deleteBugo(bugoId)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3:
                    e_3 = _b.sent();
                    console.log("# Error in mutationResolver.bugo1\n", e_3);
                    return [2 /*return*/, false];
                case 4: return [2 /*return*/];
            }
        });
    });
};
var send1 = function (_a) {
    var token = _a.token, mode = _a.mode, phone = _a.phone, odid = _a.odid;
    return __awaiter(void 0, void 0, void 0, function () {
        var uid, appliedLog, _b, _c;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0: return [4 /*yield*/, db.getUidByToken(token)];
                case 1:
                    uid = _d.sent();
                    console.log(uid, mode, phone, odid);
                    if (!uid)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, db.getAppliedLogByOdid(odid)];
                case 2:
                    appliedLog = _d.sent();
                    // accountName, accountBank, accountNum, sangju
                    _c = (_b = console).log;
                    return [4 /*yield*/, sendBizTalk_1.default(mode, "serviceAccount", appliedLog, phone)];
                case 3:
                    // accountName, accountBank, accountNum, sangju
                    _c.apply(_b, [_d.sent()]);
                    return [2 /*return*/, true];
            }
        });
    });
};
var payment1 = function (_a) {
    var token = _a.token, input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        var myInfo, receiver, name, phone, level, uid, code, odid, wreathResult, orderResult, accountResult, accountResult_1, bloomingAccount, body, now, today, body;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // # 화환 결제 처리
                    console.log(token, input);
                    return [4 /*yield*/, db.getInfoByToken(token)];
                case 1:
                    myInfo = _b.sent();
                    if (!myInfo)
                        return [2 /*return*/, { code: -1, msg: "유효하지 않은 토큰입니다" }];
                    return [4 /*yield*/, db.getUserByInfo(input.sangju)];
                case 2:
                    receiver = _b.sent();
                    name = myInfo.name, phone = myInfo.phone, level = myInfo.level, uid = myInfo.uid, code = myInfo.code;
                    odid = orderId_1.default();
                    return [4 /*yield*/, db.addFlowerLog(odid, input.orderPerson, input.phrases, input.flower, input.destination, input.billing, input.sangju, input.bugoId, input.deceasedName)];
                case 3:
                    wreathResult = _b.sent();
                    if (!wreathResult)
                        return [2 /*return*/, { code: 1, msg: "내부 오류로 인해 실패했습니다" }];
                    return [4 /*yield*/, db.addOrderFlower(odid, { name: name, uid: uid, phone: phone }, input.orderPerson, input.destination, input.flower, input.billing, input.bugoId, input.sangju)];
                case 4:
                    orderResult = _b.sent();
                    if (!orderResult)
                        return [2 /*return*/, { code: 2, msg: "내부 오류로 인해 실패했습니다" }];
                    return [4 /*yield*/, db.addCalcLog_flower(odid, receiver !== null && receiver !== void 0 ? receiver : __assign(__assign({}, input.sangju), { level: 2 }), input.billing.method === "무통장" ? "대기" : "완료", input.flower)];
                case 5:
                    accountResult = _b.sent();
                    if (!accountResult)
                        return [2 /*return*/, { code: 3, msg: "내부 오류로 인해 실패했습니다" }];
                    if (!(level === 3)) return [3 /*break*/, 7];
                    return [4 /*yield*/, db.addCalcLog_flower(odid, myInfo, input.billing.method === "무통장" ? "대기" : "완료", input.flower)];
                case 6:
                    accountResult_1 = _b.sent();
                    if (!accountResult_1)
                        return [2 /*return*/, { code: 3, msg: "내부 오류로 인해 실패했습니다" }];
                    _b.label = 7;
                case 7:
                    if (!(input.billing.method === "무통장")) return [3 /*break*/, 9];
                    bloomingAccount = {
                        bank: "KB 국민은행",
                        num: "649301-04-103886",
                    };
                    body = {
                        accountBank: bloomingAccount.bank,
                        accountNum: bloomingAccount.num,
                        consumer: input.sangju.name,
                        price: input.flower.price + input.flower.deliveryFee,
                    };
                    return [4 /*yield*/, sendBizTalk_1.default(input.billing.bizTalkType, "flowerDeposit", body, input.sangju.phone)];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 11];
                case 9:
                    now = new Date();
                    today = now.getFullYear() + "/" + (now.getMonth() + 1)
                        .toString()
                        .padStart(2, "0") + "/" + now.getDate().toString().padStart(2, "0");
                    body = {
                        price: "" + (input.flower.price + input.flower.deliveryFee),
                        odid: odid,
                        today: today,
                        itemName: input.flower.name,
                    };
                    return [4 /*yield*/, sendBizTalk_1.default(
                        // input.billing.bizTalkType,
                        "at", "afterFlower", body, input.sangju.phone)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11: return [2 /*return*/, { code: 0, msg: "성공" }];
            }
        });
    });
};
var payment2 = function (_a) {
    var token = _a.token, input = _a.input;
    return __awaiter(void 0, void 0, void 0, function () {
        var servicePrice, myInfo, appliedInfo, _b, name, phone, level, uid, code, odid, applyResult, moneyCode, calcPrice, calcResult, bloomingAccount, body;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.getServicePrice()];
                case 1:
                    servicePrice = _c.sent();
                    return [4 /*yield*/, db.getUserByToken(token)];
                case 2:
                    myInfo = _c.sent();
                    if (!myInfo)
                        return [2 /*return*/, { code: -1, msg: "유효하지 않은 토큰입니다" }];
                    return [4 /*yield*/, db.getUserByInfo(input.sangju)];
                case 3:
                    appliedInfo = _c.sent();
                    _b = input.sangju;
                    return [4 /*yield*/, db.getSangjuRelationByInfo(input.sangju.name, input.sangju.phone)];
                case 4:
                    _b.relation = _c.sent();
                    name = myInfo.name, phone = myInfo.phone, level = myInfo.level, uid = myInfo.uid, code = myInfo.code;
                    odid = orderId_1.default();
                    return [4 /*yield*/, db.addAppliedLog({
                            input: input,
                            odid: odid,
                            appliedInfo: appliedInfo,
                            masterId: level === 3 ? uid : null,
                        })];
                case 5:
                    applyResult = _c.sent();
                    if (!(level === 3)) return [3 /*break*/, 7];
                    moneyCode = code.split(":")[1];
                    calcPrice = moneyCode.length
                        ? servicePrice * (Number(moneyCode.split(".")[1]) / 100)
                        : 0;
                    return [4 /*yield*/, db.addCalcLog_money({
                            odid: odid,
                            uid: uid,
                            level: level,
                            name: name,
                            sname: null,
                            sphone: null,
                            price: servicePrice,
                            calcPrice: calcPrice,
                        })];
                case 6:
                    calcResult = _c.sent();
                    if (!calcResult)
                        return [2 /*return*/, { code: -1, msg: "내부 오류로 실패 했습니다" }];
                    _c.label = 7;
                case 7: 
                // 결제내역에 추가
                return [4 /*yield*/, db.addOrder(odid, input, myInfo, servicePrice)];
                case 8:
                    // 결제내역에 추가
                    _c.sent();
                    if (!(input.billing.method === "무통장")) return [3 /*break*/, 10];
                    bloomingAccount = {
                        bank: "KB 국민은행",
                        num: "649301-04-103886",
                    };
                    body = {
                        accountBank: bloomingAccount.bank,
                        accountNum: bloomingAccount.num,
                        consumer: input.sangju.name,
                        price: "4,900",
                    };
                    return [4 /*yield*/, sendBizTalk_1.default(input.billing.bizTalkType, "serviceDeposit", body, input.sangju.phone)];
                case 9:
                    _c.sent();
                    _c.label = 10;
                case 10: return [2 /*return*/, { code: 0, msg: "성공" }];
            }
        });
    });
};
// 부의금 서비스 신청 가능한 상주인지 확인
var payment3 = function (_a) {
    var bugoId = _a.bugoId, sangju = _a.sangju;
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db.appliableSangju(bugoId, sangju)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    }); });
};
// 결제 성공 여부 확인
var payment4 = function (_a) {
    var token = _a.token, mid = _a.mid;
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, impPaymentCheck_1.default(mid)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    }); });
};
var counsel = function (_a) {
    var token = _a.token, email = _a.email, content = _a.content;
    return __awaiter(void 0, void 0, void 0, function () {
        var user;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getUserByToken(token)];
                case 1:
                    user = _b.sent();
                    if (!user)
                        return [2 /*return*/, false];
                    return [4 /*yield*/, db.addCounsel(email, content, user.mb_id, user.mb_name)];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
var leave = function (_a) {
    var token = _a.token, memo = _a.memo;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    // # 회원 탈퇴
                    console.log("!!", token, memo);
                    return [4 /*yield*/, db.leaveUser(token, memo)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
var test = function () { return __awaiter(void 0, void 0, void 0, function () {
    var now, today, body;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                now = new Date();
                today = now.getFullYear() + "/" + (now.getMonth() + 1)
                    .toString()
                    .padStart(2, "0") + "/" + now.getDate().toString().padStart(2, "0");
                body = {
                    price: "10,000",
                    odid: "202105171234",
                    today: today,
                    itemName: "화환1",
                };
                return [4 /*yield*/, sendBizTalk_1.default(
                    // input.billing.bizTalkType,
                    "at", "afterFlower", body, "01073763452")];
            case 1:
                _a.sent();
                return [2 /*return*/, true];
        }
    });
}); };
module.exports = {
    user1: user1,
    user2: user2,
    user3: user3,
    user4: user4,
    user5: user5,
    account1: account1,
    account2: account2,
    msg1: msg1,
    bugo1: bugo1,
    bugo2: bugo2,
    bugo3: bugo3,
    send1: send1,
    payment1: payment1,
    payment2: payment2,
    payment3: payment3,
    payment4: payment4,
    counsel: counsel,
    leave: leave,
    test: test,
};
