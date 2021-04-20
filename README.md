# What's New in Redis 6.2!

This repository contains example data and exercises to accompany the Redis University "What's New in Redis 6.2" Head in the Corner video on YouTube.

TODO description of the things we cover in the video.

If you enjoyed this video and would like to see more, be sure to [subscribe to our YouTube channel](https://www.youtube.com/redisuniversity).  We're also on Discord, [join us](https://discord.gg/redis​) for ongoing Redis chat!

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

TODO

## 2) Strings: New Alternatives to the GET Command

TODO

## 3) Streams: MINID Trimming Strategy

TODO

## 4) Hashes: HRANDFIELD Command

TODO

## 5) Sets: SMISMEMBER Command

TODO

# Resources

Useful links to help you learn more about Redis:

* [Redis Enterprise Cloud](https://redislabs.com/redis-enterprise-cloud?utm_medium=referral&utm_source=redisUniversity&utm_campaign=hitcredis62) - free 30Mb starter tier
* [Redis University](https://university.redislabs.com)
* [redis.io](https://redis.io)
* [Redis Discord](https://discord.gg/redis)
* [Redis University YouTube Channel](https://www.youtube.com/redisuniversity)
* [Redis Developer](https://developer.redislabs.com/)
* [Redis Labs](https://redislabs.com/)
