// W tym zadaniu nie korzystam z Javascript, ponieważ korzystamy z biblioteki z C++
#include <cstdio>
#include <cmath>
#include <cstdlib>

#include "mgmres.h"
#include "mgmres.cpp"

// Ustalamy początkowe wartości parametrów
#define delta 0.1

//PROTOTYPY FUNKCJI
int N(int, int);
int j(int, int);
int i(int, int);

double factor(int, int, int, int);
double ro_1(double, double, double, double, double);
double ro_2(double, double, double, double, double);

int dirichletAlgo(double, double, double, double, int, int, int *, int *, double *, double *,double, double, int, int, FILE *, FILE *);

void poisson(int n_x, int n_y, int V_1, int V_2, int V_3, int V_4, double x_max, double y_max, int epsilon_1, int epsilon_2, FILE * matrix, FILE * vector, FILE * map = NULL){

	// Wektory defniujące macierz układu: 
    double a[5 * N(n_x,n_y)];

	int ja[5 * N(n_x,n_y)];

	int ia[N(n_x,n_y) + 1];

	double b[N(n_x,n_y)];

	double V[N(n_x,n_y)];
    
	// Wypełnianie macierzy rzadkiej algorytmem
    int nz_num = dirichletAlgo(V_1, V_2, V_3, V_4, n_x, n_y, ja, ia, a, b, x_max, y_max, epsilon_1, epsilon_2,  matrix, vector);

	// Wartości parametrów
    int itr_max = 500;
    int mr = 500;
    double tol_abs = pow(10,-8);
    double tol_rel = pow(10,-8);

    pmgmres_ilu_cr(N(n_x,n_y), nz_num, ia, ja, a, V, b, itr_max, mr, tol_abs, tol_rel);

	// Zapisujemy mapę do pliku, jeśli dostaniemy w argumentach plik do którego mamy to zapisać
	if(map){
		double temp = 0.;

		for(int k = 0; k < N(n_x, n_y); ++k){

			if(delta * j(n_x,k) > temp){
				fprintf(map,"\n");
			}

			fprintf(map, "%f %f %f \n", delta * j(n_x, k), delta * i(n_x, k), V[k]);

			temp = delta * j(n_x,k);
		}
	}
}

int main(){
	
	// Ustalamy początkowe wartości parametrów (Podpunkt 1)
    int n_x = 4;
    int n_y = 4;

    int epsilon_1 = 1;
    int epsilon_2 = 1;

    int V_1 = 10;
    int V_2 = -10;
    int V_3 = 10;
    int V_4 = -10;

    double x_max = 0;
    double y_max = 0;



	// W celu sprawdzenia poprawności wypełnienia macierzy A i wektora b należy zapisać je do pliku
    FILE * matrix = fopen("matrix.txt", "w");
    FILE * vector = fopen("vector.txt", "w");

	// Argumenty bez pliku do zapisywania map na końcu
    poisson(n_x, n_y, V_1, V_2, V_3, V_4, x_max, y_max, epsilon_1, epsilon_2, matrix, vector);

    fclose(matrix);
    fclose(vector);

	// Podpunkt 5

	// a)
	n_x = 50;
	n_y = 50;

 	matrix = fopen("temp.txt", "w");
    vector = fopen("temp.txt", "w");
	
	FILE * map = fopen("map1_a.txt", "w");
    poisson(n_x, n_y, V_1, V_2, V_3, V_4, x_max, y_max, epsilon_1, epsilon_2, matrix, vector, map);
    fclose(map);

	// b)
	n_x = 100;
	n_y = 100;
	
	map = fopen("map1_b.txt", "w");
    poisson(n_x, n_y, V_1, V_2, V_3, V_4, x_max, y_max, epsilon_1, epsilon_2, matrix, vector, map);
    fclose(map);
	
	// c)
	n_x = 200;
	n_y = 200;
	
	map = fopen("map1_c.txt", "w");
    poisson(n_x, n_y, V_1, V_2, V_3, V_4, x_max, y_max, epsilon_1, epsilon_2, matrix, vector, map);
    fclose(map);

	// Podpunkt 6
	n_x = 100;
	n_y = 100;
	V_1 = V_2 = V_3 = V_4 = 0;
	x_max = delta * n_x;
	y_max = delta * n_y;

	// a)
	map = fopen("map2_a.txt", "w");
    poisson(n_x, n_y, V_1, V_2, V_3, V_4, x_max, y_max, epsilon_1, epsilon_2, matrix, vector, map);
    fclose(map);

	// b)
	epsilon_1 = 1;
	epsilon_2 = 2;

	map = fopen("map2_b.txt", "w");
    poisson(n_x, n_y, V_1, V_2, V_3, V_4, x_max, y_max, epsilon_1, epsilon_2, matrix, vector, map);
    fclose(map);

	//c) 
	epsilon_1 = 1;
	epsilon_2 = 10;

	map = fopen("map2_c.txt", "w");
    poisson(n_x, n_y, V_1, V_2, V_3, V_4, x_max, y_max, epsilon_1, epsilon_2, matrix, vector, map);
    fclose(map);

    fclose(matrix);
    fclose(vector);
}

// Funkcja obliczająca N
int N(int n_x, int n_y){
    return (n_x + 1) * (n_y + 1);
}

// Funkcja obliczająca j - Równanie 12
int j(int n_x, int l){
    return (floor(l / (n_x + 1)));
}

// Funkcja obliczająca i - Równanie 13
int i(int n_x, int l){
    return l - j(n_x, l) * (n_x + 1);
}

// Ustalanie elementów macierzy - Równanie 21
double factor(int n_x, int l, int epsilon_1, int epsilon_2){
    if(i(n_x, l) <= n_x/2)
        return epsilon_1;
    else
        return epsilon_2;
}

// Równanie 25
double ro_1(double x, double y, double x_max, double y_max, double sig) {
	return exp(-1 * pow(x - 0.25 * x_max, 2) / pow(sig, 2) - pow(y - 0.5 * y_max, 2) / pow(sig, 2));
}

// Równanie 26
double ro_2(double x, double y, double x_max, double y_max, double sig) {
	return -1 * exp(-1 * pow(x - 0.75 * x_max, 2) / pow(sig, 2) - pow(y - 0.5 * y_max, 2) / pow(sig, 2));
}

// Algorytm wypełniania macierzy rzadkiej w formacie CSR + WB Dirichleta
int dirichletAlgo(double V_1, double V_2, double V_3, double V_4, int n_x, int n_y, int *ja, int *ia, double *a, double *b,double x_max, double y_max, int epsilon_1, int epsilon_2, FILE *matrix, FILE *vector) {
	
	// Inicjalizacja
	int k = -1;
	int nz_num = 0;

	for(int l = 0; l < N(n_x, n_y); ++l) {
		int brzeg = 0;  
		double vb = 0;  

		if(i(n_x, l) == 0){
			brzeg = 1;
			vb = V_1;
		}

		else if(i(n_x, l) == n_x){
			brzeg = 1;
			vb = V_3;
		}

		else if(j(n_x, l) == n_y){
			brzeg = 1;
			vb = V_2;
		}

		else if(j(n_x, l) == 0){
			brzeg = 1;
			vb = V_4;
		}

		// Wypełniamy od razu wektor wyrazów wolnych
        b[l] = (-1) * (ro_1(delta * i(n_x, l), delta * j(n_x, l), x_max, y_max, x_max / 10) + ro_2(delta * i(n_x,l), delta * j(n_x,l), x_max, y_max, x_max / 10)); 


		if(brzeg == 1)
			b[l] = vb;

		ia[l] = -1; // wskaźnik dla pierwszego el . w wierszu

		if(l - n_x - 1 > 0 && brzeg == 0){
			k++;
			if(ia[l] < 0)
                ia[l] = k;

			a[k] = factor(n_x, l, epsilon_1, epsilon_2) / pow(delta, 2);
			ja[k] = l - n_x - 1;
		}

		if(l-1 > 0 && brzeg == 0) {
			k++;
			if(ia[l] < 0)
                ia[l] = k;
			a[k] = factor(n_x, l, epsilon_1, epsilon_2) / pow(delta, 2);
			ja[k] = l - 1;
		}

		k++;
		if(ia[l] < 0)
            ia[l] = k;

		if(brzeg == 0)
			a[k] = -(2 * factor(n_x, l, epsilon_1, epsilon_2) + factor(n_x, l+1, epsilon_1, epsilon_2) + factor(n_x, l + n_x + 1, epsilon_1, epsilon_2)) / pow(delta, 2);
		else
			a[k] = 1;

		ja[k] = l;

		if(l < N(n_x, n_y) && brzeg == 0){
			k++;
			a[k] = factor(n_x, l + 1, epsilon_1, epsilon_2) / pow(delta, 2);
			ja[k] = l + 1;
		}

		if(l < N(n_x, n_y)- n_x - 1 && brzeg == 0){
			k++;
			a[k] = factor(n_x, l + n_x + 1, epsilon_1, epsilon_2) / pow(delta, 2);
			ja[k] = l + n_x + 1;
		}

        if(l % 5 == 0 && l != 0)
            fprintf(vector, "\n");

        fprintf(vector,"%d %d %d %f \n", l, i(n_x,l), j(n_x,l), b[l]);

    }

	nz_num = k + 1; // ilosc niezerowych elementow (1 element ma indeks 0)

	ia[N(n_x, n_y)] = nz_num;

    for(int k = 0; k < 5*N(n_x, n_y); k++)
        fprintf(matrix, "%d %0.f \n", k, a[k]);

    return nz_num;
}



