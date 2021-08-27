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
var acid_1 = require("../lib/acid");
var convertGeo_1 = require("../lib/convertGeo");
// const { v4: uuidv4 } = require("uuid");
var pool = require("../db/config");
var sha1 = require("node-sha1");
// @ts-ignore
var getDateStr = require("../utils/formatConverter").getDateStr;
var convertBugoFormat = require("../lib/convertBugoFormat");
var limitCnt = 15;
var getSangjuRelationByInfo = function (name, phone) { return __awaiter(void 0, void 0, void 0, function () {
    var where, query, _a, result, _, selected, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                where = "where wr_1 like '%\"wr_1_name\":\"" + name + "\",\"wr_1_tel\":\"" + phone + "\"%' and wr_delete=0";
                console.log("@ getSangjuRel\n", where);
                query = "select wr_1 as sangjus from g5_write_bugo " + where;
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                if (result.length === 0)
                    return [2 /*return*/, null];
                console.log("@ sangjus\n", result);
                selected = JSON.parse(result[0].sangjus).filter(function (s) { return s.wr_1_name === name && s.wr_1_tel === phone; });
                console.log("@ selected : ", selected);
                if (selected.length === 0)
                    return [2 /*return*/, null];
                return [2 /*return*/, selected[0].wr_1_type];
            case 2:
                e_1 = _b.sent();
                console.log("#ERROR in db.getSangjuRelationByInfo\n", e_1);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var authToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select mb_no from g5_member where mb_8='" + token + "'";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                console.log("@@ ", result);
                return [2 /*return*/, !!result.length];
            case 2:
                e_2 = _b.sent();
                console.log("#ERROR in db.authToken\n", e_2);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getUidByToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_3;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                query = "select mb_id as uid from g5_member where mb_8='" + token + "'";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _c.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.uid) || null];
            case 2:
                e_3 = _c.sent();
                console.log("#ERROR in db.getUidByToken\n", e_3);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getUserByInfo = function (info) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_4;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                query = "select mb_no as no, mb_id as uid, mb_name as name, mb_hp as phone, mb_level as level, mb_3 as code from g5_member where mb_name='" + info.name + "' and mb_hp='" + info.phone + "'";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _c.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, (_b = result[0]) !== null && _b !== void 0 ? _b : null];
            case 2:
                e_4 = _c.sent();
                console.log("#ERROR in db.getUserByInfo\n", e_4);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getInfoByToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_5;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select mb_name as name, mb_hp as phone, mb_level as level, mb_id as uid, mb_3 as code, mb_dupinfo as primaryValue from g5_member where mb_8='" + token + "' and mb_leave_date=''";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result[0] || null];
            case 2:
                e_5 = _b.sent();
                console.log("#ERROR in db.getInfoByToken\n", e_5);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getTypeByToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_6;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                query = "select mb_level from g5_member where mb_8='" + token + "' and mb_leave_date=''";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _c.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.mb_level) || 0];
            case 2:
                e_6 = _c.sent();
                console.log("#ERROR in db.getTypeByToken\n", e_6);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getAppliedSangju = function (bugoId) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, realResult, _loop_1, _i, result_1, r, e_7;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 6, , 7]);
                query = "\n    select \n      odid.od_id as odid, p.name, p.hp as phone, p.account_name as accountName, p.account_bank as accountBank, p.account_number as accountNum,\n      p.wr_id as bugoId\n    from \n      (select od_id from g5_shop_order where wr_id='" + bugoId + "' and od_type=2 and od_status!='\uC8FC\uBB38') as odid\n      inner join custom_price as p on odid.od_id=p.od_id\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                realResult = [];
                _loop_1 = function (r) {
                    var query_1, _c, result_2, _1, arrSangju, matchedSangju;
                    return __generator(this, function (_d) {
                        switch (_d.label) {
                            case 0:
                                query_1 = "select wr_1 as sangjus from g5_write_bugo where wr_id=" + r.bugoId;
                                return [4 /*yield*/, pool.query(query_1)];
                            case 1:
                                _c = _d.sent(), result_2 = _c[0], _1 = _c[1];
                                arrSangju = JSON.parse(result_2[0].sangjus);
                                console.log(arrSangju);
                                matchedSangju = arrSangju.find(function (s) { return s.wr_1_name === r.name && s.wr_1_tel === r.phone; });
                                realResult.push(__assign(__assign({}, r), { relation: (matchedSangju === null || matchedSangju === void 0 ? void 0 : matchedSangju.wr_1_type) || "" }));
                                return [2 /*return*/];
                        }
                    });
                };
                _i = 0, result_1 = result;
                _b.label = 2;
            case 2:
                if (!(_i < result_1.length)) return [3 /*break*/, 5];
                r = result_1[_i];
                return [5 /*yield**/, _loop_1(r)];
            case 3:
                _b.sent();
                _b.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 2];
            case 5:
                console.log(realResult);
                // result.map((r) => {
                //   a;
                // });
                return [2 /*return*/, realResult || []];
            case 6:
                e_7 = _b.sent();
                console.log("#ERROR in db.getNamePhoneByToken\n", e_7);
                return [2 /*return*/, []];
            case 7: return [2 /*return*/];
        }
    });
}); };
var getAppliedLogByOdid = function (odid) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_8;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n    select \n      account_name as accountName,\n      account_bank as accountBank,\n      account_number as accountNum,\n      name as sangju\n    from custom_price\n    where od_id='" + odid + "'\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result[0] || null];
            case 2:
                e_8 = _b.sent();
                console.log("#ERROR in db.getNamePhoneByToken\n", e_8);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getCalcAccountByToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_9;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n    select \n      mb_4 as name,\n      mb_5 as bank,\n      mb_6 as num\n    from g5_member\n    where mb_8='" + token + "'\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result[0] || { name: "", bank: "", num: "" }];
            case 2:
                e_9 = _b.sent();
                console.log("#ERROR in db.getCalcAccountByToken\n", e_9);
                return [2 /*return*/, { name: "", bank: "", num: "" }];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getBugoList = function (_a) {
    var page = _a.page, searchKeyword = _a.searchKeyword;
    return __awaiter(void 0, void 0, void 0, function () {
        var whereSearch, paging, query, _b, result, _, e_10;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    whereSearch = searchKeyword
                        ? "and (wr_2 like ('%" + searchKeyword + "%') or wr_1 like ('%" + searchKeyword + "%'))"
                        : "";
                    paging = page ? "limit " + limitCnt + " offset " + (page - 1) * 10 : "";
                    query = "select wr_12 as xy, wr_id as bugoId, wr_2 as funeralName, wr_3 as funeralAddr, wr_4 as binso, wr_9 as deceasedName, wr_10 as deceasedAge, wr_11 as deceasedGender, wr_5 as deceasedTime, wr_6 as imprintTime, wr_7 as buried, wr_1 as sangjus, mb_id as writer from g5_write_bugo where wr_is_comment=0 and wr_delete=0 " + whereSearch + " order by wr_datetime desc " + paging + " ";
                    return [4 /*yield*/, pool.query(query)];
                case 1:
                    _b = _c.sent(), result = _b[0], _ = _b[1];
                    return [2 /*return*/, result.map(convertBugoFormat)];
                case 2:
                    e_10 = _c.sent();
                    console.log("#ERROR in db.getBugoList\n", e_10);
                    return [2 /*return*/, []];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var getBugoById = function (bugoId) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_11;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select wr_12 as xy, wr_id as bugoId, wr_2 as funeralName, wr_3 as funeralAddr, wr_4 as binso, wr_9 as deceasedName, wr_10 as deceasedAge, wr_11 as deceasedGender, wr_5 as deceasedTime, wr_6 as imprintTime, wr_7 as buried, wr_1 as sangjus, mb_id as writer from g5_write_bugo where wr_is_comment=0 and wr_delete=0 and wr_id=" + bugoId;
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result.map(convertBugoFormat)];
            case 2:
                e_11 = _b.sent();
                console.log("#ERROR in db.getBugoById\n", e_11);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getBugoByWriter = function (writer) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_12;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select wr_id as bugoId, wr_2 as funeralName, wr_3 as funeralAddr, wr_4 as binso, wr_9 as deceasedName, wr_10 as deceasedAge, wr_11 as deceasedGender, wr_5 as deceasedTime, wr_6 as imprintTime, wr_7 as buried, wr_1 as sangjus, mb_id as writer from g5_write_bugo where wr_is_comment=0 and mb_id='" + writer + "' and wr_delete=0";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result.map(convertBugoFormat)];
            case 2:
                e_12 = _b.sent();
                console.log("#ERROR in db.getBugoByWriter\n", e_12);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getBugoIdByWriter = function (writer) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_13;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select wr_id as id from g5_write_bugo where wr_is_comment=0 and mb_id='" + writer + "' and wr_delete=0";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result.map(convertBugoFormat)];
            case 2:
                e_13 = _b.sent();
                console.log("#ERROR in db.getBugoByWriter\n", e_13);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getBugoByInfo = function (name, phone, uid, page) { return __awaiter(void 0, void 0, void 0, function () {
    var info, pageQuery, query, _a, result, _, e_14;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                info = JSON.stringify({
                    wr_1_name: name,
                    wr_1_tel: phone,
                });
                pageQuery = page ? "limit " + limitCnt + " offset " + (page - 1) * 10 : "";
                query = "select wr_id as bugoId, wr_2 as funeralName, wr_3 as funeralAddr, wr_12 as xy, wr_4 as binso, wr_9 as deceasedName, wr_10 as deceasedAge, wr_11 as deceasedGender, wr_5 as deceasedTime, wr_6 as imprintTime, wr_7 as buried, wr_1 as sangjus, mb_id as writer from g5_write_bugo \n    where \n      (wr_is_comment=0) and \n      (wr_delete=0) and \n      (wr_1 like '%" + info.substring(1, info.length - 1) + "%' or mb_id='" + uid + "') " + pageQuery;
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result.map(convertBugoFormat)];
            case 2:
                e_14 = _b.sent();
                console.log("#ERROR in db.getBugoByInfo\n", e_14);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var checkDI = function (di) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_15;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n      select count(mb_no) as cnt from g5_member where mb_dupinfo='" + di + "' and mb_leave_date=''\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, !!!result[0].cnt];
            case 2:
                e_15 = _b.sent();
                console.log("#ERROR in db.getBugoByInfo\n", e_15);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getAppliedBugoAndAccount = function (uid) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_16;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n    select o2.*, b.wr_2 as funeralName, b.wr_4 as binso, b.wr_9 as deceasedName from \n    (select p.*, o.wr_id as bugoId from\n    (select od_id as odid, account_bank as accountBank, account_name as accountName, account_number as accountNum, name as sangjuName \n    from custom_price where mb_id='" + uid + "' or mb_id2='" + uid + "') as p inner join g5_shop_order as o on p.odid=o.od_id where o.od_status !='\uC8FC\uBB38')\n    as o2 inner join g5_write_bugo as b on o2.bugoId=b.wr_id\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                console.log("[query]\n", query);
                console.log("\n[result]\n", result);
                return [2 /*return*/, result];
            case 2:
                e_16 = _b.sent();
                console.log("#ERROR in db.getAppliedBugoAndAccount\n", e_16);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addMsg = function (sender, msg, bugoId) { return __awaiter(void 0, void 0, void 0, function () {
    var query1, _a, result, _, addNum, queryInsert, _b, resultInsert, __, e_17;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 3, , 4]);
                query1 = "select count(wr_parent) as cnt from g5_write_bugo where wr_parent=" + bugoId + " and wr_delete=0";
                return [4 /*yield*/, pool.query(query1)];
            case 1:
                _a = _c.sent(), result = _a[0], _ = _a[1];
                addNum = result[0].cnt;
                console.log("#1: ", addNum, result);
                queryInsert = "\n  insert into g5_write_bugo(\n    wr_parent, wr_name, wr_content, wr_is_comment, wr_comment, wr_datetime,\n    wr_reply, wr_comment_reply, ca_name, wr_option, wr_subject, \n    wr_link1, wr_link2, mb_id, wr_password, wr_email, \n    wr_homepage, wr_last, wr_ip, wr_facebook_user, wr_twitter_user, \n    wr_1, wr_2, wr_3, wr_4, wr_5, \n    wr_6, wr_7, wr_8, wr_9, wr_10, wr_11,\n    wr_12, wr_13, wr_14, wr_15, wr_16, wr_17, wr_18, wr_19, wr_20,\n    wr_delete) \n    values(\n      " + bugoId + ", '" + sender + "', '" + msg + "', 1, " + addNum + ", '" + getDateStr() + "',\n      '', '', '', '', '', \n      '', '', 0, '', '', \n      '', '', '', '', '', \n      '', '', '', '', '', \n      '' , '', '', '', '', '',\n      '', '', '', '', '', '', '', '', '',\n      0)\n  ";
                return [4 /*yield*/, pool.query(queryInsert)];
            case 2:
                _b = _c.sent(), resultInsert = _b[0], __ = _b[1];
                console.log("#2: ", resultInsert);
                return [2 /*return*/, !!(resultInsert === null || resultInsert === void 0 ? void 0 : resultInsert.affectedRows) || false];
            case 3:
                e_17 = _c.sent();
                console.log("#ERROR in db.addMsg\n", e_17);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
var addCounsel = function (email, content, uid, uname) { return __awaiter(void 0, void 0, void 0, function () {
    var strNow, query, _a, result, _, e_18;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                strNow = getDateStr();
                query = "insert into g5_qa_content(\n      qa_type, qa_email, qa_subject, qa_content, qa_datetime, mb_id,\n      qa_num, qa_name, qa_3, qa_email_recv)\n      values(0, '" + email + "', '" + strNow.split(" ")[0] + "_\uBB38\uC758', '" + content + "', '" + getDateStr() + "', '" + uid + "',\n      -1, '" + uname + "', 'mobile', 1)";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                pool.query("update g5_qa_content set qa_parent=" + result.insertId + ", qa_related=" + result.insertId + " where qa_id=" + result.insertId);
                return [2 /*return*/, !!(result === null || result === void 0 ? void 0 : result.affectedRows) || false];
            case 2:
                e_18 = _b.sent();
                console.log("#ERROR in db.addCounsel\n", e_18);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getTotalSangju = function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a, result, _;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, pool.query("select cf_5 from g5_config")];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result[0].cf_5];
        }
    });
}); };
var loginMaster = function (no, deviceKind, deviceKey, token) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_19;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "update g5_member set mb_10='" + deviceKey + "', mb_7='" + deviceKind + "', mb_8='" + token + "' where mb_no=" + no;
                console.log(query);
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, true];
            case 2:
                e_19 = _b.sent();
                console.log("#ERROR in db.loginMaster\n", e_19);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var findUser = function (uid, pw) { return __awaiter(void 0, void 0, void 0, function () {
    var encryptPw, query, _a, result, _, e_20;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                encryptPw = sha1(pw + "bugo.iozen");
                query = "select mb_no as no from g5_member where mb_id='" + uid + "' and mb_password='" + encryptPw + "' and mb_leave_date=''";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result.length ? result[0].no : 0];
            case 2:
                e_20 = _b.sent();
                console.log("#ERROR in db.findUser\n", e_20);
                return [2 /*return*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getMaster = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_21;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select mb_name as name, mb_hp as phone, mb_id as uid, mb_email as email, mb_dupinfo as primaryValue, mb_3 as code, mb_1 as company, mb_2 as position from g5_member where mb_8='" + token + "' and mb_leave_date=''";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result.length ? result[0] : null];
            case 2:
                e_21 = _b.sent();
                console.log("#ERROR in db.getMaster\n", e_21);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var findUserByPV = function (pv, type) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_22;
    var _b;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 2, , 3]);
                query = "select mb_id as id from g5_member where mb_dupinfo='" + pv + "' and mb_level=" + type;
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _c.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.id) || ""];
            case 2:
                e_22 = _c.sent();
                console.log("#ERROR in db.findUserByPV\n", e_22);
                return [2 /*return*/, ""];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addUser = function (input, type) { return __awaiter(void 0, void 0, void 0, function () {
    var now, normalId, query, pw, result, e_23;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                now = getDateStr();
                normalId = input.phone + "_" + new Date()
                    .getTime()
                    .toString()
                    .substring(8);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                query = void 0;
                pw = sha1(input.pw + "bugo.iozen");
                if (type === 3)
                    query = "\n    insert into g5_member(\n      mb_no, mb_id, mb_password, mb_name, mb_nick, \n      mb_nick_date, mb_email, mb_homepage, mb_level, mb_sex, \n      mb_birth, mb_tel, mb_hp, mb_certify, mb_adult, \n      mb_dupinfo, mb_zip1, mb_zip2, mb_addr1, mb_addr2, \n      mb_addr3, mb_addr_jibeon, mb_signature, mb_recommend, mb_point, \n      mb_login_ip, mb_ip, mb_leave_date, mb_intercept_date, mb_email_certify2, \n      mb_memo, mb_lost_certify, mb_mailling, mb_sms, mb_open, \n      mb_open_date, mb_profile, mb_memo_call, mb_memo_cnt, mb_scrap_cnt, \n      mb_1, mb_2, mb_3, mb_4, mb_5, \n      mb_6, mb_7, mb_8, mb_9, mb_10,\n      mb_datetime) \n      values(\n        null, '" + input.uid + "', '" + pw + "', '" + input.name + "', '" + input.name + "', \n        '0000-00-00', '" + input.email + "', '', 3, '', \n        '', '', '" + input.phone + "', '', 0, \n        '" + input.primaryValue + "', '', '', '', '', \n        '', '', '', '', 0, \n        '', '', '', '', '', \n        '', '', 0, 0, 0, \n        '0000-00-00', '', '', 0, 0, \n        '" + input.company + "', '" + input.position + "', '" + input.code + "', '', '', \n        '', '" + input.deviceKind + "', '', '" + input.privateNum + "', '" + input.deviceKey + "',\n        '" + now + "')";
                else
                    query = "\n        insert into g5_member(\n          mb_no, mb_id, mb_password, mb_name, mb_nick, \n          mb_nick_date, mb_email, mb_homepage, mb_level, mb_sex, \n          mb_birth, mb_tel, mb_hp, mb_certify, mb_adult, \n          mb_dupinfo, mb_zip1, mb_zip2, mb_addr1, mb_addr2, \n          mb_addr3, mb_addr_jibeon, mb_signature, mb_recommend, mb_point, \n          mb_login_ip, mb_ip, mb_leave_date, mb_intercept_date, mb_email_certify2, \n          mb_memo, mb_lost_certify, mb_mailling, mb_sms, mb_open, \n          mb_open_date, mb_profile, mb_memo_call, mb_memo_cnt, mb_scrap_cnt, \n          mb_1, mb_2, mb_3, mb_4, mb_5, \n          mb_6, mb_7, mb_8, mb_9, mb_10,\n          mb_datetime) \n          values(\n            null, '" + normalId + "', '', '" + input.name + "', '" + input.name + "', \n            '0000-00-00', '', '', 2, '', \n            '', '', '" + input.phone + "', '', 0, \n            '" + input.primaryValue + "', '', '', '', '', \n            '', '', '', '', 0, \n            '', '', '', '', '', \n            '', '', 0, 0, 0, \n            '0000-00-00', '', '', 0, 0, \n            '', '', '', '', '', \n            '', '" + input.deviceKind + "', '" + input.token + "', '" + input.privateNum + "', '" + input.deviceKey + "',\n            '" + now + "')";
                return [4 /*yield*/, pool.query(query)];
            case 2:
                result = _a.sent();
                if (result[0]) {
                    return [2 /*return*/, type === 2
                            ? { no: result[0].insertId, id: normalId }
                            : { no: result[0].insertId, id: input.uid }];
                }
                else
                    return [2 /*return*/, {}];
                return [3 /*break*/, 4];
            case 3:
                e_23 = _a.sent();
                console.log("#ERROR in db.addUser\n", e_23);
                return [2 /*return*/, {}];
            case 4: return [2 /*return*/];
        }
    });
}); };
var updateMaster = function (input) { return __awaiter(void 0, void 0, void 0, function () {
    var query, encryptPw, _a, result, _, e_24;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "";
                if (input.pw.length) {
                    encryptPw = sha1(input.pw + "bugo.iozen");
                    query = "\n      update g5_member set\n      mb_email='" + input.email + "',\n      mb_name='" + input.name + "',\n      mb_nick='" + input.name + "', \n      mb_1='" + input.company + "',\n      mb_2='" + input.position + "',\n      mb_3='" + input.code + "',\n      mb_password='" + encryptPw + "' \n      where mb_id='" + input.uid + "'\n    ";
                }
                else
                    query = "update g5_member set\n    mb_email='" + input.email + "',\n    mb_name='" + input.name + "',\n    mb_nick='" + input.name + "', \n    mb_1='" + input.company + "',\n    mb_2='" + input.position + "',\n    mb_3='" + input.code + "' \n    where mb_id='" + input.uid + "'";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, !!result.affectedRows];
            case 2:
                e_24 = _b.sent();
                console.log("#ERROR in db.updateMaster\n", e_24);
                return [2 /*return*/, {}];
            case 3: return [2 /*return*/];
        }
    });
}); };
var updateForNewUser = function (no, id, name, phone) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result1, _, receivedOdid, queryAccount, querySend, strOdids, _i, receivedOdid_1, odid, queryReceived, queryPrice, e_25;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 7, , 8]);
                query = "\n      select od_id from g5_shop_order where od_b_name='" + name + "' and od_b_hp='" + phone + "'\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result1 = _a[0], _ = _a[1];
                receivedOdid = result1.map(function (r) { return r.od_id; });
                queryAccount = "update custom_account set mb_id='" + id + "' where sangju_name='" + name + "' and sangju_hp='" + phone + "' and type=1";
                return [4 /*yield*/, pool.query(queryAccount)];
            case 2:
                _b.sent();
                querySend = "update custom_wreath set send_mb_no=" + no + " where od_name='" + name + "' and od_hp='" + phone + "'";
                return [4 /*yield*/, pool.query(querySend)];
            case 3:
                _b.sent();
                if (!receivedOdid.length) return [3 /*break*/, 5];
                strOdids = "(";
                for (_i = 0, receivedOdid_1 = receivedOdid; _i < receivedOdid_1.length; _i++) {
                    odid = receivedOdid_1[_i];
                    strOdids += "'" + odid + "', ";
                }
                strOdids = strOdids.substring(0, strOdids.length - 2) + ")";
                queryReceived = "update custom_wreath set recv_mb_no=" + no + " where od_id in " + strOdids;
                return [4 /*yield*/, pool.query(queryReceived)];
            case 4:
                _b.sent();
                _b.label = 5;
            case 5:
                queryPrice = "update custom_price set mb_id='" + id + "' where name='" + name + "' and hp='" + phone + "'";
                return [4 /*yield*/, pool.query(queryPrice)];
            case 6:
                _b.sent();
                return [2 /*return*/, true];
            case 7:
                e_25 = _b.sent();
                console.log("#ERROR in db.updateForNewUser\n", e_25);
                return [2 /*return*/, false];
            case 8: return [2 /*return*/];
        }
    });
}); };
var updateUserNormal = function (_a) {
    var deviceKey = _a.deviceKey, deviceKind = _a.deviceKind, token = _a.token, phone = _a.phone, name = _a.name, primaryValue = _a.primaryValue, uid = _a.uid;
    return __awaiter(void 0, void 0, void 0, function () {
        var query, result, e_26;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _c.trys.push([0, 2, , 3]);
                    query = "update g5_member set mb_leave_date='', mb_10='" + deviceKey + "', mb_7='" + deviceKind + "', mb_8='" + token + "', mb_hp='" + phone + "', mb_name='" + name + "' where mb_id='" + uid + "'";
                    return [4 /*yield*/, pool.query(query)];
                case 1:
                    result = _c.sent();
                    return [2 /*return*/, ((_b = result[0]) === null || _b === void 0 ? void 0 : _b.affectedRows) === 1 ? true : false];
                case 2:
                    e_26 = _c.sent();
                    console.log("#ERROR in db.updateUserNormal\n", e_26);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var checkId = function (uid) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_27;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select count(mb_id) as cnt from g5_member where mb_id='" + uid + "'";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                console.log(result);
                return [2 /*return*/, !!result[0].cnt];
            case 2:
                e_27 = _b.sent();
                console.log("#ERROR in db.checkId\n", e_27);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getMsgs = function (bugoId) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_28;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select wr_name as sender, wr_content as msg from g5_write_bugo where wr_parent=" + bugoId + " and wr_is_comment != 0 order by wr_comment desc";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result.map(function (m) {
                        m.bugoId = bugoId;
                        return m;
                    })];
            case 2:
                e_28 = _b.sent();
                console.log("#ERROR in db.getMsgs\n", e_28);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getFlowerByCategory = function (category, page) { return __awaiter(void 0, void 0, void 0, function () {
    var limit, query, _a, result, _, e_29;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                limit = 10;
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                query = "select \n    it_id as id,\n    ca_id as category,\n    it_name as name,\n    it_price as price,\n    it_cust_price as originalPrice,\n    it_1 as discountRate,\n    it_sc_price as deliveryFee,\n    it_img1 as imgUrl \n    from g5_shop_item where ca_id='" + category + "' limit " + limit + " offset " + (page - 1) * limit;
                return [4 /*yield*/, pool.query(query)];
            case 2:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result];
            case 3:
                e_29 = _b.sent();
                console.log("#ERROR in db.getMsgs\n", e_29);
                return [2 /*return*/, []];
            case 4: return [2 /*return*/];
        }
    });
}); };
var getFlowerById = function (fid) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_30;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n      select \n        it_id as id,\n        ca_id as category,\n        it_name as name,\n        it_price as price,\n        it_cust_price as originalPrice,\n        it_1 as discountRate,\n        it_sc_price as deliveryFee,\n        it_img1 as imgUrl \n      from g5_shop_item where it_id=" + fid + "\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                console.log(result);
                return [2 /*return*/, result[0] || null];
            case 2:
                e_30 = _b.sent();
                console.log("#ERROR in db.getFlowerById\n", e_30);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getFlowerSenderOfBugo = function (bugoId) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_31;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select content1 as sender from custom_wreath where wr_id=" + bugoId;
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                console.log(result);
                return [2 /*return*/, result.map(function (r) { return r.sender; })];
            case 2:
                e_31 = _b.sent();
                console.log("#ERROR in db.getFlowerSenderOfBugo\n", e_31);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getMyCalcPrice = function (uid) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_32;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select sum(account_price) as price from custom_account where mb_id='" + uid + "'";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result[0].price || 0];
            case 2:
                e_32 = _b.sent();
                console.log("#ERROR in db.getMyCalcPrice\n", e_32);
                return [2 /*return*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addBugo = function (bugo, writer) { return __awaiter(void 0, void 0, void 0, function () {
    var funeral, deceased, sangjus, imprintTime, buried, convertedGeo, cntSangju, query, _a, result, _, _b, result2, __, e_33;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                funeral = bugo.funeral, deceased = bugo.deceased, sangjus = bugo.sangjus, imprintTime = bugo.imprintTime, buried = bugo.buried;
                return [4 /*yield*/, convertGeo_1.default(funeral.x, funeral.y)];
            case 1:
                convertedGeo = _c.sent();
                cntSangju = JSON.parse(sangjus).length;
                query = "insert into g5_write_bugo(\n      wr_is_comment, wr_comment, mb_id, wr_name, wr_datetime, \n      wr_1, wr_2, wr_3, wr_4, wr_5, \n      wr_6, wr_7, wr_9, wr_10, wr_11,\n      wr_subject, wr_content, wr_reply, wr_comment_reply, ca_name, \n      wr_option, wr_link1, wr_link2, wr_password, wr_email, \n      wr_homepage, wr_last, wr_ip, wr_facebook_user, wr_twitter_user, wr_12,\n      wr_13, wr_14, wr_15, wr_16, wr_17, wr_18, wr_19, wr_20, wr_delete, wr_8) \n      values(\n        0, 0, '" + writer + "', '" + deceased.name + "', '" + getDateStr() + "',\n        '" + sangjus + "', '" + funeral.name + "', '" + funeral.address + "', '" + funeral.binso + "', '" + deceased.time + "',\n        '" + imprintTime + "', '" + buried + "', '" + deceased.name + "', '" + deceased.age + "', '" + deceased.gender + "',\n        '', '', '', '', '', \n        '', '', '', '', '', \n        '', '0000-00-00 00:00:00', '', '', '', '" + convertedGeo + "',\n        '', '', '', '', '', '', '', '', 0, '')";
                return [4 /*yield*/, pool.query(query)];
            case 2:
                _a = _c.sent(), result = _a[0], _ = _a[1];
                // console.log(result);
                if (!result.insertId)
                    return [2 /*return*/, 0];
                return [4 /*yield*/, pool.query("update g5_write_bugo set wr_parent=" + result.insertId + " where wr_id=" + result.insertId)];
            case 3:
                _b = _c.sent(), result2 = _b[0], __ = _b[1];
                pool.query("update g5_config set cf_5 = cf_5 + " + cntSangju).then(function () {
                    console.log("cnt updated!");
                });
                addMsg("Smart 부고 임직원 일동", "삼가 고인의 명복을 빕니다.", result.insertId);
                return [2 /*return*/, result2.affectedRows === 1 ? result.insertId : 0];
            case 4:
                e_33 = _c.sent();
                console.log("#ERROR in db.addBugo\n", e_33);
                return [2 /*return*/, 0];
            case 5: return [2 /*return*/];
        }
    });
}); };
var updateBugo = function (bugo, bugoId) { return __awaiter(void 0, void 0, void 0, function () {
    var funeral, deceased, writer, sangjus, imprintTime, buried, prevBugo, newSangjus, prevSangjus, cntPrev, cntEqual, _loop_2, _i, newSangjus_1, s, restNew, restPrev, diff, query, _a, result, _, e_34;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                funeral = bugo.funeral, deceased = bugo.deceased, writer = bugo.writer, sangjus = bugo.sangjus, imprintTime = bugo.imprintTime, buried = bugo.buried;
                return [4 /*yield*/, getBugoById(bugoId)];
            case 1:
                prevBugo = _b.sent();
                newSangjus = JSON.parse(sangjus);
                prevSangjus = JSON.parse(prevBugo.sangjus);
                cntPrev = prevSangjus.length;
                cntEqual = 0;
                _loop_2 = function (s) {
                    if (prevSangjus.findIndex(function (p) { return p.wr_1_name === s.wr_1_name && p.wr_1_tel && s.wr_1_tel; }) !== -1)
                        cntEqual++;
                };
                for (_i = 0, newSangjus_1 = newSangjus; _i < newSangjus_1.length; _i++) {
                    s = newSangjus_1[_i];
                    _loop_2(s);
                }
                restNew = newSangjus.length - cntEqual;
                restPrev = cntPrev - cntEqual;
                diff = restNew - restPrev;
                if (diff) {
                    pool.query("update g5_config set cf_5 = cf_5 + (" + diff + ")");
                }
                query = "update g5_write_bugo set \n      wr_1='" + sangjus + "',\n      wr_2='" + funeral.name + "',\n      wr_3='" + funeral.address + "}',\n      wr_4='" + funeral.binso + "',\n      wr_5='" + deceased.time + "',\n      wr_6='" + imprintTime + "',\n      wr_7='" + buried + "',\n      wr_9='" + deceased.name + "',\n      wr_10=" + deceased.age + ",\n      wr_11='" + deceased.gender + "'\n    where wr_id=" + bugoId;
                return [4 /*yield*/, pool.query(query)];
            case 2:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, !!result.affectedRows];
            case 3:
                e_34 = _b.sent();
                console.log("#ERROR in db.updateBugo\n", e_34);
                return [2 /*return*/, false];
            case 4: return [2 /*return*/];
        }
    });
}); };
var deleteBugo = function (bugoId) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_35;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "update g5_write_bugo set wr_delete=1 where wr_id=" + bugoId;
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, !!result.affectedRows];
            case 2:
                e_35 = _b.sent();
                console.log("#ERROR in db.deleteBugo\n", e_35);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var appliableSangju = function (bugoId, sangju) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, __, e_36;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select od_id from custom_price where wr_id=" + bugoId + " and name='" + sangju.name + "' and hp='" + sangju.phone + "'";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], __ = _a[1];
                return [2 /*return*/, !!!result.length];
            case 2:
                e_36 = _b.sent();
                console.log("#ERROR in db.appliableSangju\n", e_36);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addAppliedLog = function (_a) {
    var input = _a.input, odid = _a.odid, appliedInfo = _a.appliedInfo, masterId = _a.masterId;
    return __awaiter(void 0, void 0, void 0, function () {
        var depositInfo, query, _b, result, _, e_37;
        var _c, _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    _e.trys.push([0, 2, , 3]);
                    depositInfo = input.billing.depositInfo;
                    query = "";
                    console.log(depositInfo && depositInfo.checkedBill);
                    if (depositInfo && depositInfo.checkedBill)
                        query = "insert into custom_price(\n        od_id, mb_id, wr_id,\n        name, relation, hp, account_bank, account_name,\n        account_number, cash_receipt, cash_hp, cash_pn, cash_bn, mb_id2\n    ) values (\n      '" + odid + "', '" + ((appliedInfo === null || appliedInfo === void 0 ? void 0 : appliedInfo.uid) || "") + "', " + input.bugoId + ",\n      '" + input.sangju.name + "', '" + (((_c = input.sangju) === null || _c === void 0 ? void 0 : _c.relation) || "") + "', '" + input.sangju.phone + "', '" + input.account.bank + "', '" + input.account.name + "',\n      '" + input.account.num + "', '" + depositInfo.billType + "', '" + (depositInfo.billType.startsWith("개인소득공제용")
                            ? depositInfo.billValue
                            : "") + "', '', '" + (depositInfo.billType.startsWith("사업자지출증빙용")
                            ? depositInfo.billValue
                            : "") + "', '" + (masterId || "") + "'\n    )";
                    else
                        query = "\n    insert into custom_price(\n        od_id, mb_id, wr_id,\n        name, relation, hp, account_bank, account_name,\n        account_number, cash_receipt, cash_hp, cash_pn, cash_bn\n    ) values (\n      '" + odid + "', '" + ((appliedInfo === null || appliedInfo === void 0 ? void 0 : appliedInfo.uid) || "") + "', " + input.bugoId + ",\n      '" + input.sangju.name + "', '" + (((_d = input.sangju) === null || _d === void 0 ? void 0 : _d.relation) || "") + "', '" + input.sangju.phone + "', '" + input.account.bank + "', '" + input.account.name + "',\n      '" + input.account.num + "', '', '', '', '')\n    ";
                    console.log(query);
                    return [4 /*yield*/, pool.query(query)];
                case 1:
                    _b = _e.sent(), result = _b[0], _ = _b[1];
                    return [2 /*return*/, !!result.affectedRows];
                case 2:
                    e_37 = _e.sent();
                    console.log("#ERROR in db.addAppliedLog\n", e_37);
                    return [2 /*return*/, 0];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var addCalcLog_money = function (log) { return __awaiter(void 0, void 0, void 0, function () {
    var odid, uid, level, name, sname, sphone, price, calcPrice, ac_id, query, _a, result, _, e_38;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                odid = log.odid, uid = log.uid, level = log.level, name = log.name, sname = log.sname, sphone = log.sphone, price = log.price, calcPrice = log.calcPrice;
                ac_id = acid_1.default();
                query = "";
                if (level === 2) {
                    query = "";
                }
                else {
                    query = "\n        insert into custom_account(\n          idx, mb_id, mb_level, mb_name, sangju_name, sangju_hp,\n          type, status, result, price, \n          ac_id, account_price, memo,\n          ap_datetime, ac_datetime, datetime\n        ) values (\n          '" + odid + "', '" + uid + "', 3, '" + name + "', '', '',\n          2, '\uC644\uB8CC', '\uB300\uAE30', " + price + ", \n          '" + ac_id + "', " + calcPrice + ", '',\n          '0000-00-00 00:00:00', '0000-00-00 00:00:00', '" + getDateStr() + "'\n        )\n      ";
                }
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, !!result.affectedRows];
            case 2:
                e_38 = _b.sent();
                console.log("#ERROR in db.addCalcLog_money\n", e_38);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addCalcLog_flower = function (odid, target, status, flower) { return __awaiter(void 0, void 0, void 0, function () {
    var level, name, phone, uid, code, ac_id, calcPrice, rate, fCode, query, _a, result, _, e_39;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 5, , 6]);
                level = target.level, name = target.name, phone = target.phone, uid = target.uid, code = target.code;
                console.log("@@@@ calc target @@@@ \n", target);
                ac_id = acid_1.default();
                calcPrice = 0;
                if (!(level === 2)) return [3 /*break*/, 2];
                return [4 /*yield*/, getNormalCalcRate()];
            case 1:
                rate = _b.sent();
                console.log("@rate : ", Number(rate), typeof rate);
                calcPrice = flower.price * (Number(rate) / 100);
                return [3 /*break*/, 3];
            case 2:
                fCode = code.split(":")[0];
                calcPrice = (flower.price * (Number(fCode.split(".")[1]) || 0)) / 100;
                _b.label = 3;
            case 3:
                query = "\n        insert into custom_account(\n          idx, mb_id, mb_level, mb_name, sangju_name, sangju_hp,\n          type, status, result, price, \n          ac_id, account_price, memo,\n          ap_datetime, ac_datetime, datetime\n        ) values (\n          '" + odid + "', '" + (uid || "") + "', " + level + ", '" + name + "', '" + (level === 2 ? name : "") + "', '" + (level === 2 ? phone : "") + "',\n          1, '" + status + "', '\uB300\uAE30', " + (flower.price + flower.deliveryFee) + ", \n          '" + ac_id + "', " + calcPrice + ", '',\n          '0000-00-00 00:00:00', '0000-00-00 00:00:00', '" + getDateStr() + "'\n        )\n      ";
                return [4 /*yield*/, pool.query(query)];
            case 4:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, !!result.affectedRows];
            case 5:
                e_39 = _b.sent();
                console.log("#ERROR in db.addCalcLog_flower\n", e_39);
                return [2 /*return*/, false];
            case 6: return [2 /*return*/];
        }
    });
}); };
var addOrder = function (odid, input, orderer, price) { return __awaiter(void 0, void 0, void 0, function () {
    var strNow, query, query2, _a, result, _, e_40;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                strNow = getDateStr();
                query = "";
                if (input.billing.method === "무통장") {
                    query = "\n      insert into g5_shop_order(\n        od_id, mb_id, mb_name, od_deposit_name, \n        od_bank_account, od_settle_case, wr_id,\n        od_memo, od_shop_memo, od_mod_history, od_cash, od_cash_no, od_cash_info, od_type,\n        od_status, od_hp,\n        od_email_recv, \n        od_kakao_recv, \n        od_email,\n        od_time, od_cart_price, od_misu\n      ) values(\n        '" + odid + "', '" + orderer.mb_id + "', '" + orderer.mb_name + "', '" + input.sangju.name + "', \n        '', '\uBB34\uD1B5\uC7A5', " + input.bugoId + ", \n        '', '', '', 0, '', '', 2,\n        '\uC8FC\uBB38', '" + orderer.mb_hp + "',\n        " + (input.billing.depositInfo.checkedEmail ? 1 : 0) + ",\n        1,\n        '" + (input.billing.depositInfo.checkedEmail
                        ? input.billing.depositInfo.email
                        : "") + "',\n        '" + strNow + "', " + price + ", " + price + "\n      )\n    ";
                }
                else
                    query = "\n    insert into g5_shop_order(\n      od_id, mb_id, mb_name, od_deposit_name, \n      od_bank_account, od_settle_case, wr_id,\n      od_memo, od_shop_memo, od_mod_history, od_cash, od_cash_no, od_cash_info, od_type,\n      od_status, od_email_recv, od_kakao_recv, od_email, od_hp,\n      od_time, od_cart_price, od_receipt_price\n    ) values(\n      '" + odid + "', '" + orderer.mb_id + "', '" + orderer.mb_name + "', '" + input.sangju.name + "', \n      '" + input.billing.mid + "', '" + input.billing.method + "',\n      " + input.bugoId + ", \n      '', '', '', 0, '', '', 2,\n      '\uC785\uAE08', 0, 0, '', '" + orderer.mb_hp + "',\n      '" + strNow + "', " + price + ", " + price + "\n    )\n  ";
                query2 = "\n      insert into g5_shop_cart(\n        od_id, mb_id, it_id,\n        it_name, ct_price, ct_select_time, ct_time, ct_history, ct_qty\n      ) values(\n        '" + odid + "', '" + orderer.mb_id + "', '1618368895', \n        '\uBD80\uC758\uAE08 \uC11C\uBE44\uC2A4', " + price + ", '" + strNow + "', '" + strNow + "', '', 1\n      )\n  ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                pool.query(query2);
                return [2 /*return*/, !!result.affectedRows];
            case 2:
                e_40 = _b.sent();
                console.log("#ERROR in db.addOrder\n", e_40);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var payment = function (mid, paramType) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, where, query2, _b, result2, __, e_41;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0:
                _c.trys.push([0, 4, , 5]);
                if (!(paramType !== "odid")) return [3 /*break*/, 2];
                query = "update g5_shop_order set od_status='\uC785\uAE08' where od_bank_account='" + mid + "'";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _c.sent(), result = _a[0], _ = _a[1];
                _c.label = 2;
            case 2:
                where = paramType === "mid"
                    ? " where od_bank_account='" + mid + "' "
                    : " where od_id='" + mid + "' ";
                query2 = "\n    select o2.*, i.it_name as flowerName, i.it_price as price, i.it_sc_qty as deliveryFee from \n    (select o.*, w.it_id as fid, w.content1 as p1, w.content2 as p2 from\n      (select od_id as odid, od_hp as ordererPhone, od_settle_case as method, od_b_name as sangju, od_b_addr1 as destAddress, od_b_addr2 as destDetail from g5_shop_order " + where + ") as o inner join custom_wreath as w on o.odid=w.od_id) as o2 inner join g5_shop_item as i on o2.fid=i.it_id\n    ";
                console.log("### ", query2);
                return [4 /*yield*/, pool.query(query2)];
            case 3:
                _b = _c.sent(), result2 = _b[0], __ = _b[1];
                return [2 /*return*/, result2[0]];
            case 4:
                e_41 = _c.sent();
                console.log("#ERROR in db.payment\n", e_41);
                return [2 /*return*/, null];
            case 5: return [2 /*return*/];
        }
    });
}); };
var addOrderFlower = function (odid, sender, orderPerson, destination, flower, billing, bugoId, sangju, cardReady) {
    if (cardReady === void 0) { cardReady = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var strNow, query, query2, _a, result, _, e_42;
        var _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    _g.trys.push([0, 2, , 3]);
                    strNow = getDateStr();
                    query = "\n    insert into g5_shop_order (\n      od_id, mb_id, mb_name,\n      od_name, od_tel, od_hp,\n      od_addr1, od_addr2,\n      od_b_name, od_b_tel, od_b_hp,\n      od_b_addr1, od_b_addr2,\n      od_cart_count, od_cart_price, od_receipt_price, od_bank_account, \n      od_status, od_settle_case,\n      wr_id, od_type, od_deposit_name, od_time, od_send_cost,\n      od_memo, od_shop_memo, od_mod_history, od_cash, od_cash_no, od_cash_info,\n      od_email_recv, od_kakao_recv, od_email, od_misu\n    ) values(\n      '" + odid + "', '" + ((_b = sender === null || sender === void 0 ? void 0 : sender.uid) !== null && _b !== void 0 ? _b : "") + "', '" + ((_c = sender === null || sender === void 0 ? void 0 : sender.name) !== null && _c !== void 0 ? _c : "") + "',\n      '" + orderPerson.name + "', '" + orderPerson.phone + "', '" + orderPerson.phone + "',\n      '" + destination.address + "', '" + destination.detail + "',\n      '" + sangju.name + "', '" + sangju.phone + "', '" + sangju.phone + "',\n      '" + destination.address + "', '" + destination.detail + "',\n      1, " + (flower.price + flower.deliveryFee) + ", " + (billing.method === "무통장" ? 0 : flower.price + flower.deliveryFee) + ", '" + (billing.method === "무통장" ? "" : billing.mid) + "', \n      '" + (cardReady || billing.method === "무통장" ? "주문" : "입금") + "', '" + billing.method + "', \n      " + bugoId + ", 1, '" + orderPerson.name + "', '" + strNow + "', " + flower.deliveryFee + ",\n      '', '', '', 0, '', '',\n      " + (((_d = billing.depositInfo) === null || _d === void 0 ? void 0 : _d.checkedEmail) ? 1 : 0) + ",\n      " + (billing.depositInfo ? 1 : 0) + ",\n      '" + (((_e = billing.depositInfo) === null || _e === void 0 ? void 0 : _e.checkedEmail) ? billing.depositInfo.email : "") + "',\n      " + (billing.method === "무통장" ? flower.price + flower.deliveryFee : 0) + "\n    )\n    ";
                    query2 = "\n      insert into g5_shop_cart(\n        od_id, mb_id, it_id,\n        it_name, ct_price, ct_select_time, ct_time, ct_history, ct_qty\n      ) values(\n        '" + odid + "', '" + ((_f = sender === null || sender === void 0 ? void 0 : sender.uid) !== null && _f !== void 0 ? _f : "") + "', '" + flower.id + "', \n        '" + flower.name + "', " + flower.price + ", '" + strNow + "', '" + strNow + "', '', 1\n      )\n  ";
                    return [4 /*yield*/, pool.query(query)];
                case 1:
                    _a = _g.sent(), result = _a[0], _ = _a[1];
                    pool.query(query2);
                    return [2 /*return*/, !!result.affectedRows];
                case 2:
                    e_42 = _g.sent();
                    console.log("#ERROR in db.addOrderFlower\n", e_42);
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
};
var getServicePrice = function () { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_43;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                query = "\n      select cf_1 as price from g5_config\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _d.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, (_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.price) !== null && _c !== void 0 ? _c : 0];
            case 2:
                e_43 = _d.sent();
                console.log("#ERROR in db.getServicePrice\n", e_43);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getBugoCalcOfMaster = function (uid, bugoId) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_44;
    var _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                _d.trys.push([0, 2, , 3]);
                query = "\n      select account_price as calcPrice from custom_account where idx=" + bugoId + " and mb_id='" + uid + "'\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _d.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, (_c = (_b = result[0]) === null || _b === void 0 ? void 0 : _b.calcPrice) !== null && _c !== void 0 ? _c : 0];
            case 2:
                e_44 = _d.sent();
                console.log("#ERROR in db.getBugoCalcOfMaster\n", e_44);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getAccountLogByMbId = function (uid) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_45;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n    select aa.*, b.wr_9 as deceasedName, b.wr_1 as sangjus from\n      (select a.*, p.wr_id as bugoId, p.account_bank as accountBank, p.account_name as accountName, p.account_number as accountNum from \n      (select idx as odid, account_price as calcPrice from custom_account where mb_id='" + uid + "') as a inner join custom_price as p on a.odid=p.od_id) as aa inner join g5_write_bugo as b on aa.bugoId=b.wr_id\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result];
            case 2:
                e_45 = _b.sent();
                console.log("#ERROR in db.getAccountLogByMbId\n", e_45);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getFlowerLogOfMaster = function (uid) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_46;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n    select o4.*, b.wr_1 as sangjus, b.wr_9 as deceasedName from\n      (select o3.*, a.account_price as calcPrice from \n      (select o2.*, i.it_price as flowerPrice, i.it_img1 as imgUrl, i.it_name as flowerName from \n      (select o.*, w.it_id as flowerId from\n        (select od_id as odid, od_time as orderTime, wr_id as bugoId from g5_shop_order where mb_id='" + uid + "' and od_type=1) \n        as o \n        inner join custom_wreath as w on o.odid = w.od_id\n      ) as o2 inner join g5_shop_item as i on o2.flowerId=i.it_id) as o3 inner join custom_account as a on o3.odid=a.idx where a.mb_id='" + uid + "') as o4 inner join g5_write_bugo as b on o4.bugoId=b.wr_id\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result];
            case 2:
                e_46 = _b.sent();
                console.log("#ERROR in db.getOdidFlowerByUid\n", e_46);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getFlowerLogOfCommon = function (no) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_47;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n  select o3.*, a.account_price as calcPrice from \n  (select o2.*, i.it_name as flowerName, i.it_price as flowerPrice, i.it_img1 as imgUrl from\n    (select w.*, o.od_time as orderTime, o.od_b_name as sangju from \n      (select od_id as odid, wr_id as bugoId, it_id as flowerId, bugo_name as deceasedName, send_mb_no as senderNo, recv_mb_no as receiverNo from custom_wreath where send_mb_no=" + no + " or recv_mb_no=" + no + ")\n      as w inner join g5_shop_order as o on w.odid=o.od_id)\n    as o2 inner join g5_shop_item as i on o2.flowerId=i.it_id)\n  as o3 left join custom_account as a on o3.odid=a.idx\n  ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result];
            case 2:
                e_47 = _b.sent();
                console.log("#ERROR in db.getFlowerLogOfCommon\n", e_47);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getOrderData = function (odid) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_48;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n      select\n        od_name as senderName,\n        od_hp as senderPhone,\n        od_b_name as receiverName,\n        od_b_hp as receiverPhone,\n        od_b_addr1 as dAddr,\n        od_b_addr2 as dDetail,\n        od_settle_case as billingMethod,\n        od_send_cost as deliveryFee,\n        od_shop_memo as memo\n      from g5_shop_order\n      where od_id='" + odid + "'\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result];
            case 2:
                e_48 = _b.sent();
                console.log("#ERROR in db.getOrderData\n", e_48);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var addFlowerLog = function (odid, orderPerson, phrases, flower, destination, billing, sangju, bugoId, deceasedName) { return __awaiter(void 0, void 0, void 0, function () {
    var reciever, sender, query, _a, result, _, e_49;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 4, , 5]);
                return [4 /*yield*/, getUserByInfo(sangju)];
            case 1:
                reciever = _b.sent();
                return [4 /*yield*/, getUserByInfo(orderPerson)];
            case 2:
                sender = _b.sent();
                query = "\n      insert into custom_wreath(\n        od_id, od_name, od_hp,\n        content1, content2, it_id,\n        recv_mb_no, send_mb_no,\n        bugo_name, payment, price,\n        wr_id, delivery, delivery_memo\n      ) values(\n        '" + odid + "', '" + orderPerson.name + "', '" + orderPerson.phone + "',\n        '" + phrases[0] + "', '" + phrases[1] + "', '" + flower.id + "',\n        " + (reciever ? reciever.no : -1) + ", " + (sender ? sender.no : -1) + ",\n        '" + (deceasedName || "") + "', '" + billing.method + "', '" + flower.price + "',\n        " + (bugoId || 0) + ", '" + destination.address + " " + destination.detail + "', '" + destination.memo + "'\n      )\n    ";
                console.log(query);
                return [4 /*yield*/, pool.query(query)];
            case 3:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, !!result.affectedRows];
            case 4:
                e_49 = _b.sent();
                console.log("#ERROR in db.addFlowerLog\n", e_49);
                return [2 /*return*/, false];
            case 5: return [2 /*return*/];
        }
    });
}); };
// const addSangjus = async (sangjus, bugoId) => {
//   let success = 0;
//   for (let sangju of sangjus) {
//     success += await addSangju(sangju, bugoId);
//   }
//   // 등록에 실패한 상주 수를 resolve
//   return sangjus.length - success;
// };
// const getBugoIdsBySangju = async (name, phone) => {
//   // try {
//   //   const con = await mysql.createConnection(config);
//   //   const query = `select uuid from sangju where name='${name}' and phone='${phone}'`;
//   //   console.log("#Execute#\n", query);
//   //   const [rows, fields] = await con.execute(query);
//   //   return rows.map((r) => r.uuid);
//   // } catch (e) {
//   //   console.log("#ERROR in db.getBugoIdsBySangju\n", e);
//   //   return [];
//   // }
// };
// const getSangjuListByBugoId = async (uuid) => {
//   // try {
//   //   const con = await mysql.createConnection(config);
//   //   const query = `select * from sangju where uuid='${uuid}'`;
//   //   console.log("#Execute#\n", query);
//   //   const [rows, fields] = await con.execute(query);
//   //   return rows;
//   // } catch (e) {
//   //   console.log("#ERROR in db.getSangjuListByBugoId\n", e);
//   //   return [];
//   // }
// };
var getFAQ = function () { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_50;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select c.fm_subject as category, f.fa_subject as question, f.fa_content as answer from g5_faq as f left join g5_faq_master as c on f.fm_id=c.fm_id";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result];
            case 2:
                e_50 = _b.sent();
                console.log("#ERROR in db.getFAQ\n", e_50);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getUserNoByToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_51;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select mb_no as no from g5_member where mb_8='" + token + "'";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                if (!result[0])
                    return [2 /*return*/, 0];
                return [2 /*return*/, result[0].no || 0];
            case 2:
                e_51 = _b.sent();
                console.log("#ERROR in db.getUserNoByToken\n", e_51);
                return [2 /*return*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}); };
var applyCalcAccount = function (token, name, bank, num) { return __awaiter(void 0, void 0, void 0, function () {
    var queryUpdate, _a, resultUpdate, __, e_52;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                queryUpdate = "\n      update g5_member set\n        mb_4='" + name + "',\n        mb_5='" + bank + "',\n        mb_6='" + num + "'\n      where mb_8='" + token + "'\n    ";
                return [4 /*yield*/, pool.query(queryUpdate)];
            case 1:
                _a = _b.sent(), resultUpdate = _a[0], __ = _a[1];
                console.log(queryUpdate, resultUpdate);
                return [2 /*return*/, !!resultUpdate.affectedRows];
            case 2:
                e_52 = _b.sent();
                console.log("#ERROR in db.applyCalcAccount\n", e_52);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var updateServiceAccount = function (odid, name, bank, num) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_53;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n      update custom_price set\n        account_name='" + name + "',\n        account_bank='" + bank + "',\n        account_number='" + num + "'\n      where od_id='" + odid + "'\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, !!result.affectedRows];
            case 2:
                e_53 = _b.sent();
                console.log("#ERROR in db.updateServiceAccount\n", e_53);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var confirmCode = function (code) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_54;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select count(mb_3) as cnt from g5_member where mb_3='" + code + "' and mb_level=4";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result[0].cnt || 0];
            case 2:
                e_54 = _b.sent();
                console.error("#ERROR in db.confirmCode\n", e_54);
                return [2 /*return*/, 0];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getLogFlowerByBugoId = function (bugoId) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_55;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n      select \n        od_id as orderNo,\n        bugo_name as deceasedName,\n        send_mb_no as senderNo,\n        od_name as orderName,\n        od_hp as orderPhone,\n        it_id as flowerId,\n        payment as paymentMethod,\n        price as billingPrice,\n        wr_id as bugoId,\n        delivery as address,\n        delivery_memo as memo,\n        sangju_price as calcMoneyForSangju,\n        account_price as calcMoneyForMaster\n      from custom_wreath\n      where wr_id=" + bugoId + "\n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result];
            case 2:
                e_55 = _b.sent();
                console.error("#ERROR in db.getLogFlowerByBugoId\n", e_55);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getLogFlowerInBugoIds = function (strBugoIds) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_56;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n      select \n        od_id as orderNo,\n        bugo_name as deceasedName,\n        send_mb_no as senderNo,\n        od_name as orderName,\n        od_hp as orderPhone,\n        it_id as flowerId,\n        payment as paymentMethod,\n        price as billingPrice,\n        wr_id as bugoId,\n        delivery as address,\n        delivery_memo as memo,\n        sangju_price as calcMoneyForSangju,\n        account_price as calcMoneyForMaster\n      from custom_wreath\n      where wr_id in " + strBugoIds + "\n    ";
                console.log(query);
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                console.log(result);
                return [2 /*return*/, result];
            case 2:
                e_56 = _b.sent();
                console.error("#ERROR in db.getLogFlowerByBugoId\n", e_56);
                return [2 /*return*/, []];
            case 3: return [2 /*return*/];
        }
    });
}); };
var leaveUser = function (token, memo) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_57;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "\n      update g5_member set mb_leave_date='" + getDateStr()
                    .split(" ")[0]
                    .split("-")
                    .join("") + "', mb_memo='" + memo + "' where mb_8='" + token + "' \n    ";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                console.log(result);
                return [2 /*return*/, !!result.affectedRows || false];
            case 2:
                e_57 = _b.sent();
                console.error("#ERROR in db.leave\n", e_57);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getNormalCalcRate = function () { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_58;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select cf_4 from g5_config";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result[0].cf_4];
            case 2:
                e_58 = _b.sent();
                console.error("#ERROR in db.getNormalCalcRate\n", e_58);
                return [2 /*return*/, false];
            case 3: return [2 /*return*/];
        }
    });
}); };
var getUserByToken = function (token) { return __awaiter(void 0, void 0, void 0, function () {
    var query, _a, result, _, e_59;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                query = "select * from g5_member where mb_8='" + token + "'";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result[0]];
            case 2:
                e_59 = _b.sent();
                console.error("#ERROR in db.getUserByToken\n", e_59);
                return [2 /*return*/, null];
            case 3: return [2 /*return*/];
        }
    });
}); };
var etcContent = function (title) { return __awaiter(void 0, void 0, void 0, function () {
    var contentId, query, _a, result, _, e_60;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                contentId = "";
                switch (title) {
                    case "이용약관":
                        contentId = "provision";
                        break;
                    case "개인정보취급방침":
                        contentId = "privacy";
                        break;
                    case "전자금융거래이용약관":
                        contentId = "content1";
                        break;
                    case "개인정보수집및이용안내":
                        contentId = "content4";
                        break;
                    case "개인정보제3자제공/위탁안내":
                        contentId = "content2";
                        break;
                    case "개인정보제3자동의(배송및주문처리목적)":
                        contentId = "content3";
                        break;
                    case "사업자정보확인":
                        contentId = "content5";
                        break;
                    default:
                        return [2 /*return*/, ""];
                }
                query = "select co_content as content from g5_content where co_id='" + contentId + "'";
                return [4 /*yield*/, pool.query(query)];
            case 1:
                _a = _b.sent(), result = _a[0], _ = _a[1];
                return [2 /*return*/, result[0].content];
            case 2:
                e_60 = _b.sent();
                console.error("#ERROR in db.etcContent\n", e_60);
                return [2 /*return*/, ""];
            case 3: return [2 /*return*/];
        }
    });
}); };
module.exports = {
    // # User
    findUser: findUser,
    findUserByPV: findUserByPV,
    addUser: addUser,
    updateUserNormal: updateUserNormal,
    confirmCode: confirmCode,
    authToken: authToken,
    checkId: checkId,
    loginMaster: loginMaster,
    getUidByToken: getUidByToken,
    getInfoByToken: getInfoByToken,
    getUserByInfo: getUserByInfo,
    leaveUser: leaveUser,
    getUserNoByToken: getUserNoByToken,
    getTypeByToken: getTypeByToken,
    checkDI: checkDI,
    updateForNewUser: updateForNewUser,
    // # Bugo
    addBugo: addBugo,
    getMsgs: getMsgs,
    addMsg: addMsg,
    getBugoList: getBugoList,
    getBugoById: getBugoById,
    getBugoByInfo: getBugoByInfo,
    getBugoByWriter: getBugoByWriter,
    updateBugo: updateBugo,
    deleteBugo: deleteBugo,
    getBugoIdByWriter: getBugoIdByWriter,
    // # Flower
    getFlowerByCategory: getFlowerByCategory,
    getFlowerById: getFlowerById,
    getLogFlowerByBugoId: getLogFlowerByBugoId,
    getLogFlowerInBugoIds: getLogFlowerInBugoIds,
    getFlowerSenderOfBugo: getFlowerSenderOfBugo,
    // # Account
    getCalcAccountByToken: getCalcAccountByToken,
    getMyCalcPrice: getMyCalcPrice,
    applyCalcAccount: applyCalcAccount,
    updateServiceAccount: updateServiceAccount,
    // # Log
    addAppliedLog: addAppliedLog,
    addCalcLog_money: addCalcLog_money,
    addCalcLog_flower: addCalcLog_flower,
    addOrder: addOrder,
    addOrderFlower: addOrderFlower,
    getAccountLogByMbId: getAccountLogByMbId,
    addFlowerLog: addFlowerLog,
    getBugoCalcOfMaster: getBugoCalcOfMaster,
    getFlowerLogOfMaster: getFlowerLogOfMaster,
    getFlowerLogOfCommon: getFlowerLogOfCommon,
    getOrderData: getOrderData,
    // # Etc
    getFAQ: getFAQ,
    addCounsel: addCounsel,
    getTotalSangju: getTotalSangju,
    getAppliedBugoAndAccount: getAppliedBugoAndAccount,
    getAppliedSangju: getAppliedSangju,
    getSangjuRelationByInfo: getSangjuRelationByInfo,
    // # Deprecated
    getAppliedLogByOdid: getAppliedLogByOdid,
    // getBugoIdsBySangju,
    // getSangjuListByBugoId,
    appliableSangju: appliableSangju,
    getUserByToken: getUserByToken,
    getServicePrice: getServicePrice,
    getMaster: getMaster,
    updateMaster: updateMaster,
    etcContent: etcContent,
    payment: payment,
};
