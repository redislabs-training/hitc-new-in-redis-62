# What's New in Redis 6.2!

This repository contains example data and exercises to accompany the Redis University "What's New in Redis 6.2" Head in the Corner video on YouTube.

Redis 6.2 introduced lots of new features and enhancements.  In the video and this accompanying repository, we'll look at five of them:

1. New options for the `SET` command.
2. New alternatives to the `GET` command.
3. A new trimming strategy for Redis Streams.
4. The new `HRANDFIELD` command.
5. The new `SMISMEMBER` command.

If you enjoyed this video and would like to see more, be sure to [subscribe to our YouTube channel](https://www.youtube.com/channel/UCD78lHSwYqMlyetR0_P4Vig).  We're also on Discord, [join us](https://discord.gg/redis​) for ongoing Redis chat!

## Setup and Load Sample Data

To try out the new Redis 6.2 features covered in the video, use Docker and `docker-compose` to start a Redis server like so:

```bash
$ git clone https://github.com/redislabs-training/hitc-new-in-redis-62.git
$ cd hitc-new-in-redis-62
$ docker-compose up -d
Creating network "hitc-new-in-redis-62_default" with the default driver
Creating hitc_redis ... done
$
```

Load the sample data from the shell in the container:

```
$ docker exec -it hitc_redis sh
/data # /sampledata/load_all.sh
(integer) 0
OK
OK
(integer) 0
OK
OK
OK
OK
OK
OK
OK
OK
OK
(integer) 0
OK
OK
(integer) 0
"1617307200000-0"
"1617307231000-0"
"1617307262000-0"
...
(integer) 6
# exit
$
```

Use the `redis-cli` in the container to enter Redis commands and make sure you have Redis 6.2 or later:

```bash
$ docker exec -it hitc_redis redis-cli
127.0.0.1:6379> info server
...
redis_version:6.2.1
...
```

Exit `redis-cli` using the `quit` command:

```bash
127.0.0.1:6379> quit
$
```

To stop the container when you are done with it:

```
$ docker-compose down
```

## 1) Strings: New Options for the SET Command

Redis 6.2 adds `GET`, `EXAT` and `PXAT` options to the [`SET` command](https://redis.io/commands/set).  The `GET` option retrieves any previous value while setting a new one:

```bash
127.0.0.1:6379> set favoriteflavor "Mint Choc Chip"
OK
127.0.0.1:6379> set favoriteflavor "Vanilla Bean" get
"Mint Choc Chip"
127.0.0.1:6379> get favoriteflavor
"Vanilla Bean"
```

The `EXAT` option allows us to specify a timestamp at which the key should expire, while also setting the key's value:

```bash
127.0.0.1:6379> set couponcode halfoff exat 1640937600
OK
127.0.0.1:6379> ttl couponcode
(integer) 21387890
```

`PXAT` works in the same way, but takes a millisecond timestamp.

## 2) Strings: New Alternatives to the GET Command

The new [`GETEX`](https://redis.io/commands/getex) and [`GETDEL`](https://redis.io/commands/getdel) commands were added in Redis 6.2.  `GETEX` gets the value of a key and sets an expiry on it at the same time, `GETDEL` gets the value of a key and deletes it.

For example, let's store a coupon code in a Redis key and use `GETDEL` so that only the first person to redeem it gets it:

```bash
127.0.0.1:6379> set onetimecoupon halfoff
OK
127.0.0.1:6379> getdel onetimecoupon
"halfoff"
127.0.0.1:6379> getdel onetimecoupon
(nil)
```

Or let's start a 2 hour TTL on another coupon when it is retrieved:

```bash
127.0.0.1:6379> set limitedtimecoupon freeicecream
OK
127.0.0.1:6379> getex limitedtimecoupon ex 7200
"freeicecream"
127.0.0.1:6379> ttl limitedtimecoupon
(integer) 7194
```

`GETEX` also accepts the `PX` option to set expiry in milliseconds, as well as `EXAT` when setting expiry to a specific timestamp and `PXAT` for a millisecond timestamp.

## 3) Streams: MINID Trimming Strategy

Redis 6.2 introduced a new trimming strategy for managing the entries in a Redis Stream.  Previously, you could use the `MAXLEN` modifier to the `XADD` and `XTRIM` commands, which would remove the oldest entries from a stream until the stream's length was a specified number of entries.  This strategy also supported trimming to approximately the specified number of entries for greater performance.

Redis 6.2 adds a second trimming strategy called `MINID`.  This allows us to trim the stream such that any entry whose ID is less than the one provided is removed. Given that the default ID for a Redis stream entry is a timestamp, we now have the ability to trim streams to a given period in time which is more in line with how consumers read from them.

The sample data contains a stream named `redemptions` which has data concerning our ice cream coupon redemptions.  You can use this to try out the `MINID` trimming strategy with the sample data provided.

Discover the range of timestamps in the stream:

```bash
127.0.0.1:6379> xrange redemptions - + count 1
1) 1) "1617307200000-0"
   2) 1) "couponcode"
      2) "weekendsale"
      3) "userid"
      4) "6935"
127.0.0.1:6379> xrevrange redemptions + - count 1
1) 1) "1617314919000-0"
   2) 1) "couponcode"
      2) "weekendsale"
      3) "userid"
      4) "5577"
```

Check the initial length of the stream:

```bash
127.0.0.1:6379> xlen redemptions
(integer) 250
```

Trim the stream so that all remaining IDs are equal to or greater than the one provided (removes 16 entries):

```bash
127.0.0.1:6379> xtrim redemptions minid 1617307696000
(integer) 16
127.0.0.1:6379> xlen redemptions
(integer) 234
```

Check that new end of the stream:

```bash
127.0.0.1:6379> xrange redemptions - + count 1
1) 1) "1617307696000-0"
   2) 1) "couponcode"
      2) "weekendsale"
      3) "userid"
      4) "529"
```

Add a new entry while also trimming the stream to a new minimum ID:

```bash
127.0.0.1:6379> xadd redemptions minid 1617307851000 * couponcode weekendsale userid 9002
"1619559177427-0"
127.0.0.1:6379> xlen redemptions
(integer) 230
```

## 4) Hashes: HRANDFIELD Command

The new [`HRANDFIELD` command](https://redis.io/commands/hrandfield) picks one or more random field names from a Redis Hash.  It returns the field name, and optionally the value too.  When asking for multiple fields, you can specify whether or not they all have to be unique.

Try this out with some take out restaurant examples... Look at all the entrees:

```bash
127.0.0.1:6379> hgetall entrees
 1) "10"
 2) "Szechuan Shredded Beef"
 3) "11"
 4) "King Prawns with Cashew Nuts"
 5) "12"
 6) "Roast Duck with Plum Sauce"
 7) "13"
 8) "Grilled Lemon Chicken"
 9) "14"
10) "Chicken with Pineapple"
11) "15"
12) "Beef with Broccoli"
13) "16"
14) "Malaysian Chicken Curry"
15) "17"
16) "House Special Chow Mein"
17) "18"
18) "Mushroom Fried Rice"
19) "19"
20) "Fried Mushrooms with Black Bean Sauce"
21) "20"
22) "Singapore Fried Rice"
```

Get a random entree number:

```bash
127.0.0.1:6379> hrandfield entrees 1
1) "17"
```

Get two random entree numbers along with the names of the dishes:

```bash
127.0.0.1:6379> hrandfield entrees 2 withvalues
1) "14"
2) "Chicken with Pineapple"
3) "19"
4) "Fried Mushrooms with Black Bean Sauce"
```

Using -2, we can say we want 2 random entries but its OK if they're the same... try this a few times until you get 2 x the same dish :) 

```bash
127.0.0.1:6379> hrandfield entrees -2 withvalues
1) "15"
2) "Beef with Broccoli"
3) "15"
4) "Beef with Broccoli"
```

## 5) Sets: SMISMEMBER Command

The new [`SMISMEMBER` command](https://redis.io/commands/smismember) allows us to check set membership for multiple members at once, rather than having to use `SISMEMBER` for each individually.  Try this out with the lottery example in the sample data, check if my six numbers won!:

```bash
127.0.0.1:6379> smembers winninglotto
1) "3"
2) "5"
3) "19"
4) "27"
5) "33"
6) "56"
127.0.0.1:6379> smismember winninglotto 1 3 7 19 22 33
1) (integer) 0
2) (integer) 1
3) (integer) 0
4) (integer) 1
5) (integer) 0
6) (integer) 1
```

`SMISMEMBER` returns 1 if a match is found and 0 otherwise.

# Resources

Useful links to help you learn more about Redis:

* [Redis 6.2 Release Blog post at Redis Labs](https://redislabs.com/blog/redis-6-2-the-community-edition-is-now-available/)
* [Redis Enterprise Cloud](https://redislabs.com/redis-enterprise-cloud?utm_medium=referral&utm_source=redisUniversity&utm_campaign=hitcredis62) - free 30Mb starter tier
* [Redis University](https://university.redislabs.com)
* [redis.io](https://redis.io)
* [Redis Discord](https://discord.gg/redis)
* [Redis Labs YouTube Channel](https://www.youtube.com/channel/UCD78lHSwYqMlyetR0_P4Vig)
* [Redis Developer](https://developer.redislabs.com/)
* [Redis Labs](https://redislabs.com/)
