$(document).ready (function () {
    var stat = {offset: {x: 0, y: 0},
		start: {x: 0, y: 0},
		offset_index: {x: null, y: null},
		cache: new KeyValueCache (25),
		tiles: [],
                window: 8}

    var map_elem = $("<div>").draggable ({
	    start: on_start (stat),
	    drag: on_drag (stat),
	    stop: on_stop (stat)
	})
    $("#map-content").append (map_elem)
    stat.map_elem = map_elem

    render (stat)

    $("#control").append ($("<p>").
                          append ($("<a>").append ("+").click (function () {
                              zoom_in (stat)
                          })).
                          append ($("<a>").append ("-").click (function () {
                              zoom_out (stat)
                          })))
})

function zoom_in (stat) {
    stat.window -= 0.1
    refresh (stat)
}

function zoom_out (stat) {
    stat.window += 0.1
    refresh (stat)
}

function refresh (stat) {
    stat.map_elem.empty ()
    stat.offset_index.x = null
    stat.offset_index.y = null
    render (stat)
}

function render (stat) {
    var w = stat.window
    var level = Math.max (Math.floor (Math.log (w) / Math.LN2), 0)
    var u = 256 * Math.pow (2, level) // unit size in pixel

    var n = Math.floor (stat.offset.x / u)
    var m = Math.floor (stat.offset.y / u)

    if (n < 1) n = 1
    if (m < 1) m = 1

    if (stat.offset_index.x != n || stat.offset_index.y != m) {
	stat.tiles[ 0] = gen_piece (level, u, stat, n - 1, m - 1)
	stat.tiles[ 1] = gen_piece (level, u, stat, n    , m - 1)
	stat.tiles[ 2] = gen_piece (level, u, stat, n + 1, m - 1)
	stat.tiles[ 3] = gen_piece (level, u, stat, n + 2, m - 1)

	stat.tiles[ 4] = gen_piece (level, u, stat, n - 1, m    )
	stat.tiles[ 5] = gen_piece (level, u, stat, n    , m    )
	stat.tiles[ 6] = gen_piece (level, u, stat, n + 1, m    )
	stat.tiles[ 7] = gen_piece (level, u, stat, n + 2, m    )

	stat.tiles[ 8] = gen_piece (level, u, stat, n - 1, m + 1)
	stat.tiles[ 9] = gen_piece (level, u, stat, n    , m + 1)
	stat.tiles[10] = gen_piece (level, u, stat, n + 1, m + 1)
	stat.tiles[11] = gen_piece (level, u, stat, n + 2, m + 1)

	stat.tiles[12] = gen_piece (level, u, stat, n - 1, m + 2)
	stat.tiles[13] = gen_piece (level, u, stat, n    , m + 2)
	stat.tiles[14] = gen_piece (level, u, stat, n + 1, m + 2)
	stat.tiles[15] = gen_piece (level, u, stat, n + 2, m + 2)

	console.debug ("pieces ready")
    }

    stat.offset_index.x = n
    stat.offset_index.y = m

    for (var i in stat.tiles) {
        var t = stat.tiles[i]
        if (t.parent ().length == 0)
            stat.map_elem.append (t)
    }
}

function get_key (level, i, k) {
    // console.debug ("get_key", i, k)
    return level * 10000 + k * 100 + i
}

function fill_0 (n) {
    return ("0" + n.toString ()).substr (-2)
}

function gen_piece (level, u, stat, n, m) {
    // console.debug ("gen_piece", u, n, m)
    var w = stat.window
    var file = "images/" + [level, fill_0 (n), fill_0 (m)].join ("-") + ".png"

    var elem = stat.cache.lookup (get_key (level, n, m))
    if (! elem) {
	elem = $('<img>').attr ("src", file)
	stat.cache.store (get_key (level, n, m), elem, function () {elem.remove ()})
    }

    var px = n * u
    var py = m * u
    var css = {position: "absolute",
	       left: Math.floor (px / w).toString () + "px",
	       top: Math.floor (py / w).toString () + "px",
               width: Math.floor (u / w).toString () + "px",
               height: Math.floor (u / w).toString () + "px"}
    // console.debug ("css", css)
    elem.css (css)

    return elem
}

function on_drag (stat) {
    return function (event, ui) {
	// console.debug (event.clientX - stat.start.x, event.clientY - stat.start.y)
	stat.offset.x -= (event.clientX - stat.start.x) * stat.window
	stat.offset.y -= (event.clientY - stat.start.y) * stat.window

	render (stat)

	stat.start.x = event.clientX
	stat.start.y = event.clientY
    }
}

function on_start (stat) {
    return function (event, ui) {
	stat.start.x = event.clientX
	stat.start.y = event.clientY
    }
}

function on_stop (stat) {
    return function (event, ui) {
	stat.offset.x -= (event.clientX - stat.start.x) * stat.window
	stat.offset.y -= (event.clientY - stat.start.y) * stat.window

	console.debug (stat.offset.x, stat.offset.y)

	render (stat)
    }
}
