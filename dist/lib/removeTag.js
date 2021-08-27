"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = (function (str) {
    var skip = false;
    var removed = "";
    for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
        var c = str_1[_i];
        if (c === "<") {
            skip = true;
            continue;
        }
        else if (c === ">") {
            skip = false;
            continue;
        }
        !skip && (removed += c);
    }
    console.log(removed);
    return removed;
});
