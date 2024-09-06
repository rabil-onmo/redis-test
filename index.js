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
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
var ioredis_1 = require("ioredis");
var perf_hooks_1 = require("perf_hooks");
var faker_1 = require("@faker-js/faker");
var redis = new ioredis_1.default("redis://localhost:6379"); // Adjust connection options if needed
// Generate user data
var generateUser = function () { return ({
    id: faker_1.faker.string.uuid(),
    name: faker_1.faker.internet.userName(),
    email: faker_1.faker.internet.email(),
    age: faker_1.faker.number.int({ min: 18, max: 80 }),
    street: faker_1.faker.location.streetAddress(),
    city: faker_1.faker.location.city(),
    state: faker_1.faker.location.state(),
    country: faker_1.faker.location.country(),
    pincode: faker_1.faker.location.zipCode(),
    phoneNumber: faker_1.faker.phone.number(),
    jobTitle: faker_1.faker.person.jobTitle(),
    companyName: faker_1.faker.company.name(),
    salary: faker_1.faker.number.int({ min: 30000, max: 150000 }),
    favoriteColor: faker_1.faker.color.human(),
    isActive: faker_1.faker.datatype.boolean(),
    lastLogin: faker_1.faker.date.past(),
    createdAt: faker_1.faker.date.past(),
}); };
// Store generated user data in Redis with "testing:" prefix
var generateAndSetUsers = function (count) { return __awaiter(void 0, void 0, void 0, function () {
    var users, userIds, _i, users_1, user;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                users = Array.from({ length: count }, function () { return generateUser(); });
                userIds = users.map(function (user) { return user.id; });
                _i = 0, users_1 = users;
                _a.label = 1;
            case 1:
                if (!(_i < users_1.length)) return [3 /*break*/, 5];
                user = users_1[_i];
                return [4 /*yield*/, redis.hmset("testing:user:".concat(user.id), user)];
            case 2:
                _a.sent();
                return [4 /*yield*/, redis.set("testing:string_user:".concat(user.id), JSON.stringify(user))];
            case 3:
                _a.sent();
                _a.label = 4;
            case 4:
                _i++;
                return [3 /*break*/, 1];
            case 5: return [2 /*return*/, userIds];
        }
    });
}); };
// Performance measurement functions
var measureCommand = function (command) { return __awaiter(void 0, void 0, void 0, function () {
    var start, end;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                start = perf_hooks_1.performance.now();
                return [4 /*yield*/, command()];
            case 1:
                _a.sent();
                end = perf_hooks_1.performance.now();
                return [2 /*return*/, (end - start).toFixed(3)]; // Round to 2 decimal places
        }
    });
}); };
// Hash commands
var testHget = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.hget("testing:user:".concat(userId), "name"); })];
    });
}); };
var testHgetall = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.hgetall("testing:user:".concat(userId)); })];
    });
}); };
var testHmget = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () {
                return redis.hmget.apply(redis, __spreadArray(["testing:user:".concat(userId)], ["name", "email"], false));
            })];
    });
}); };
var testPipelineHmset = function (userIds) { return __awaiter(void 0, void 0, void 0, function () {
    var pipeline, users;
    return __generator(this, function (_a) {
        pipeline = redis.pipeline();
        users = Array.from({ length: userIds.length }, function () { return generateUser(); });
        userIds.forEach(function (id, index) {
            return pipeline.hmset("testing:user:".concat(id), users[index]);
        });
        return [2 /*return*/, measureCommand(function () { return pipeline.exec(); })];
    });
}); };
var testHdel = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.hdel("testing:user:".concat(userId), "name"); })];
    });
}); };
var testHexists = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.hexists("testing:user:".concat(userId), "name"); })];
    });
}); };
// String commands
var testGet = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return __awaiter(void 0, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, redis.get("testing:string_user:".concat(userId))];
                        case 1:
                            data = _a.sent();
                            JSON.parse(data); // Parsing the JSON data
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
var testMget = function (userIds) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return __awaiter(void 0, void 0, void 0, function () {
                var data;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, redis.mget(userIds.map(function (id) { return "testing:string_user:".concat(id); }))];
                        case 1:
                            data = _a.sent();
                            data.forEach(function (item) { return JSON.parse(item); }); // Parsing the JSON data
                            return [2 /*return*/];
                    }
                });
            }); })];
    });
}); };
var testSet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        user = generateUser();
        return [2 /*return*/, measureCommand(function () {
                return redis.set("testing:string_user:".concat(user.id), JSON.stringify(user));
            })];
    });
}); };
var testPipelineSet = function (userIds) { return __awaiter(void 0, void 0, void 0, function () {
    var pipeline, users;
    return __generator(this, function (_a) {
        pipeline = redis.pipeline();
        users = Array.from({ length: userIds.length }, function () { return generateUser(); });
        userIds.forEach(function (id, index) {
            return pipeline.set("testing:string_user:".concat(id), JSON.stringify(users[index]));
        });
        return [2 /*return*/, measureCommand(function () { return pipeline.exec(); })];
    });
}); };
var testDel = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.del("testing:string_user:".concat(userId)); })];
    });
}); };
var testExists = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.exists("testing:string_user:".concat(userId)); })];
    });
}); };
// HSET command
var testHset = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () {
                return redis.hset("testing:user:".concat(userId), "name", "hombalan");
            })];
    });
}); };
// JSON commands
var testJsonSet = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        user = generateUser();
        return [2 /*return*/, measureCommand(function () {
                return redis.call("JSON.SET", "testing:json_user:".concat(userId), "$", JSON.stringify(user));
            })];
    });
}); };
var testJsonGet = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, redis.call("JSON.GET", "testing:json_user:".concat(userId), ".name")];
            }); }); })];
    });
}); };
var testJsonDel = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () {
                return redis.call("JSON.DEL", "testing:json_user:".concat(userId));
            })];
    });
}); };
var testJsonExists = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () {
                return redis.call("JSON.OBJKEYS", "testing:json_user:".concat(userId));
            })];
    });
}); };
// Cleanup function
var cleanupKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var keys;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, redis.keys("testing:*")];
            case 1:
                keys = _a.sent();
                if (!(keys.length > 0)) return [3 /*break*/, 3];
                return [4 /*yield*/, redis.del(keys)];
            case 2:
                _a.sent(); // Delete all keys
                _a.label = 3;
            case 3: return [2 /*return*/];
        }
    });
}); };
// Main function
var runPerformanceTests = function () { return __awaiter(void 0, void 0, void 0, function () {
    var userIds, results, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8, _9;
    return __generator(this, function (_10) {
        switch (_10.label) {
            case 0: return [4 /*yield*/, generateAndSetUsers(3)];
            case 1:
                userIds = _10.sent();
                results = {};
                // Test Hash commands
                _a = results;
                _b = "HGET";
                return [4 /*yield*/, testHget(userIds[0])];
            case 2:
                // Test Hash commands
                _a[_b] = _10.sent();
                _c = results;
                _d = "HGETALL";
                return [4 /*yield*/, testHgetall(userIds[1])];
            case 3:
                _c[_d] = _10.sent();
                _e = results;
                _f = "HMGET";
                return [4 /*yield*/, testHmget(userIds[2])];
            case 4:
                _e[_f] = _10.sent();
                _g = results;
                _h = "PIPELINE HMSET";
                return [4 /*yield*/, testPipelineHmset(userIds)];
            case 5:
                _g[_h] = _10.sent();
                _j = results;
                _k = "HDEL";
                return [4 /*yield*/, testHdel(userIds[1])];
            case 6:
                _j[_k] = _10.sent();
                _l = results;
                _m = "HEXISTS";
                return [4 /*yield*/, testHexists(userIds[2])];
            case 7:
                _l[_m] = _10.sent();
                _o = results;
                _p = "GET";
                return [4 /*yield*/, testGet(userIds[0])];
            case 8:
                _o[_p] = _10.sent();
                _q = results;
                _r = "MGET";
                return [4 /*yield*/, testMget(userIds)];
            case 9:
                _q[_r] = _10.sent();
                _s = results;
                _t = "SET";
                return [4 /*yield*/, testSet()];
            case 10:
                _s[_t] = _10.sent();
                _u = results;
                _v = "PIPELINE SET";
                return [4 /*yield*/, testPipelineSet(userIds)];
            case 11:
                _u[_v] = _10.sent();
                _w = results;
                _x = "DEL";
                return [4 /*yield*/, testDel(userIds[1])];
            case 12:
                _w[_x] = _10.sent();
                _y = results;
                _z = "EXISTS";
                return [4 /*yield*/, testExists(userIds[2])];
            case 13:
                _y[_z] = _10.sent();
                // Test JSON commands
                _0 = results;
                _1 = "JSON SET";
                return [4 /*yield*/, testJsonSet(userIds[0])];
            case 14:
                // Test JSON commands
                _0[_1] = _10.sent();
                _2 = results;
                _3 = "JSON GET";
                return [4 /*yield*/, testJsonGet(userIds[0])];
            case 15:
                _2[_3] = _10.sent();
                _4 = results;
                _5 = "JSON DEL";
                return [4 /*yield*/, testJsonDel(userIds[0])];
            case 16:
                _4[_5] = _10.sent();
                _6 = results;
                _7 = "JSON EXISTS";
                return [4 /*yield*/, testJsonExists(userIds[0])];
            case 17:
                _6[_7] = _10.sent();
                // Test HSET
                _8 = results;
                _9 = "HSET";
                return [4 /*yield*/, testHset(userIds[0])];
            case 18:
                // Test HSET
                _8[_9] = _10.sent();
                // Cleanup keys
                return [4 /*yield*/, cleanupKeys()];
            case 19:
                // Cleanup keys
                _10.sent();
                // Output results with units (milliseconds)
                console.table({
                    HGET: "".concat(results["HGET"], " ms"),
                    GET: "".concat(results["GET"], " ms"),
                    HGETALL: "".concat(results["HGETALL"], " ms"),
                    HMGET: "".concat(results["HMGET"], " ms"),
                    MGET: "".concat(results["MGET"], " ms"),
                    HSET: "".concat(results["HSET"], " ms"),
                    SET: "".concat(results["SET"], " ms"),
                    "PIPELINE SET": "".concat(results["PIPELINE SET"], " ms"),
                    "PIPELINE HMSET": "".concat(results["PIPELINE HMSET"], " ms"),
                    HEXISTS: "".concat(results["HEXISTS"], " ms"),
                    HDEL: "".concat(results["HDEL"], " ms"),
                    DEL: "".concat(results["DEL"], " ms"),
                    EXISTS: "".concat(results["EXISTS"], " ms"),
                    "JSON SET": "".concat(results["JSON SET"], " ms"),
                    "JSON GET": "".concat(results["JSON GET"], " ms"),
                    "JSON DEL": "".concat(results["JSON DEL"], " ms"),
                    "JSON EXISTS": "".concat(results["JSON EXISTS"], " ms"),
                });
                return [2 /*return*/];
        }
    });
}); };
runPerformanceTests()
    .then(function () {
    console.log("COMPLETED");
    process.exit(0);
})
    .catch(console.error);
