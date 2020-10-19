#include <array>
#include <cmath>
#include <string>
#include <vector>

#define M_PI 3.14

using namespace std;

// Zadanie 1. //////////////////////// EULER /////////////////////////////

double FUNCTIONX(double lambda, double t) {
    return exp(lambda * t);
}

void ex1_euler(FILE* solutions, FILE* errors, double dt) {
    //początek i koniec naszego zakresu
    double t_min = 0.0;
    double t_max = 5.0;
    double lambda = -1.;

    double y = 1.;

    for (double t = t_min; t <= t_max; t += dt) {
        y = y + dt * (lambda * y);      

        fprintf(solutions, "%f %f \n", t, y);
        fprintf(errors, "%f %f \n", t, y - FUNCTIONX(lambda, t));
    }

    //robimy przerwę w plikach
    fprintf(solutions, " \n \n");
    fprintf(errors, " \n \n");
}

void ex1_euler_analytically(FILE* filename, double dt) {
    //początek i koniec naszego zakresu
    double t_min = 0.0;
    double t_max = 5.0;
    double lambda = -1.;

    double y = 1.;

    for (double t = t_min; t <= t_max; t += dt) {
        fprintf(filename, "%f %f \n", t, FUNCTIONX(lambda, t));
    }

    //robimy przerwę w pliku
    fprintf(filename, " \n \n");
}

// Zadanie 2. //////////////////////// RK2 /////////////////////////////

void ex2_rk2(FILE* solutions, FILE* errors, double dt) {
    double t_min = 0.0;
    double t_max = 5.0;
    double lambda = -1.;

    double y = 1.;
  

    for (double t = t_min; t <= t_max; t += dt) {
        double k_1 = lambda * y;
        double k_2 = lambda * (y + dt * k_1);

        y = y + (dt / 2.) * (k_1 + k_2);

        fprintf(solutions, "%f %f \n", t, y);
        fprintf(errors, "%f %f \n", t, y - FUNCTIONX(lambda, t));
    }

    fprintf(solutions, " \n \n");
    fprintf(errors, " \n \n");
}

//wiem, ta funkcja jest taka sama jak z przykładu pierwszego, 
//lecz po prostu chciałem żeby się jakoś wyróżniały
void ex2_rk2_analytically(FILE* filename, double dt) {
    //początek i koniec naszego zakresu
    double t_min = 0.0;
    double t_max = 5.0;
    double lambda = -1.;

    double y = 1.;

    for (double t = t_min; t <= t_max; t += dt) {
        fprintf(filename, "%f %f \n", t, FUNCTIONX(lambda, t));
    }

    //robimy przerwę w pliku
    fprintf(filename, " \n \n");
}

// Zadanie 3. //////////////////////// RK4 /////////////////////////////

//funckja służąca do obliczenia k_1
double rk4_k1(double lambda, double y) {
    return lambda * y;
}

//funckja służąca do obliczenia k_2
double rk4_k2(double lambda, double y, double dt, double k_1) {
    return lambda * (y + dt * k_1 / 2.0);
}

//funckja służąca do obliczenia k_3
double rk4_k3(double lambda, double y, double dt, double k_2) {
    return lambda * (y + dt * k_2 / 2.0);
}

//funckja służąca do obliczenia k_4
double rk4_k4(double lambda, double y, double dt, double k_3) {
    return lambda * (y + dt * k_3);
}


void ex3_rk4(FILE* solutions, FILE* errors, double dt) {
    //początek i koniec naszego zakresu
    double t_min = 0.0;
    double t_max = 5.0;
    double lambda = -1.;

    double y = 1.;

    for (double t = t_min; t <= t_max; t += dt) {

        double k_1 = rk4_k1(lambda, y);
        double k_2 = rk4_k2(lambda, y, dt, k_1);
        double k_3 = rk4_k3(lambda, y, dt, k_2);
        double k_4 = rk4_k4(lambda, y, dt, k_3);

        y = y + (dt / 6.) * (k_1 + (2 * k_2) + (2 * k_3) + k_4);

        fprintf(solutions, "%f %f \n", t, y);
        fprintf(errors, "%f %f \n", t, y - FUNCTIONX(lambda, t));
        
    }

    fprintf(solutions, " \n \n");
    fprintf(errors, " \n \n");
}

//wiem, ta funkcja jest taka sama jak z przykładu pierwszego, 
//lecz po prostu chciałem żeby się jakoś wyróżniały
void ex3_rk4_analytically(FILE* filename, double dt) {
    //początek i koniec naszego zakresu
    double t_min = 0.0;
    double t_max = 5.0;
    double lambda = -1.;

    double y = 1.;

    for (double t = t_min; t <= t_max; t += dt) {
        fprintf(filename, "%f %f \n", t, FUNCTIONX(lambda, t));
    }

    //robimy przerwę w pliku
    fprintf(filename, " \n \n");
}

// Zadanie 4. //////////////////////// RLC /////////////////////////////

double V_t(double om_v, double t) {
    return 10.0 * sin(om_v * t);
}

double g(double t, double Q, double I, double om_v, double R, double L, double C) {
    return (V_t(om_v, t) / L) - (R * I / L) - (Q / (L * C));
}

void ex4_rlc(double freq, FILE* filename, double dt) {
    double R = 100;
    double L = 0.1;
    double C = 0.001;

    double om_0 = 1.0 / sqrt(L * C);
    double T_0 = 2.0 * M_PI / om_0;

    double t_min = 0.0;
    double t_max = 4 * T_0;

    double Q = 0.0;
    double I = 0.0;

    double om_v = freq * om_0;

    for (double t = t_min; t <= t_max; t += dt) {

        double kq_1 = I;
        double ki_1 = g(t, Q, I, om_v, R, L, C);

        double kq_2 = I + dt * ki_1 / 2.0;
        double ki_2 = g(t + dt / 2.0, Q + dt * kq_1 / 2.0, I + dt * ki_1 / 2.0, om_v, R, L, C);

        double kq_3 = I + dt * ki_2 / 2.0;
        double ki_3 = g(t + dt / 2.0, Q + dt * kq_2 / 2.0, I + dt * ki_2 / 2.0, om_v, R, L, C);

        double kq_4 = I + dt * ki_3;
        double ki_4 = g(t + dt, Q + dt * kq_3, I + dt * ki_3, om_v, R, L, C);

        Q = Q + (dt / 6) * (kq_1 + (2 * kq_2) + (2 * kq_3) + kq_4);
        I = I + (dt / 6) * (ki_1 + (2 * ki_2) + (2 * ki_3) + ki_4);
        
        fprintf(filename, "%f %f \n", t, Q);
    }

    fprintf(filename, "\n \n");
}

int main() {

    FILE* solutions;

    FILE* errors;

    FILE* analytical;
    
    solutions = fopen("ex1_sol.dat", "w");
    errors = fopen("ex1_err.dat", "w");
    analytical = fopen("ex1_an.dat", "w");

    //wywołanie funkcji dla zadania 1
    ex1_euler(solutions, errors, 0.01);
    ex1_euler(solutions, errors, 0.1);
    ex1_euler(solutions, errors, 1.0);

    ex1_euler_analytically(analytical, 0.01);

    fclose(solutions);
    fclose(errors);
    fclose(analytical);

    //wywołanie funkcji dla zadania 2
    solutions = fopen("ex2_sol.dat", "w");
    errors = fopen("ex2_err.dat", "w");
    analytical = fopen("ex2_an.dat", "w");

    ex2_rk2(solutions, errors, 0.01);
    ex2_rk2(solutions, errors, 0.1);
    ex2_rk2(solutions, errors, 1.0);

    ex2_rk2_analytically(analytical, 0.01);

    fclose(solutions);
    fclose(errors);
    fclose(analytical);

    //wywołanie funkcji dla zadania 3
    solutions = fopen("ex3_sol.dat", "w");
    errors = fopen("ex3_err.dat", "w");
    analytical = fopen("ex3_an.dat", "w");

    ex3_rk4(solutions, errors, 0.01);
    ex3_rk4(solutions, errors, 0.1);
    ex3_rk4(solutions, errors, 1.0);

    ex3_rk4_analytically(analytical, 0.01);

    fclose(solutions);
    fclose(errors);
    fclose(analytical);

    //wywołanie funkcji dla zadania 4
    FILE* rlc;

    rlc = fopen("ex4_sol.dat", "w");
    
    double dt = pow(10.0, -4.0);

    ex4_rlc(0.5, rlc, dt);
    ex4_rlc(0.8, rlc, dt);
    ex4_rlc(1.0, rlc, dt);
    ex4_rlc(1.2, rlc, dt);

    fclose(rlc);
}