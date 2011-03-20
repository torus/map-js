use strict;
use warnings;

my $size = $ARGV[0] or die;

for my $b (0 .. $size - 1) {
    for my $a (0 .. $size - 1) {
	my $color = ($a + $b) % 2 ? "lightyellow" : "lightblue";
	system (qq<convert -size 256x256 -background $color > .
		qq<-fill gray -pointsize 72 > .
		qq<label:"@{[join(", ",$a,$b)]}" > .
		qq<images/@{[sprintf("0-%02d-%02d",$a,$b)]}.png>
	    );
    }
}
