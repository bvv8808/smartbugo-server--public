"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () {
    var date = new Date();
    var arrDT = [
        date.getFullYear(),
        date.getMonth() + 1,
        date.getDate(),
        date.getHours() + 1,
        date.getMinutes(),
        date.getSeconds(),
        Math.round(date.getMilliseconds() / 10),
    ];
    return arrDT.map(function (dt) { return dt.toString().padStart(2, "0"); }).join("");
});
