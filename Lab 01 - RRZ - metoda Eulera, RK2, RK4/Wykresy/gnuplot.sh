set term png

#### ZADANIE 1 ####################################################

set output "ex1_sol.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda Eulera - rozwiązanie"
plot "ex1_sol.txt" i 0 using 1:2 w p lw 1 pt 1 t "dt = 0.01", "ex1_sol.txt" i 1 using 1:2 w p pt 2 t "dt = 0.1", "ex1_sol.txt" i 2 using 1:2 w p lw 1 pt 6 t "dt = 1.0", "ex1_an.txt" i 0 using 1:2 w l lt 2 t "analitycznie" 

set output "ex1_err.png"
set xlabel "t"
set ylabel "y_n(t) - y_a(t)"
set title "Metoda Eulera - błąd globalny"
plot "ex1_err.txt" i 0 using 1:2 w p lw 1 pt 1 t "dt = 0.01", "ex1_err.txt" i 1 using 1:2 w p lw 1 pt 2 t "dt = 0.1", "ex1_err.txt" i 2 using 1:2 w l lw 1 lt 3 t "dt = 1.0"

#### ZADANIE 2 ####################################################

set output "ex2_sol.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda RK2 - rozwiązanie"
plot "ex2_sol.txt" i 0 using 1:2 w p lw 1 pt 1 t "dt = 0.01", "ex2_sol.txt" i 1 using 1:2 w p lw 1 pt 2 t "dt = 0.1", "ex2_sol.txt" i 2 using 1:2 w p lw 1 pt 6 t "dt = 1.0", "ex1_an.txt" i 0 using 1:2 w l lt 2 t "analitycznie"


set output "ex2_err.png"
set xlabel "t"
set ylabel "y_n(t) - y_a(t)"
set title "Metoda RK2 - błąd globalny"
plot "ex2_err.txt" i 0 using 1:2 w p lw 1 pt 1 t "dt = 0.01", "ex2_err.txt" i 1 using 1:2 w p lw 1 pt 2 t "dt = 0.1", "ex2_err.txt" i 2 using 1:2 w l lw 1 lt 3 t "dt = 1.0"

#### ZADANIE 3 ####################################################

set output "ex3_sol.png"
set xlabel "t"
set ylabel "y(t)"
set title "Metoda RK4 - rozwiązanie"
plot "ex3_sol.txt" i 0 using 1:2 w p lw 1 pt 1 t "dt = 0.01", "ex3_sol.txt" i 1 using 1:2 w p lw 1 pt 2 t "dt = 0.1", "ex3_sol.txt" i 2 using 1:2 w p lw 1 pt 6 t "dt = 1.0", "ex1_an.txt" i 0 using 1:2 w l lt 2 t "analitycznie"


set output "ex3_err.png"
set xlabel "t"
set ylabel "y_n(t) - y_a(t)"
set title "Metoda RK4 - błąd globalny"
plot "ex3_err.txt" i 0 using 1:2 w p lw 1 pt 1 t "dt = 0.01", "ex3_err.txt" i 1 using 1:2 w p lw 1 pt 2 t "dt = 0.1", "ex3_err.txt" i 2 using 1:2 w l lw 1 lt 3 t "dt = 1.0"

#### ZADANIE 4 ####################################################

set output "ex4_Q.png"
set xlabel "t"
set ylabel "Q(t)"
set title "Q(t) metoda RK4"
plot "ex4_Q.txt" i 0 using 1:2 w l lw 1 t "0.5 om_0", "ex4_Q.txt" i 1 using 1:2 w l lw 1 t "0.8 om_0","ex4_Q.txt" i 2 using 1:2 w l lw 1 t "1.0 om_0","ex4_Q.txt" i 3 using 1:2 w l lw 1 t "1.2 om_0"

set output "ex4_I.png"
set xlabel "t"
set ylabel "I(t)"
set title "I(t) metoda RK4"
plot "ex4_I.txt" i 0 using 1:2 w l lw 1 t "0.5 om_0", "ex4_I.txt" i 1 using 1:2 w l lw 1 t "0.8 om_0","ex4_I.txt" i 2 using 1:2 w l lw 1 t "1.0 om_0","ex4_I.txt" i 3 using 1:2 w l lw 1 t "1.2 om_0"