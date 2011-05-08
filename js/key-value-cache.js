function cache_store (stat, key, value, on_removed) {
    var full = true
    for (var i = 0; i < stat.a.length; i ++) {
        // console.debug (i, stat.a[i])
        var elem = stat.a[i]
        if (! elem.content) {
            elem.content = {key: key, value: value, on_removed: on_removed}

            if (stat.head) {
                stat.head.prev = elem
                elem.next = stat.head
                stat.head = elem
            } else {
                stat.head = elem
                stat.last = elem
            }
            full = false
            break
        }
    }

    // console.debug (full)

    if (full) {
        console.assert (stat.last, "last")
        console.assert (stat.head, "head")

        var elem = stat.last
        var to_be_removed = elem.content
        elem.content = {key: key, value: value, on_removed: on_removed}

        // console.debug (elem)
        stat.last = elem.prev
        stat.last.next = null

        elem.prev = null
        elem.next = stat.head
        stat.head.prev = elem

        stat.head = elem

        console.assert (stat.last.next == null, "next of last must be null")
        console.assert (stat.head.prev == null, "prev of head must be null")

        if (to_be_removed.on_removed) {
            to_be_removed.on_removed ()
        }
    }

    // console.debug (stat.a)
    // console.debug (stat.head.content.key, stat.last.content.key)

    // console.debug ("store")
    console.assert (! detect_loop (stat), "loop detected")
}

function detect_loop (stat) {
    var e1 = stat.head
    var e2 = stat.head
    var output = ""
    while (e1) {
        output += e1.content.key.toString () + " "

        e1 = e1.next
        e2 = e2 && e2.next && e2.next.next

        if (e1 && e2 && e1 == e2) {
            console.debug ("loop detected!")
            
            return true
        }
    }

    output += "| "

    e1 = stat.last
    e2 = stat.last
    while (e1) {
        output += e1.content.key.toString () + " "

        e1 = e1.prev
        e2 = e2 && e2.prev && e2.prev.prev

        if (e1 && e2 && e1 == e2) {
            console.debug ("loop detected!")
            
            return true
        }
    }

    // console.debug (output)
}

function cache_lookup (stat, key) {
    // console.debug ("lookup")
    for (var elem = stat.head; elem; elem = elem.next) {
        if (elem.content && elem.content.key == key) {
            if (elem == stat.head) {
                return elem.content
            }

            if (elem == stat.last) {
                console.assert (elem.next == null)
                stat.last = elem.prev
                if (elem.prev) elem.prev.next = null
                elem.prev = null
                elem.next = stat.head
                stat.head.prev = elem
                stat.head = elem
            } else {
                var next = elem.next
                var prev = elem.prev
                console.assert (next)
                console.assert (prev)
                if (prev) prev.next = next
                if (next) next.prev = prev
                elem.prev = null
                elem.next = stat.head
                stat.head.prev = elem
                stat.head = elem
            }
            // console.debug (elem)

            console.assert (! detect_loop (stat), "loop detected")
            return elem.content
        }
    }

    console.assert (! detect_loop (stat), "loop detected")
}

function make_cache (size) {
    var a = new Array (size)
    var head = null
    var last = null

    for (var i = 0; i < a.length; i ++) {
        a[i] = {next: null, prev: null, content: null}
    }

    var stat = {a: a, head: head, last: last}

    return stat
}

////////
// OO interface

KeyValueCache = function (size) {
    this.cache = make_cache (size)
}

KeyValueCache.prototype.store = function (key, value, on_removed) {
    cache_store (this.cache, key, value, on_removed)

    return this
}

KeyValueCache.prototype.lookup = function (key) {
    var content = cache_lookup (this.cache, key)
    return content && content.value
}

//////////

function test () {
    var key = 1234
    var value = "hogehoge";

    var cache = make_cache (5)
    var removed = false

    cache_store (cache, key, value, function () {removed = true})

    cache_store (cache, 1235, "hoge2")
    cache_store (cache, 1236, "hoge3")
    cache_store (cache, 1237, "hoge4")
    cache_store (cache, 1238, "hoge5")

    console.assert (!removed)

    cache_store (cache, 1239, "hoge6")

    console.assert (removed)

    var x = cache_lookup (cache, key)
    console.assert (!x)

    var x2 = cache_lookup (cache, 1238)
    console.assert (x2.value == "hoge5")
    // console.debug (cache.head)
    console.assert (cache.head.content == x2)

    var x3 = cache_lookup (cache, 9999)
    console.assert (!x3)
}

function test_oo () {
    var cache = new KeyValueCache (5)
    console.debug (cache)
    cache.store (1001, "hoge1")
    var result = cache.lookup (1001)
    console.debug (result)
    console.assert (result == "hoge1")
    cache.store (1002, "hoge2").store (1003, "hoge3")
    console.assert (cache.lookup (1003) == "hoge3")
}

console.debug ("start")
test ()
test_oo ()
console.debug ("done")
