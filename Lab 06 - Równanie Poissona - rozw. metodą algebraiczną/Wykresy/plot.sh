#!/usr/bin/gnuplot
set term png

set output "map1_a.png"
set xlabel "x"
set ylabel "y"
set title "n_x = n_y = 50"
set pm3d map
set palette defined (-10 "blue", 0 "white", 10 "red")
set size ratio -1

splot [0:5][0:5] "map1_a.txt" i 0 u 2:1:3

reset

set output "map1_b.png"
set xlabel "x"
set ylabel "y"
set title "n_x = n_y = 100"
set pm3d map
set palette defined (-10 "blue", 0 "white", 10 "red")
set size ratio -1

splot [0:10][0:10] "map1_b.txt" i 0 u 2:1:3

reset

set output "map1_c.png"
set xlabel "x"
set ylabel "y"
set title "n_x = n_y = 200"
set pm3d map
set palette defined (-10 "blue", 0 "white", 10 "red")
set size ratio -1

splot [0:20][0:20] "map1_c.txt" i 0 u 2:1:3

reset

set output "map2_a.png"
set xlabel "x"
set ylabel "y"
set title "epsilon_1 = epsilon_2 = 1"
set pm3d map
set palette defined (-1 "blue", 0 "white", 1 "red")
set size ratio -1

splot [0:10][0:10][-0.8:0.8] "map2_a.txt" i 0 u 2:1:3


reset

set output "map2_b.png"
set xlabel "x"
set ylabel "y"
set title "epsilon_1 = 1, epsilon_2 = 2"
set pm3d map
set palette defined (-1 "blue", 0 "white", 1 "red")
set size ratio -1
set cbrange [-0.8:0.8]

splot [0:10][0:10][-0.8:0.8] "map2_b.txt" i 0 u 2:1:3


reset

set output "map2_c.png"
set xlabel "x"
set ylabel "y"
set title "epsilon_1 = 1, epsilon_2 = 10"
set pm3d map
set palette defined (-1 "blue", 0 "white", 1 "red")
set size ratio -1
set cbrange [-0.8:0.8]

splot [0:10][0:10][-0.8:0.8] "map2_c.txt" i 0 u 2:1:3
