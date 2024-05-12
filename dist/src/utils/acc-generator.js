"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const randomString = (length, chars) => {
    var result = "";
    for (var i = length; i > 0; --i)
        result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
};
exports.default = randomString;
