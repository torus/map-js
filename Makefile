MAPSIZE = 16

all: map-data-4

dummy:
	@echo dummy

map-data:
	perl make_images.pl $(MAPSIZE)

map-data-1: map-data
	perl montage.pl 1 $(MAPSIZE)

map-data-2: map-data-1
	perl montage.pl 2 $(MAPSIZE)

map-data-3: map-data-2
	perl montage.pl 3 $(MAPSIZE)

map-data-4: map-data-3
	perl montage.pl 4 $(MAPSIZE)
