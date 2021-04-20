#/bin/sh
/usr/local/bin/redis-cli < /sampledata/get_alternatives_data.redis
/usr/local/bin/redis-cli < /sampledata/hrandfield_data.redis
/usr/local/bin/redis-cli < /sampledata/set_options_data.redis
/usr/local/bin/redis-cli < /sampledata/streams_minid_data.redis
/usr/local/bin/redis-cli < /sampledata/smismember_data.redis