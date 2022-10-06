from time import sleep
import redis

r = redis.Redis(host='localhost', port=6379, db=0)

##Strings: New Options for the SET command
print("1) Strings: New Options for the SET Command")

#Demo of the GET Option
print("Demo of the GET Option")
print(r.set('favoriteflavor', "Mint Choc Chip"))
print(r.set('favoriteflavor', "Vanilla Bean", get=True))
print(r.get('favoriteflavor'))

#Demo of the EXAT )ption
print("\nDemo of the EXAT Option")
print(r.set('couponcode', 'halfoff', exat=1672488000)) 
print(r.get('couponcode'))
print(r.ttl('couponcode'))

##Strings: New Alternatives to the GET Command
print("\n2) Strings: New Alternatives to the GET Command")

#Demo of the GETDEL command
#For example, let's store a coupon code in a Redis key and use GETDEL so that 
# only the first person to redeem it gets it:

print("\nDemo of the GETDEL Command")
print(r.set('onetimecoupon', 'halfoff'))
print(r.getdel('onetimecoupon'))
print(r.getdel('onetimecoupon'))

#2 hour TTL on a coupon when it's retrieved
print("\nDemo of the GETEX Command")
print(r.set('limitedtimecoupon', 'freeicecream'))
print(r.getex('limitedtimecoupon', ex=7200))
print(r.ttl('limitedtimecoupon'))


##Streams: MINID Trimming Strategy
print("\n3) Streams: MINID Trimming Strategy")

#Find range of timestamps in the stream
print("\nDiscover the range of timestamps in the stream: ")
print(r.xrange('redemptions', '-', '+', count=1))
print(r.xrevrange('redemptions', '+', '-', count=1))

#Check initial length of the stream
print("\nCheck the initial length of the stream")
print(r.xlen('redemptions'))

#Trim the stream so that all remaining IDs are equal to or greater than the one provided (removes 16 entries):
print("\nTrim the stream")
print(r.xtrim('redemptions', minid=1617307696000))
print(r.xlen('redemptions'))

#Check the new end of the stream
print("\nCheck the new end of the stream")
print(r.xrange('redemptions', '-', '+', count=1))

#Add new entry while trimming stream to new minimum ID
print("\nAdd a new entry while also trimming the stream")
print(r.xadd('redemptions', {'couponcode':'weekendsale', 'userid':'9002'}, minid=1617307851000))
print(r.xlen('redemptions'))

##Hashes: HRANDFIELD command
print("\n4) Hashes: HRANDFIELD Command")
print(r.hgetall('entrees'))
print(r.hrandfield('entrees', 1))
print(r.hrandfield('entrees', 2, withvalues=True))
print(r.hrandfield('entrees', -2, withvalues=True))

##Sets: SMISMEMBER Command
print("\n5) Sets: SMISMEMBER Command")
print(r.smembers('winninglotto'))
print(r.smismember('winninglotto', [1,3,7,19,22,33]))
