"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function () {
    var date = new Date();
    var r = Math.floor(Math.random() * 10000)
        .toString()
        .padStart(5, "0");
    console.log(r);
    return date.getTime().toString() + r;
});
