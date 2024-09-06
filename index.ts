import Redis from "ioredis";
import { performance } from "perf_hooks";
import { faker } from "@faker-js/faker";

const redis = new Redis("redis://localhost:6379"); // Adjust connection options if needed

// Generate user data
const generateUser = () => ({
  id: faker.string.uuid(),
  name: faker.internet.userName(),
  email: faker.internet.email(),
  age: faker.number.int({ min: 18, max: 80 }),
  street: faker.location.streetAddress(),
  city: faker.location.city(),
  state: faker.location.state(),
  country: faker.location.country(),
  pincode: faker.location.zipCode(),
  phoneNumber: faker.phone.number(),
  jobTitle: faker.person.jobTitle(),
  companyName: faker.company.name(),
  salary: faker.number.int({ min: 30000, max: 150000 }),
  favoriteColor: faker.color.human(),
  isActive: faker.datatype.boolean(),
  lastLogin: faker.date.past(),
  createdAt: faker.date.past(),
});

// Store generated user data in Redis with "testing:" prefix
const generateAndSetUsers = async (count: number) => {
  const users = Array.from({ length: count }, () => generateUser());
  const userIds = users.map((user) => user.id); // Store generated IDs for later use

  for (const user of users) {
    await redis.hmset(`testing:user:${user.id}`, user);
    await redis.set(`testing:string_user:${user.id}`, JSON.stringify(user));
  }

  return userIds;
};

// Performance measurement functions
const measureCommand = async (command: () => Promise<any>) => {
  const start = performance.now();
  await command();
  const end = performance.now();
  return (end - start).toFixed(3); // Round to 2 decimal places
};

// Hash commands
const testHget = async (userId: string) => {
  return measureCommand(() => redis.hget(`testing:user:${userId}`, "name"));
};

const testHgetall = async (userId: string) => {
  return measureCommand(() => redis.hgetall(`testing:user:${userId}`));
};

const testHmget = async (userId: string) => {
  return measureCommand(() =>
    redis.hmget(`testing:user:${userId}`, ...["name", "email"])
  );
};

const testPipelineHmset = async (userIds: string[]) => {
  const pipeline = redis.pipeline();
  const users = Array.from({ length: userIds.length }, () => generateUser());
  userIds.forEach((id, index) =>
    pipeline.hmset(`testing:user:${id}`, users[index])
  );
  return measureCommand(() => pipeline.exec());
};

const testHdel = async (userId: string) => {
  return measureCommand(() => redis.hdel(`testing:user:${userId}`, "name"));
};

const testHexists = async (userId: string) => {
  return measureCommand(() => redis.hexists(`testing:user:${userId}`, "name"));
};

// String commands
const testGet = async (userId: string) => {
  return measureCommand(async () => {
    const data = await redis.get(`testing:string_user:${userId}`);
    JSON.parse(data!); // Parsing the JSON data
  });
};

const testMget = async (userIds: string[]) => {
  return measureCommand(async () => {
    const data = await redis.mget(
      userIds.map((id) => `testing:string_user:${id}`)
    );
    data.forEach((item) => JSON.parse(item!)); // Parsing the JSON data
  });
};

const testSet = async () => {
  const user = generateUser();
  return measureCommand(() =>
    redis.set(`testing:string_user:${user.id}`, JSON.stringify(user))
  );
};

const testPipelineSet = async (userIds: string[]) => {
  const pipeline = redis.pipeline();
  const users = Array.from({ length: userIds.length }, () => generateUser());
  userIds.forEach((id, index) =>
    pipeline.set(`testing:string_user:${id}`, JSON.stringify(users[index]))
  );
  return measureCommand(() => pipeline.exec());
};

const testDel = async (userId: string) => {
  return measureCommand(() => redis.del(`testing:string_user:${userId}`));
};

const testExists = async (userId: string) => {
  return measureCommand(() => redis.exists(`testing:string_user:${userId}`));
};

// HSET command
const testHset = async (userId: string) => {
  return measureCommand(() =>
    redis.hset(`testing:user:${userId}`, "name", "hombalan")
  );
};

// JSON commands
const testJsonSet = async (userId: string) => {
  const user = generateUser();
  return measureCommand(() =>
    redis.call(
      "JSON.SET",
      `testing:json_user:${userId}`,
      "$",
      JSON.stringify(user)
    )
  );
};

const testJsonGet = async (userId: string) => {
  return measureCommand(async () =>
    redis.call("JSON.GET", `testing:json_user:${userId}`, ".name")
  );
};

const testJsonDel = async (userId: string) => {
  return measureCommand(() =>
    redis.call("JSON.DEL", `testing:json_user:${userId}`)
  );
};

const testJsonExists = async (userId: string) => {
  return measureCommand(() =>
    redis.call("JSON.OBJKEYS", `testing:json_user:${userId}`)
  );
};

// Cleanup function
const cleanupKeys = async () => {
  const keys = await redis.keys("testing:*"); // Get all keys with "testing:" prefix
  if (keys.length > 0) {
    await redis.del(keys); // Delete all keys
  }
};

// Main function
const runPerformanceTests = async () => {
  // Generate and set user data
  const userIds = await generateAndSetUsers(3); // Use only 3 users

  // Run tests sequentially
  const results = {};

  // Test Hash commands
  results["HGET"] = await testHget(userIds[0]);
  results["HGETALL"] = await testHgetall(userIds[1]);
  results["HMGET"] = await testHmget(userIds[2]);
  results["PIPELINE HMSET"] = await testPipelineHmset(userIds);
  results["HDEL"] = await testHdel(userIds[1]);
  results["HEXISTS"] = await testHexists(userIds[2]);

  results["GET"] = await testGet(userIds[0]);
  results["MGET"] = await testMget(userIds);
  results["SET"] = await testSet();
  results["PIPELINE SET"] = await testPipelineSet(userIds);
  results["DEL"] = await testDel(userIds[1]);
  results["EXISTS"] = await testExists(userIds[2]);

  // Test JSON commands
  results["JSON SET"] = await testJsonSet(userIds[0]);
  results["JSON GET"] = await testJsonGet(userIds[0]);
  results["JSON DEL"] = await testJsonDel(userIds[0]);
  results["JSON EXISTS"] = await testJsonExists(userIds[0]);

  // Test HSET
  results["HSET"] = await testHset(userIds[0]);

  // Cleanup keys
  await cleanupKeys();

  // Output results with units (milliseconds)
  console.table({
    HGET: `${results["HGET"]} ms`,
    GET: `${results["GET"]} ms`,

    HGETALL: `${results["HGETALL"]} ms`,
    HMGET: `${results["HMGET"]} ms`,
    MGET: `${results["MGET"]} ms`,

    HSET: `${results["HSET"]} ms`,
    SET: `${results["SET"]} ms`,
    "PIPELINE SET": `${results["PIPELINE SET"]} ms`,
    "PIPELINE HMSET": `${results["PIPELINE HMSET"]} ms`,
    HEXISTS: `${results["HEXISTS"]} ms`,

    HDEL: `${results["HDEL"]} ms`,
    DEL: `${results["DEL"]} ms`,
    EXISTS: `${results["EXISTS"]} ms`,

    "JSON SET": `${results["JSON SET"]} ms`,
    "JSON GET": `${results["JSON GET"]} ms`,
    "JSON DEL": `${results["JSON DEL"]} ms`,
    "JSON EXISTS": `${results["JSON EXISTS"]} ms`,
  });
};

runPerformanceTests()
  .then(() => {
    console.log("COMPLETED");
    process.exit(0);
  })
  .catch(console.error);
