#include <cmath>
#include <cstdio>

//w sumie mogłem korzystać C skoro i tak korzystałem z funkcji z C, ale juz niech tak zostanie
//#define M_PI 3.14
//potrzebne w VS, na taurusie niepotrzebne 

using namespace std;

//PROTOTYPY FUNKCJI
double analytical_sol(double, double);
void ex1_euler(FILE*, FILE*, double);
void ex1_euler_analytically(FILE*, double);

void ex2_rk2(FILE*, FILE*, double);

double rk4_k1(double, double);
double rk4_k2(double, double, double, double);
double rk4_k3(double, double, double, double);
double rk4_k4(double, double, double, double);

void ex3_rk4(FILE* solutions, FILE*, double);

double V_t(double om_v, double t);
double g(double, double, double, double, double, double, double);
void ex4_rlc(double, FILE*, FILE*, double);

int main() {

    FILE* solutions;
    FILE* errors;
    FILE* analytical;

    solutions = fopen("ex1_sol.txt", "w");
    errors = fopen("ex1_err.txt", "w");
    analytical = fopen("ex1_an.txt", "w");

    //wywołanie funkcji dla zadania 1
    ex1_euler(solutions, errors, 0.01);
    ex1_euler(solutions, errors, 0.1);
    ex1_euler(solutions, errors, 1.0);

    ex1_euler_analytically(analytical, 0.01);

    fclose(solutions);
    fclose(errors);
    fclose(analytical);

    //wywołanie funkcji dla zadania 2
    solutions = fopen("ex2_sol.txt", "w");
    errors = fopen("ex2_err.txt", "w");

    ex2_rk2(solutions, errors, 0.01);
    ex2_rk2(solutions, errors, 0.1);
    ex2_rk2(solutions, errors, 1.0);

    fclose(solutions);
    fclose(errors);

    //wywołanie funkcji dla zadania 3
    solutions = fopen("ex3_sol.txt", "w");
    errors = fopen("ex3_err.txt", "w");

    ex3_rk4(solutions, errors, 0.01);
    ex3_rk4(solutions, errors, 0.1);
    ex3_rk4(solutions, errors, 1.0);

    fclose(solutions);
    fclose(errors);

    //wywołanie funkcji dla zadania 4
    FILE* rlcQ;
    FILE* rlcI;
    
    rlcQ = fopen("ex4_Q.txt", "w");
    rlcI = fopen("ex4_I.txt", "w");

    double dt = pow(10.0, -4.0);

    ex4_rlc(0.5, rlcQ, rlcI, dt);
    ex4_rlc(0.8, rlcQ, rlcI, dt);
    ex4_rlc(1.0, rlcQ, rlcI, dt);
    ex4_rlc(1.2, rlcQ, rlcI, dt);

    fclose(rlcQ);
    fclose(rlcI);
}

// Zadanie 1. //////////////////////// EULER /////////////////////////////

double analytical_sol(double lambda, double t) {
    return exp(lambda * t);
}

void ex1_euler(FILE* solutions, FILE* errors, double dt) {
    double lambda = -1.;
    double y = 1.;

    for (double t = 0.; t <= 5.; t += dt) {
        fprintf(solutions, "%f %f \n", t, y);
        fprintf(errors, "%f %f \n", t, y - analytical_sol(lambda, t));

        y = y + dt * (lambda * y);
    }

    //robimy przerwę w plikach
    fprintf(solutions, " \n \n");
    fprintf(errors, " \n \n");
}

void ex1_euler_analytically(FILE* filename, double dt) {
    double lambda = -1.;
    double y = 1.;

    for (double t = 0.; t <= 5.; t += dt) {
        fprintf(filename, "%f %f \n", t, analytical_sol(lambda, t));
    }

    //robimy przerwę w pliku
    fprintf(filename, " \n \n");
}

// Zadanie 2. //////////////////////// RK2 /////////////////////////////

void ex2_rk2(FILE* solutions, FILE* errors, double dt) {
    double lambda = -1.;
    double y = 1.;

    for (double t = 0.; t <= 5.; t += dt) {

        double k_1 = lambda * y;
        double k_2 = lambda * (y + dt * k_1);

        fprintf(solutions, "%f %f \n", t, y);
        fprintf(errors, "%f %f \n", t, y - analytical_sol(lambda, t));

        y = y + (dt / 2.) * (k_1 + k_2);
    }

    fprintf(solutions, " \n \n");
    fprintf(errors, " \n \n");
}

// Zadanie 3. //////////////////////// RK4 /////////////////////////////

void ex3_rk4(FILE* solutions, FILE* errors, double dt) {
    double lambda = -1.;
    double y = 1.;

    for (double t = 0.; t <= 5.; t += dt) {

        double k_1 = rk4_k1(lambda, y);
        double k_2 = rk4_k2(lambda, y, dt, k_1);
        double k_3 = rk4_k3(lambda, y, dt, k_2);
        double k_4 = rk4_k4(lambda, y, dt, k_3);

        fprintf(solutions, "%f %f \n", t, y);
        fprintf(errors, "%f %f \n", t, y - analytical_sol(lambda, t));

        y = y + (dt / 6.) * (k_1 + (2 * k_2) + (2 * k_3) + k_4);
    }

    fprintf(solutions, " \n \n");
    fprintf(errors, " \n \n");
}

//funkcja służąca do obliczenia k_1
double rk4_k1(double lambda, double y) {
    return lambda * y;
}

//funkcja służąca do obliczenia k_2
double rk4_k2(double lambda, double y, double dt, double k_1) {
    return lambda * (y + dt * k_1 / 2.0);
}

//funkcja służąca do obliczenia k_3
double rk4_k3(double lambda, double y, double dt, double k_2) {
    return lambda * (y + dt * k_2 / 2.0);
}

//funkcja służąca do obliczenia k_4
double rk4_k4(double lambda, double y, double dt, double k_3) {
    return lambda * (y + dt * k_3);
}

// Zadanie 4. //////////////////////// RLC /////////////////////////////

void ex4_rlc(double freq, FILE* filenameQ, FILE* filenameI, double dt) {

    double R = 100;
    double L = 0.1;
    double C = 0.001;

    double om_0 = 1.0 / sqrt(L * C);
    double T_0 = 2.0 * M_PI / om_0;

    double Q = 0.0;
    double I = 0.0;

    double om_v = freq * om_0;

    for (double t = 0.; t <= 4 * T_0; t += dt) {

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
        
        fprintf(filenameQ, "%f %f \n", t, Q);
        fprintf(filenameI, "%f %f \n", t, I);
    }

    fprintf(filenameQ, "\n \n");
    fprintf(filenameI, "\n \n");
}

double V_t(double om_v, double t) {
    return 10.0 * sin(om_v * t);
}

double g(double t, double Q, double I, double om_v, double R, double L, double C) {
    return (V_t(om_v, t) / L) - (R * I / L) - (Q / (L * C));
}
