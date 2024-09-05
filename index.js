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
var redis = new ioredis_1.default('redis://localhost:6379'); // Adjust connection options if needed
// Generate user data
var generateUser = function () { return ({
    id: faker_1.faker.string.uuid(),
    name: faker_1.faker.internet.userName(),
    email: faker_1.faker.internet.email(),
    age: faker_1.faker.number.int(),
    address: {
        city: faker_1.faker.location.city(),
        pincode: faker_1.faker.location.zipCode(),
    },
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
        return [2 /*return*/, measureCommand(function () { return redis.hget("testing:user:".concat(userId), 'name'); })];
    });
}); };
var testHgetall = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.hgetall("testing:user:".concat(userId)); })];
    });
}); };
var testHmget = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.hmget.apply(redis, __spreadArray(["testing:user:".concat(userId)], ['name', 'email'], false)); })];
    });
}); };
var testPipelineHmset = function (userIds) { return __awaiter(void 0, void 0, void 0, function () {
    var pipeline, users;
    return __generator(this, function (_a) {
        pipeline = redis.pipeline();
        users = Array.from({ length: userIds.length }, function () { return generateUser(); });
        userIds.forEach(function (id, index) { return pipeline.hmset("testing:user:".concat(id), users[index]); });
        return [2 /*return*/, measureCommand(function () { return pipeline.exec(); })];
    });
}); };
var testHdel = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.hdel("testing:user:".concat(userId), 'name'); })];
    });
}); };
var testHexists = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.hexists("testing:user:".concat(userId), 'name'); })];
    });
}); };
// String commands
var testGet = function (userId) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.get("testing:string_user:".concat(userId)); })];
    });
}); };
var testMget = function (userIds) { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        return [2 /*return*/, measureCommand(function () { return redis.mget(userIds.map(function (id) { return "testing:string_user:".concat(id); })); })];
    });
}); };
var testSet = function () { return __awaiter(void 0, void 0, void 0, function () {
    var user;
    return __generator(this, function (_a) {
        user = generateUser();
        return [2 /*return*/, measureCommand(function () { return redis.set("testing:string_user:".concat(user.id), JSON.stringify(user)); })];
    });
}); };
var testPipelineSet = function (userIds) { return __awaiter(void 0, void 0, void 0, function () {
    var pipeline, users;
    return __generator(this, function (_a) {
        pipeline = redis.pipeline();
        users = Array.from({ length: userIds.length }, function () { return generateUser(); });
        userIds.forEach(function (id, index) { return pipeline.set("testing:string_user:".concat(id), JSON.stringify(users[index])); });
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
    var user;
    return __generator(this, function (_a) {
        user = generateUser();
        return [2 /*return*/, measureCommand(function () { return redis.hset("testing:user:".concat(userId), user); })];
    });
}); };
// HMSET command
var testHmset = function (userIds) { return __awaiter(void 0, void 0, void 0, function () {
    var pipeline, users;
    return __generator(this, function (_a) {
        pipeline = redis.pipeline();
        users = Array.from({ length: userIds.length }, function () { return generateUser(); });
        userIds.forEach(function (id, index) { return pipeline.hmset("testing:user:".concat(id), users[index]); });
        return [2 /*return*/, measureCommand(function () { return pipeline.exec(); })];
    });
}); };
// Cleanup function
var cleanupKeys = function () { return __awaiter(void 0, void 0, void 0, function () {
    var keys;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, redis.keys('testing:*')];
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
    var userIds, results, _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3;
    return __generator(this, function (_4) {
        switch (_4.label) {
            case 0: return [4 /*yield*/, generateAndSetUsers(3)];
            case 1:
                userIds = _4.sent();
                results = {};
                // Test HGET
                _a = results;
                _b = 'HGET';
                return [4 /*yield*/, testHget(userIds[0])];
            case 2:
                // Test HGET
                _a[_b] = _4.sent();
                // Test HGETALL
                _c = results;
                _d = 'HGETALL';
                return [4 /*yield*/, testHgetall(userIds[1])];
            case 3:
                // Test HGETALL
                _c[_d] = _4.sent();
                // Test HMGET
                _e = results;
                _f = 'HMGET';
                return [4 /*yield*/, testHmget(userIds[2])];
            case 4:
                // Test HMGET
                _e[_f] = _4.sent();
                // Test PIPELINE HMSET
                _g = results;
                _h = 'PIPELINE HMSET';
                return [4 /*yield*/, testPipelineHmset(userIds)];
            case 5:
                // Test PIPELINE HMSET
                _g[_h] = _4.sent();
                // Test HDEL
                _j = results;
                _k = 'HDEL';
                return [4 /*yield*/, testHdel(userIds[1])];
            case 6:
                // Test HDEL
                _j[_k] = _4.sent();
                // Test HEXISTS
                _l = results;
                _m = 'HEXISTS';
                return [4 /*yield*/, testHexists(userIds[2])];
            case 7:
                // Test HEXISTS
                _l[_m] = _4.sent();
                // Test GET
                _o = results;
                _p = 'GET';
                return [4 /*yield*/, testGet(userIds[0])];
            case 8:
                // Test GET
                _o[_p] = _4.sent();
                // Test MGET
                _q = results;
                _r = 'MGET';
                return [4 /*yield*/, testMget(userIds)];
            case 9:
                // Test MGET
                _q[_r] = _4.sent();
                // Test SET
                _s = results;
                _t = 'SET';
                return [4 /*yield*/, testSet()];
            case 10:
                // Test SET
                _s[_t] = _4.sent();
                // Test PIPELINE SET
                _u = results;
                _v = 'PIPELINE SET';
                return [4 /*yield*/, testPipelineSet(userIds)];
            case 11:
                // Test PIPELINE SET
                _u[_v] = _4.sent();
                // Test DEL
                _w = results;
                _x = 'DEL';
                return [4 /*yield*/, testDel(userIds[1])];
            case 12:
                // Test DEL
                _w[_x] = _4.sent();
                // Test EXISTS
                _y = results;
                _z = 'EXISTS';
                return [4 /*yield*/, testExists(userIds[2])];
            case 13:
                // Test EXISTS
                _y[_z] = _4.sent();
                // Test HSET
                _0 = results;
                _1 = 'HSET';
                return [4 /*yield*/, testHset(userIds[0])];
            case 14:
                // Test HSET
                _0[_1] = _4.sent();
                // Test HMSET
                _2 = results;
                _3 = 'HMSET';
                return [4 /*yield*/, testHmset(userIds)];
            case 15:
                // Test HMSET
                _2[_3] = _4.sent();
                // Cleanup keys
                return [4 /*yield*/, cleanupKeys()];
            case 16:
                // Cleanup keys
                _4.sent();
                // Output results with units (milliseconds)
                console.table({
                    'HGET': "".concat(results['HGET'], " ms"),
                    'GET': "".concat(results['GET'], " ms"),
                    'HGETALL': "".concat(results['HGETALL'], " ms"),
                    'HMGET': "".concat(results['HMGET'], " ms"),
                    'MGET': "".concat(results['MGET'], " ms"),
                    'HSET': "".concat(results['HSET'], " ms"),
                    'HMSET': "".concat(results['HMSET'], " ms"),
                    'SET': "".concat(results['SET'], " ms"),
                    'PIPELINE SET': "".concat(results['PIPELINE SET'], " ms"),
                    'PIPELINE HMSET': "".concat(results['PIPELINE HMSET'], " ms"),
                    'HEXISTS': "".concat(results['HEXISTS'], " ms"),
                    'HDEL': "".concat(results['HDEL'], " ms"),
                    'DEL': "".concat(results['DEL'], " ms"),
                    'EXISTS': "".concat(results['EXISTS'], " ms"),
                });
                return [2 /*return*/];
        }
    });
}); };
runPerformanceTests().catch(console.error);
