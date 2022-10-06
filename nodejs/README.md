# Examples using 'node-redis' client

This repository contains example data in nodejs using node-redis client.

## Setup and Start

### Sample Data
Use the main README.md for sample data load. Some examples are using preloaded keys.
```bash
docker exec -it hitc_redis sh /sampledata/load_all.sh
```

### Reload Sample Data
Some tests modify the Sample Data so the next run will not start with the same dataset. To reload everything use the following commands:
```bash
docker exec -it hitc_redis redis-cli flushall
docker exec -it hitc_redis sh /sampledata/load_all.sh
```

### Starting examples
`Node v16.2.0` `npm 7.13.0` `node-redis v4.3.1` `Redis Server 6.2.1`

```bash
$ npm install
$ npm start
```


**Results** 
```bash
> npm start

> hitc-new-in-redis-62@1.0.0 start
> node index.js

1. Strings: New Options for the SET Command
   Mint Choc Chip
   Vanilla Bean
   86399
   43200
2. Strings: New Alternatives to the GET Command
   halftimeoff
   null
   freeicecream
   3600
   freeicecream
   7200
   freeicecream
   86399
   freeicecream
   43200
3. Streams: MINID Trimming Strategy
   [{"id":"1617307200000-0","message":{"couponcode":"weekendsale","userid":"6935"}}]
   [{"id":"1617314919000-0","message":{"couponcode":"weekendsale","userid":"5577"}}]
   250
   16
   234
   [{"id":"1617307696000-0","message":{"couponcode":"weekendsale","userid":"529"}}]
   1665019772629-0
   230
4. Hashes: HRANDFIELD Command
   {"10":"Szechuan Shredded Beef","11":"King Prawns with Cashew Nuts","12":"Roast Duck with Plum Sauce","13":"Grilled Lemon Chicken","14":"Chicken with Pineapple","15":"Beef with Broccoli","16":"Malaysian Chicken Curry","17":"House Special Chow Mein","18":"Mushroom Fried Rice","19":"Fried Mushrooms with Black Bean Sauce","20":"Singapore Fried Rice"}
   15
   {"14":"Chicken with Pineapple","16":"Malaysian Chicken Curry"}
   {"13":"Grilled Lemon Chicken","17":"House Special Chow Mein"}
5. Sets: SMISMEMBER Command
   [ '3', '5', '19', '27', '33', '56' ]
   [ false, true, false, true, false, true ]
```
``Note - results might be a bit off due to random functions used``


# Resources

Useful links to help you learn more about Redis:

* [Redis 6.2 Release Blog post at redis.com](https://redis.com/blog/redis-6-2-the-community-edition-is-now-available/)
* [Redis 6.2 GEOSEARCH command repo](https://github.com/redis-developer/introducing-the-geosearch-command)
* [Redis 6.2 GEOSEARCH command video](https://www.youtube.com/watch?v=ZmzuIsWwAzM)
* [Redis Enterprise Cloud](https://redis.com/redis-enterprise-cloud?utm_medium=referral&utm_source=redisUniversity&utm_campaign=hitcredis62) - free 30Mb starter tier
* [Redis University](https://university.redis.com)
* [redis.io](https://redis.io)
* [Redis Discord](https://discord.gg/redis)
* [Redis Developer Relations Live Streaming Schedule](https://developer.redis.com/redis-live/)
* [Redis YouTube Channel](https://youtube.com/redisinc)
* [Redis Twitch Channel](https://twitch.tv/redisinc)
* [Redis Developer](https://developer.redis.com/)
* [Redis](https://redis.com/)
