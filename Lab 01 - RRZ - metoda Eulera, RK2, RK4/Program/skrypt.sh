#!/usr/bin/gnuplot

set term png
set grid

#### ZADANIE 1 ####################################################

set output "ex1_sol.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda Eulera"
plot "ex1_sol.dat" i 0 using 1:2 w l t "y num dt= 0.01", "ex1_sol.dat" i 1 using 1:2 w p t "y num dt= 0.1", "ex1_sol.dat" i 2 using 1:2 w p t "y num dt= 1.0"

set output "ex1_err.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda Eulera"
plot "ex1_err.dat" i 0 using 1:2 w l t "dt = 0.01", "ex1_err.dat" i 1 using 1:2 w p t "dt = 0.1", "ex1_err.dat" i 2 using 1:2 w p t "dt = 1.0"

set output "ex1_an.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda Eulera"
plot "ex1_an.dat" i 0 using 1:2 w l t "dt = 0.01"

#### ZADANIE 2 ####################################################

set output "ex2_sol.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda RK2"
plot "ex2_sol.dat" i 0 using 1:2 w l t "y num dt= 0.01", "ex2_sol.dat" i 1 using 1:2 w p t "y num dt= 0.1", "ex2_sol.dat" i 2 using 1:2 w p t "y num dt= 1.0"


set output "ex2_err.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda RK2"
plot "ex2_err.dat" i 0 using 1:2 w l lw 2 t "dt = 0.01", "ex2_err.dat" i 1 using 1:2 w p t "dt = 0.1", "ex2_err.dat" i 2 using 1:2 w p t "dt = 1.0"

set output "ex2_an.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda RK2"
plot "ex2_an.dat" i 0 using 1:2 w l t "dt = 0.01"

#### ZADANIE 3 ####################################################

set output "ex3_sol.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda RK4"
plot "ex3_sol.dat" i 0 using 1:2 w l lw 2 t "y num dt= 0.01", "ex3_sol.dat" i 1 using 1:2 w p t "y num dt= 0.1", "ex3_sol.dat" i 2 using 1:2 w p t "y num dt= 1.0"


set output "ex3_err.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda RK4"
plot "ex3_err.dat" i 0 using 1:2 w l lw 2 t "dt = 0.01", "ex3_err.dat" i 1 using 1:2 w p t "dt = 0.1", "ex3_err.dat" i 2 using 1:2 w p t "dt = 1.0"

set output "ex3_an.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda RK2"
plot "ex3_an.dat" i 0 using 1:2 w l t "dt = 0.01"

#### ZADANIE 4 ####################################################

set output "ex4_sol.png"
set xlabel "t"
set ylabel "Q(t)"
set title "Q(t) metoda RK4"
plot "ex4_sol.dat" i 0 using 1:2 w l t "omega = 0.5omega_0", "ex4_sol.dat" i 1 using 1:2 w l t "omega = 0.8omega_0","ex4_sol.dat" i 2 using 1:2 w l t "omega = 1,0omega_0","ex4_sol.dat" i 3 using 1:2 w l t "omega = 1.2omega_0"