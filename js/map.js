$(document).ready (function () {
    var stat = {offset: {x: 0, y: 0},
		start: {x: 0, y: 0}}
    $("body").append (gen_piece (stat, 15, 3))
})

function fill_0 (n) {
    return ("0" + n.toString ()).substr (-2)
}

function gen_piece (stat, i, k) {
    var file = "images/" + fill_0 (i) + "-" + fill_0 (k) + ".png"

    var elem = $('<img>').attr ("src", file).draggable ({
	start: on_start (stat),
	drag: on_drag (stat),
	stop: on_stop (stat)
    })

    return elem
}

function on_drag (stat) {
    return function (event, ui) {
	console.debug (event.clientX - stat.start.x, event.clientY - stat.start.y)
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
