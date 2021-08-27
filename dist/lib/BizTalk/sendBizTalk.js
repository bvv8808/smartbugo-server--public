"use strict";
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
var getBizToken_1 = require("./getBizToken");
var msgTemplate_1 = require("./msgTemplate");
var axios_1 = require("axios");
var dict = {
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
var staticDict = [
    ["#{앱링크}", "kakao2611e2bcedae961efdc1ad282a6fb4c6://link/"],
];
exports.default = (function (mode, templateType, payload, phoneToSend) { return __awaiter(void 0, void 0, void 0, function () {
    var token, tem, msgBody, _i, _a, entry, apiBody, result, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 3, , 4]);
                return [4 /*yield*/, getBizToken_1.default()];
            case 1:
                token = _b.sent();
                tem = msgTemplate_1.default[templateType];
                msgBody = tem.body;
                for (_i = 0, _a = Object.entries(payload); _i < _a.length; _i++) {
                    entry = _a[_i];
                    console.log(entry[0], entry[1], dict[entry[0]]);
                    msgBody = msgBody.replace(dict[entry[0]], entry[1]);
                }
                msgBody = msgBody.replace("#{대표전화}", "02-1588-0007");
                apiBody = {
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
                }
                else if (mode === "lms") {
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
                return [4 /*yield*/, axios_1.default.post("https://api.bizppurio.com/v3/message", apiBody, {
                        headers: {
                            "Content-Type": "application/json; charset=utf-8",
                            Authorization: token.type + " " + token.accesstoken,
                        },
                    })];
            case 2:
                result = _b.sent();
                return [2 /*return*/, result.data];
            case 3:
                e_1 = _b.sent();
                console.log("@ Error in sendBizTalk \n", e_1.data);
                return [2 /*return*/, null];
            case 4: return [2 /*return*/];
        }
    });
}); });
