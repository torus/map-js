$(document).ready (function () {
    var stat = {offset: {x: 0, y: 0},
		start: {x: 0, y: 0},
		offset_index: {x: null, y: null},
		cache: new KeyValueCache (50),
		tiles: []}

    var map_elem = $("<div>").draggable ({
	    start: on_start (stat),
	    drag: on_drag (stat),
	    stop: on_stop (stat)
	})
    $("body").append (map_elem)
    stat.map_elem = map_elem
    init (stat)
})

function init (stat) {
    var u = 256			// unit size in pixel
    var ox = Math.floor (stat.offset.x / u)
    var oy = Math.floor (stat.offset.y / u)

    if (ox == 0) ox = 1
    if (oy == 0) oy = 1

    if (stat.offset_index.x != ox || stat.offset_index.y != oy) {
	stat.tiles[ 0] = gen_piece (stat, ox - 1, oy - 1)
	stat.tiles[ 1] = gen_piece (stat, ox    , oy - 1)
	stat.tiles[ 2] = gen_piece (stat, ox + 1, oy - 1)
	stat.tiles[ 3] = gen_piece (stat, ox + 2, oy - 1)

	stat.tiles[ 4] = gen_piece (stat, ox - 1, oy    )
	stat.tiles[ 5] = gen_piece (stat, ox    , oy    )
	stat.tiles[ 6] = gen_piece (stat, ox + 1, oy    )
	stat.tiles[ 7] = gen_piece (stat, ox + 2, oy    )

	stat.tiles[ 8] = gen_piece (stat, ox - 1, oy + 1)
	stat.tiles[ 9] = gen_piece (stat, ox    , oy + 1)
	stat.tiles[10] = gen_piece (stat, ox + 1, oy + 1)
	stat.tiles[11] = gen_piece (stat, ox + 2, oy + 1)

	stat.tiles[12] = gen_piece (stat, ox - 1, oy + 2)
	stat.tiles[13] = gen_piece (stat, ox    , oy + 2)
	stat.tiles[14] = gen_piece (stat, ox + 1, oy + 2)
	stat.tiles[15] = gen_piece (stat, ox + 2, oy + 2)
    }

    stat.offset_index.x = ox
    stat.offset_index.y = oy

    for (var i in stat.tiles) {
	var t = stat.tiles[i]
	stat.map_elem.append (t)
    }
}

function get_key (i, k) {
    // console.debug ("get_key", i, k)
    return k * 100 + i
}

function fill_0 (n) {
    return ("0" + n.toString ()).substr (-2)
}

function gen_piece (stat, i, k) {
    var file = "images/" + fill_0 (i) + "-" + fill_0 (k) + ".png"

    var elem = stat.cache.lookup (get_key (i, k))
    if (! elem) {
	elem = $('<img>').attr ("src", file).css ({position: "absolute",
						   top: (k * 256).toString () + "px",
						   left: (i * 256).toString () + "px"})
	stat.cache.store (get_key (i, k), elem, function () {elem.remove ()})
    }

    return elem
}

function on_drag (stat) {
    return function (event, ui) {
	// console.debug (event.clientX - stat.start.x, event.clientY - stat.start.y)
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
	stat.offset.x += event.clientX - stat.start.x
	stat.offset.y += event.clientY - stat.start.y

	console.debug (stat.offset.x, stat.offset.y)
    }
}
