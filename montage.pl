use strict;
use warnings;

my $level = $ARGV[0] or die;
my $size = $ARGV[1] or die;

my $num = $size / (2 ** $level) - 1;

sub filename {
    my ($level, $m, $n) = @_;
    sprintf("%d-%02d-%02d", $level, $m, $n);
}

for my $b (0 .. $num) {
    for my $a (0 .. $num){
	my ($m, $n) = ($a * 2, $b * 2);
	system (qq<montage -size 256x256 -label "" > .
		qq<images/@{[filename ($level - 1, $m,     $n    )]}.png > .
		qq<images/@{[filename ($level - 1, $m + 1, $n    )]}.png > .
		qq<images/@{[filename ($level - 1, $m,     $n + 1)]}.png > .
		qq<images/@{[filename ($level - 1, $m + 1, $n + 1)]}.png > .
		qq<-geometry 128x128+0+0 > .
		qq<images/@{[sprintf("%d-%02d-%02d", $level, $a, $b)]}.png>
	    );
    }
}
