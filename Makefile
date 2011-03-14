dummy:
	@echo dummy

map-data:
	perl -le 'for my $$b (0..31){for my $$a (0..31){system qq(convert -size 256x256 -border 1 -bordercolor blue -background lightyellow -fill gray -pointsize 72 label:"@{[join(", ",$$a,$$b)]}" images/@{[sprintf("%02d-%02d",$$a,$$b)]}.png)}}'
