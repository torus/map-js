function cache_store (stat, key, value) {
    var full = true
    for (var i = 0; i < stat.a.length; i ++) {
        // console.debug (i, stat.a[i])
        var elem = stat.a[i]
        if (! elem.content) {
            elem.content = {key: key, value: value}

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

    if (full) {
        console.assert (stat.last, "last")
        console.assert (stat.head, "head")

        var elem = stat.last
        elem.content = {key: key, value: value}

        // console.debug (elem)
        stat.last = elem.prev
        stat.last.next = null

        elem.prev = null
        elem.next = stat.head
        stat.head.prev = elem

        stat.head = elem

        console.assert (stat.last.next == null, "next of last must be null")
        console.assert (stat.head.prev == null, "prev of head must be null")
    }

    // console.debug (stat.a)
    // console.debug (stat.head.content.key, stat.last.content.key)
}

function cache_lookup (stat, key) {
    for (var elem = stat.head; elem; elem = elem.next) {
        if (elem.content && elem.content.key == key) {
            if (elem.prev) elem.prev.next = elem.next
            if (elem.next) elem.next.prev = elem.prev
            elem.prev = null
            elem.next = stat.head
            stat.head = elem

            // console.debug (elem)

            return elem.content
        }
    }
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

function test () {
    var key = 1234
    var value = "hogehoge";

    var cache = make_cache (5)

    cache_store (cache, key, value)

    cache_store (cache, 1235, "hoge2")
    cache_store (cache, 1236, "hoge3")
    cache_store (cache, 1237, "hoge4")
    cache_store (cache, 1238, "hoge5")
    cache_store (cache, 1239, "hoge6")

    var x = cache_lookup (cache, key)
    console.assert (!x)

    var x2 = cache_lookup (cache, 1238)
    console.assert (x2.value == "hoge5")
    // console.debug (cache.head)
    console.assert (cache.head.content == x2)
}

console.debug ("start")
test ()
console.debug ("done")
