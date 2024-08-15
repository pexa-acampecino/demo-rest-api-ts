import { createClient } from "redis";
import { sha1 } from "object-hash";

let redisClient = undefined;

export const initializeRedisClient = async () => {
  // read the Redis connection URL from the envs
  let redisURL = process.env.REDIS_URI;
  console.log(`Connecting to Redis at ${redisURL}`);
  if (redisURL) {
    // create the Redis client object
    redisClient = createClient({ url: redisURL }).on("error", (e) => {
      console.error(`Failed to create the Redis client with error:`);
      console.error(e);
    });
    try {
      // connect to the Redis server
      await redisClient.connect();
      console.log(`Connected to Redis successfully!`);
    } catch (e) {
      console.error(`Connection to Redis failed with error:`);
      console.error(e);
    }
  }
};

// function requestToKey(req) {
//   // build a custom object to use as part of the Redis key
//   const reqDataToHash = {
//     query: req.query,
//     body: req.body,
//   };

//   return `${req.path}@${sha1(reqDataToHash)}`;
// }

// const isRedisWorking = () => {
//   // verify wheter there is an active connection
//   // to a Redis server or not
//   return !!redisClient?.isOpen;
// };
