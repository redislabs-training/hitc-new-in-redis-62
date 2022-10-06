import { createClient } from 'redis'

const fnc = async() => {
    // Lets connect
    const client = createClient({ url:'redis://localhost:6379' })
    client.on('error', (err) => { console.log('Redis Client Error: ', err); process.exit(2)});

    await client.connect();

    // ***********************************
    // 1) Strings: New Options for the SET Command
    console.log('1. Strings: New Options for the SET Command')
    await client.set('favoriteflavor', 'Mint Choc Chip')
    console.log(await client.getSet('favoriteflavor', 'Vanilla Bean')) // Mint Choc Chip
    console.log(await client.get('favoriteflavor')) // Vanilla Bean
    // Set expire date = 1 day from now.
    await client.set('favoriteflavor', 'ToDelete', {'EXAT' : parseInt((+new Date)/1000) + 60*60*24 })
    console.log(await client.ttl('favoriteflavor')) // Expires: 86400
    // Set expire date = 12 hours from now
    await client.set('anotherflavor', 'ToDelete', {'PXAT' : parseInt(+new Date) + 60*60*12*1000 })
    console.log(await client.ttl('anotherflavor')) // Expires: 43200

    // ***********************************
    // 2) Strings: New Alternatives to the GET Command
    console.log('2. Strings: New Alternatives to the GET Command')
    await client.set('onetimecoupon', 'halftimeoff')
    console.log(await client.getDel('onetimecoupon')) // halftimeoff
    console.log(await client.getDel('onetimecoupon')) // null
    //
    client.set('limitedtimecoupon', 'freeicecream')
    // Remove key in 1 hour
    console.log(await client.getEx('limitedtimecoupon', {'PX': 3600000})) // freeicecream
    console.log(await client.ttl('limitedtimecoupon')) // 3600
    // Remove key in 2 hours
    console.log(await client.getEx('limitedtimecoupon', {'EX': 7200}))
    console.log(await client.ttl('limitedtimecoupon')) // 7200
    // Remove key in 24 hours from now
    console.log(await client.getEx('limitedtimecoupon',{'EXAT' : parseInt((+new Date)/1000) + 60*60*24 }))
    console.log(await client.ttl('limitedtimecoupon')) // 86400
    // Remove key in 12 hours from now
    console.log(await client.getEx('limitedtimecoupon',{'PXAT' : parseInt(+new Date) + 60*60*12*1000 }))
    console.log(await client.ttl('limitedtimecoupon')) // 43200

    // ***********************************
    // 3) Streams: MINID Trimming Strategy
    console.log('3. Streams: MINID Trimming Strategy')
    // First record: [{"id":"1617307200000-0","message":{"couponcode":"weekendsale","userid":"6935"}}]
    console.log(JSON.stringify(await client.xRange('redemptions', '-', '+', { 'COUNT': 1 })))
    // Last record: [{"id":"1617314919000-0","message":{"couponcode":"weekendsale","userid":"5577"}}]
    console.log(JSON.stringify(await client.xRevRange('redemptions', '+', '-', { 'COUNT': 1 })))
    console.log(await client.xLen('redemptions')) // 250
    // Trimming to the specified timestamp
    console.log(await client.xTrim('redemptions', 'MINID', 1617307696000 )) // 16
    console.log(await client.xLen('redemptions')) // 234
    // First record changed: [{"id":"1617307696000-0","message":{"couponcode":"weekendsale","userid":"529"}}]
    console.log(JSON.stringify(await client.xRange('redemptions', '-', '+', { 'COUNT': 1 })))
    // Add with trim strategy, dropping messages behind the threshold id
    console.log(await client.xAdd('redemptions', '*',
        { 'couponcode': 'weekendsale', 'userid': '9002'},
        { TRIM: { strategy: 'MINID', threshold: 1617307851000 }} ))
    console.log(await client.xLen('redemptions')) // 230

    // ***********************************
    // 4) Hashes: HRANDFIELD Command
    console.log('4. Hashes: HRANDFIELD Command')
    // {"10":"Szechuan... }
    console.log(JSON.stringify(await client.hGetAll('entrees')))
    // Returns a random field name
    // Random: 19
    console.log(await client.hRandField('entrees'))
    // Returns 2 different fields with values
    // With 2 values: {"10":"Szechuan Shredded Beef","19":"Fried Mushrooms with Black Bean Sauce"}
    console.log(JSON.stringify(await client.hRandFieldCountWithValues('entrees', 2)))
    // Returns a single value when random numbers are the same
    // {"10":"Szechuan Shredded Beef"}
    console.log(JSON.stringify(await client.hRandFieldCountWithValues('entrees', -2)))

    // ***********************************
    // 5) Sets: SMISMEMBER Command
    console.log('5. Sets: SMISMEMBER Command')
    // Return all members
    // [ '3', '5', '19', '27', '33', '56' ]
    console.log(await client.sMembers('winninglotto'))
    // Returns array of booleans - true/false per specified member to probe
    // [ false, true, false, true, false, true ]
    console.log(await client.smIsMember('winninglotto', ["1","3","7","19","22","33"]))

    await client.disconnect()
}

fnc()

