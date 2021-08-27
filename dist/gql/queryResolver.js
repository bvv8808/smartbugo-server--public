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
var removeTag_1 = require("../lib/removeTag");
// @ts-ignore
var db = require("../db/db");
var uuidv4 = require("uuid").v4;
// @ts-ignore
var getDateStr = require("../utils/formatConverter").getDateStr;
var sampleToken = "e780437a-7981-4ad4-a127-937b27d1214e";
// # 장례지도사 로그인 (login)
var user1 = function (_a) {
    var uid = _a.uid, pw = _a.pw, deviceKind = _a.deviceKind, deviceKey = _a.deviceKey;
    return __awaiter(void 0, void 0, void 0, function () {
        var no, token, successUpdate;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.findUser(uid, pw)];
                case 1:
                    no = _b.sent();
                    if (no === 0)
                        return [2 /*return*/, ""];
                    token = uuidv4();
                    return [4 /*yield*/, db.loginMaster(no, deviceKind, deviceKey, token)];
                case 2:
                    successUpdate = _b.sent();
                    console.log(successUpdate);
                    return [2 /*return*/, successUpdate ? token : ""];
            }
        });
    });
};
// # 일반회원 로그인 (loginNormal)
var user2 = function (_a) {
    var name = _a.name, phone = _a.phone, deviceKind = _a.deviceKind, deviceKey = _a.deviceKey, primaryValue = _a.primaryValue, privateNum = _a.privateNum;
    return __awaiter(void 0, void 0, void 0, function () {
        var existId, token, result, newUser;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.findUserByPV(primaryValue, 2)];
                case 1:
                    existId = _b.sent();
                    token = uuidv4();
                    result = false;
                    if (!existId.length) return [3 /*break*/, 3];
                    return [4 /*yield*/, db.updateUserNormal({
                            deviceKey: deviceKey,
                            deviceKind: deviceKind,
                            token: token,
                            phone: phone,
                            name: name,
                            primaryValue: primaryValue,
                            uid: existId,
                        })];
                case 2:
                    result = _b.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, db.addUser({ deviceKey: deviceKey, deviceKind: deviceKind, token: token, phone: phone, name: name, privateNum: privateNum, primaryValue: primaryValue }, 2)];
                case 4:
                    newUser = _b.sent();
                    return [4 /*yield*/, db.updateForNewUser(newUser.no, newUser.id, name, phone)];
                case 5:
                    result = _b.sent();
                    _b.label = 6;
                case 6: return [2 /*return*/, result ? token : ""];
            }
        });
    });
};
// # 회원종류 받아오기 (getTypeByToken)
var user3 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.authToken(token)];
                case 1:
                    if (!(_b.sent()))
                        return [2 /*return*/, 0];
                    return [4 /*yield*/, db.getTypeByToken(token)];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
var user4 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getMaster(token)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
// # 자신이 부의금 서비스를 신청한 부고들과 그 계좌 정보들 (getAppliedBugoAndAccount)
var account1 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () {
        var myInfo, name, phone, uid, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getInfoByToken(token)];
                case 1:
                    myInfo = _b.sent();
                    if (!myInfo) {
                        console.log("@@ 유효하지 않은 토큰");
                        return [2 /*return*/, []];
                    }
                    name = myInfo.name, phone = myInfo.phone, uid = myInfo.uid;
                    return [4 /*yield*/, db.getAppliedBugoAndAccount(uid)];
                case 2:
                    result = _b.sent();
                    return [2 /*return*/, result];
            }
        });
    });
};
// # 자신의 정산계좌 정보 (getMyCalcAccount)
var account2 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db.getCalcAccountByToken(token)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    }); });
};
var account3 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () {
        var uid;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getUidByToken(token)];
                case 1:
                    uid = _b.sent();
                    if (!uid)
                        return [2 /*return*/, 0];
                    return [4 /*yield*/, db.getMyCalcPrice(uid)];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
// # 부고리스트 (getBugoList)
var bugo1 = function (_a) {
    var token = _a.token, bugoId = _a.bugoId, page = _a.page, searchKeyword = _a.searchKeyword;
    return __awaiter(void 0, void 0, void 0, function () {
        var list;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    list = [];
                    if (!bugoId) return [3 /*break*/, 2];
                    return [4 /*yield*/, db.getBugoById(bugoId)];
                case 1:
                    list = _b.sent();
                    return [3 /*break*/, 4];
                case 2: return [4 /*yield*/, db.getBugoList({ page: page, searchKeyword: searchKeyword })];
                case 3:
                    list = _b.sent();
                    _b.label = 4;
                case 4:
                    console.log(list);
                    return [2 /*return*/, list];
            }
        });
    });
};
// # 특정 부고 상주들의 상세 데이터 (getAppliedSangju)
var bugo2 = function (_a) {
    var token = _a.token, bugoId = _a.bugoId;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.authToken(token)];
                case 1:
                    if (!(_b.sent()))
                        return [2 /*return*/, null];
                    return [4 /*yield*/, db.getAppliedSangju(bugoId)];
                case 2: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
// # 일반 회원: 자신이 속한 부고들 (getMyBugoList)
var bugo3 = function (_a) {
    var token = _a.token, page = _a.page;
    return __awaiter(void 0, void 0, void 0, function () {
        var myInfo, name, phone, level, uid, a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getInfoByToken(token)];
                case 1:
                    myInfo = _b.sent();
                    if (!myInfo) {
                        console.log("@@ 유효하지 않은 토큰");
                        return [2 /*return*/, []];
                    }
                    name = myInfo.name, phone = myInfo.phone, level = myInfo.level, uid = myInfo.uid;
                    return [4 /*yield*/, db.getBugoByInfo(name, phone, uid, page)];
                case 2:
                    a = _b.sent();
                    console.log(a);
                    return [2 /*return*/, a];
            }
        });
    });
};
// # 특정 부고의 조문 메시지
var msg1 = function (_a) {
    var bugoId = _a.bugoId;
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db.getMsgs(bugoId)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    }); });
};
// # 지정한 카테고리에 해당하는 화환 리스트 (getFlowerByCategory)
var flower1 = function (_a) {
    var token = _a.token, category = _a.category, page = _a.page;
    return __awaiter(void 0, void 0, void 0, function () {
        var categoryParser;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    categoryParser = {
                        "3단 화환": 10,
                        "3단 특화환": 20,
                        바구니: "q0",
                    };
                    return [4 /*yield*/, db.getFlowerByCategory(categoryParser[category], page)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
// # 자신이 보내거나 받은 화환 내역 리스트 (getMyFlower)
var flower2 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () {
        var no, logs, sendList, receivedList, _i, logs_1, l, date, copied, copied;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getUserNoByToken(token)];
                case 1:
                    no = _b.sent();
                    if (!no)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, db.getFlowerLogOfCommon(no)];
                case 2:
                    logs = _b.sent();
                    console.log(logs);
                    sendList = [];
                    receivedList = [];
                    for (_i = 0, logs_1 = logs; _i < logs_1.length; _i++) {
                        l = logs_1[_i];
                        date = new Date(l.orderTime);
                        l.orderTime = date.getFullYear() + "." + (date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0") + "." + date.getDate().toString().padStart(2, "0");
                        if (no === l.senderNo) {
                            copied = __assign({}, l);
                            delete copied.senderNo;
                            delete copied.receiverNo;
                            sendList.push(copied);
                        }
                        if (no === l.receiverNo) {
                            copied = __assign({}, l);
                            delete copied.senderNo;
                            delete copied.receiverNo;
                            sendList.push(copied);
                        }
                    }
                    return [2 /*return*/, { send: sendList, received: receivedList }];
            }
        });
    });
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
var flower3 = function (_a) {
    var fid = _a.fid;
    return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getFlowerById(fid)];
                case 1: return [2 /*return*/, _b.sent()];
            }
        });
    });
};
// # 특정 부고에 화환 보낸사람 (getFlowerSenderByBuoId)
var flower4 = function (_a) {
    var bugoId = _a.bugoId;
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db.getFlowerSenderOfBugo(bugoId)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    }); });
};
// # 조문내역(장례지도사) - 부의금 서비스 (appliedService)
var log1 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () {
        var uid, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getUidByToken(token)];
                case 1:
                    uid = _b.sent();
                    if (!uid)
                        return [2 /*return*/, []];
                    return [4 /*yield*/, db.getAccountLogByMbId(uid)];
                case 2:
                    result = _b.sent();
                    return [2 /*return*/, result.map(function (r) {
                            r.sangju = JSON.parse(r.sangjus)[0].wr_1_name;
                            delete r.sangjus;
                            return r;
                        })];
            }
        });
    });
};
// # 조문내역(장례지도사) - 부고장 (bugoListOfMaster)
var log2 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () {
        var uid, bugoList, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getUidByToken(token)];
                case 1:
                    uid = _b.sent();
                    if (!uid)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, db.getBugoByWriter(uid)];
                case 2:
                    bugoList = _b.sent();
                    result = bugoList.map(function (b) { return __awaiter(void 0, void 0, void 0, function () {
                        var newObj, _a;
                        return __generator(this, function (_b) {
                            switch (_b.label) {
                                case 0:
                                    newObj = {};
                                    newObj.bugoId = b.bugoId;
                                    newObj.deceasedName = b.deceased.name;
                                    newObj.funeralName = b.funeral.name;
                                    newObj.binso = b.funeral.binso;
                                    newObj.imprintTime = b.imprintTime;
                                    _a = newObj;
                                    return [4 /*yield*/, db.getBugoCalcOfMaster(uid, b.bugoId)];
                                case 1:
                                    _a.calcPrice = _b.sent();
                                    newObj.sangju = JSON.parse(b.sangjus)[0].wr_1_name;
                                    return [2 /*return*/, newObj];
                            }
                        });
                    }); });
                    return [2 /*return*/, result];
            }
        });
    });
};
// # 조문내역(장례지도사) - 화환내역 (flowerOfMaster)
var log3 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () {
        var uid, result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getUidByToken(token)];
                case 1:
                    uid = _b.sent();
                    if (!uid)
                        return [2 /*return*/, null];
                    return [4 /*yield*/, db.getFlowerLogOfMaster(uid)];
                case 2:
                    result = _b.sent();
                    return [2 /*return*/, result.map(function (r) {
                            r.sangju = JSON.parse(r.sangjus)[0].wr_1_name;
                            var date = new Date(r.orderTime);
                            r.orderTime = date.getFullYear() + "." + (date.getMonth() + 1)
                                .toString()
                                .padStart(2, "0") + "." + date.getDate().toString().padStart(2, "0");
                            delete r.sangjus;
                            return r;
                        })];
            }
        });
    });
};
// # 화환 주문 내역 상세 데이터 (flowerOrderData)
var log4 = function (_a) {
    var token = _a.token, odid = _a.odid;
    return __awaiter(void 0, void 0, void 0, function () {
        var result;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getUidByToken(token)];
                case 1:
                    if (!(_b.sent()))
                        return [2 /*return*/, null];
                    return [4 /*yield*/, db.getOrderData(odid)];
                case 2:
                    result = _b.sent();
                    return [2 /*return*/, result.map(function (r) {
                            r.sender = { name: r.senderName, phone: r.senderPhone };
                            r.receiver = { name: r.receiverName, phone: r.receiverPhone };
                            r.destination = r.dAddr + ", " + r.dDetail;
                            delete r.senderName;
                            delete r.senderPhone;
                            delete r.receiverName;
                            delete r.receiverPhone;
                            delete r.dAddr;
                            delete r.dDetail;
                            return r;
                        })[0]];
            }
        });
    });
};
var main1 = function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
    switch (_a.label) {
        case 0: return [4 /*yield*/, db.getTotalSangju()];
        case 1: return [2 /*return*/, _a.sent()];
    }
}); }); };
var main2 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () {
        var info;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getInfoByToken(token)];
                case 1:
                    info = _b.sent();
                    console.log(info);
                    if (!info)
                        return [2 /*return*/, "손님"];
                    return [2 /*return*/, info.name];
            }
        });
    });
};
var payment1 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () {
        var phone;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, db.getInfoByToken(token)];
                case 1:
                    phone = (_b.sent()).phone;
                    return [2 /*return*/, phone !== null && phone !== void 0 ? phone : null];
            }
        });
    });
};
// # 자주묻는질문
var faq = function () { return __awaiter(void 0, void 0, void 0, function () {
    var faq;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, db.getFAQ()];
            case 1:
                faq = _a.sent();
                return [2 /*return*/, faq.map(function (item) {
                        item.question = removeTag_1.default(item.question);
                        item.answer = removeTag_1.default(item.answer);
                        return item;
                    })];
        }
    });
}); };
var etc1 = function (_a) {
    var token = _a.token;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, name, phone;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, db.getInfoByToken(token)];
                case 1:
                    _b = _c.sent(), name = _b.name, phone = _b.phone;
                    return [2 /*return*/, { name: name, phone: phone }];
            }
        });
    });
};
var etc2 = function (_a) {
    var title = _a.title;
    return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, db.etcContent(title)];
            case 1: return [2 /*return*/, _b.sent()];
        }
    }); });
};
module.exports = {
    user1: user1,
    user2: user2,
    user3: user3,
    user4: user4,
    account1: account1,
    account2: account2,
    account3: account3,
    bugo1: bugo1,
    bugo2: bugo2,
    bugo3: bugo3,
    msg1: msg1,
    flower1: flower1,
    flower2: flower2,
    flower3: flower3,
    flower4: flower4,
    // flower5,
    log1: log1,
    log2: log2,
    log3: log3,
    log4: log4,
    faq: faq,
    main1: main1,
    main2: main2,
    payment1: payment1,
    etc1: etc1,
    etc2: etc2,
};
