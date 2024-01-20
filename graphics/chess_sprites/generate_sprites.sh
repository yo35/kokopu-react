#!/bin/bash
################################################################################
#                                                                              #
#     Kokopu-React - A React-based library of chess-related components.        #
#     <https://www.npmjs.com/package/kokopu-react>                             #
#     Copyright (C) 2021-2024  Yoann Le Montagner <yo35 -at- melix.net>        #
#                                                                              #
#     Kokopu-React is free software: you can redistribute it and/or            #
#     modify it under the terms of the GNU Lesser General Public License       #
#     as published by the Free Software Foundation, either version 3 of        #
#     the License, or (at your option) any later version.                      #
#                                                                              #
#     Kokopu-React is distributed in the hope that it will be useful,          #
#     but WITHOUT ANY WARRANTY; without even the implied warranty of           #
#     MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the             #
#     GNU Lesser General Public License for more details.                      #
#                                                                              #
#     You should have received a copy of the GNU Lesser General                #
#     Public License along with this program. If not, see                      #
#     <http://www.gnu.org/licenses/>.                                          #
#                                                                              #
################################################################################


# This script aims at generating the .png sprite files corresponding the .svg files
# saved in /chess-sprites and its sub-directories.
# The generated .png files are saved in git, thus no need to call this script during the package build. 

# Output sprite size
size=96

# Output directory
output_dir=../src/sprites
cd `dirname $0`
mkdir -p $output_dir


function echo_pieceset {
	echo ""
	echo "#################################################"
	echo "# Pieceset $1"
	echo "#################################################"
	echo ""
}


function echo_sprite {
	echo "Processing sprite $1..."
}



################################################################################
# CBURNETT
################################################################################

function export_cburnett {

	echo_pieceset "cburnett"

	codes=$1
	for code in $codes; do

		echo_sprite $code

		# Input/output files
		input=cburnett/$code.svg
		output=$output_dir/cburnett-$code.png

		# Create the sprite
		inkscape -e $output -w $size -h $size $input > /dev/null

	done
}



################################################################################
# MMONGE
################################################################################

function export_mmonge {

	codes=$1
	piecesets=$2

	for pieceset in $piecesets; do

		echo_pieceset $pieceset

		for code in $codes; do

			echo_sprite $code

			colorcode=${code:0:1}
			piececode=${code:1:1}

			if [ "$piececode" == "x" ]; then

				# Input/output files
				input=mmonge/$pieceset-$code.svg
				output=$output_dir/$pieceset-$code.png

				# Create the sprite
				inkscape -e $output -w $size -h $size $input > /dev/null

			else

				# Input/output files
				input=mmonge/$pieceset.svg
				output=$output_dir/$pieceset-$code.png

				# Area to extract from the source file
				x1=`expr "(" index "kqrbnp" $piececode ")" "*" 200`
				y1=`expr "(" index "wb" $colorcode ")" "*" 200`
				x0=`expr $x1 - 200`
				y0=`expr $y1 - 200`
				area="$x0:$y0:$x1:$y1"

				# Create the sprite
				inkscape -e $output -a $area -w $size -h $size $input > /dev/null
			fi

		done
	done
}



################################################################################
# RUN THE EXPORTS
################################################################################

export_cburnett "bb bk bn bp bq br bx wb wk wn wp wq wr wx"
export_mmonge "bb bk bn bp bq br wb wk wn wp wq wr" "celtic eyes fantasy skulls spatial"
export_mmonge "bx wx" "celtic eyes-spatial fantasy skulls"
