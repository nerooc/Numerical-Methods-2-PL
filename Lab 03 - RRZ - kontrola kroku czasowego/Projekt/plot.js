// Przyjmujemy parametry startowe 
const x_0 = 0.01;
const v0 = 0;
const dt_0 = 1.0;
const S = 0.75;
const p = 2.0;
const t_max = 40.0;

// FUNKCJE RRZ 1 rzędu

// Funkcja f zwraca wartość którą otrzymuje, więc pomijam
// f(t, x, v) = v

//t nieużywane
function g(x, v, alpha){
    return (alpha * (1 - Math.pow(x, 2)) * v - x);
}

// Exercise 1. //////////////////////// Dwie metody: trapezów i RK2 /////////////////////////////

// Problem jest dwuwymiarowy więc definiujemy dwie funkcje nieliniowe:
function F(x_n1, x_n, v_n1, v_n, dt){
    return x_n1 - x_n - (dt/2) * (v_n + v_n1);
}

function G(x_n1, x_n, v_n1, v_n, dt, alpha){
    return v_n1 - v_n - (dt/2) * (g(x_n, v_n, alpha) + g(x_n1, v_n1, alpha));
}

// Równania 16 - 19 służące do obliczenia elementów macierzowych
function a_11(){
    return 1;
}

function a_12(dt){
    return (-1) * (dt/2);
}

function a_21(dt, x_n1k, v_n1k, alpha){
    return (-1) * (dt/2) * (((-2) * alpha * x_n1k * v_n1k) - 1);
}

function a_22(dt, x_n1k, alpha){
    return (1 - (dt/2) * alpha * (1 - Math.pow(x_n1k, 2)));
}

// Metoda trapezów
function ex1_trapezy(x_n, v_n, dt, alpha){
    //na początku przyjmujemy
    let x_n1 = x_n;
    let v_n1 = v_n;
    
    let delta = Math.pow(10, -10);

    while(1){

        let v_n1k = v_n1;
        let x_n1k = x_n1;

        // Równanie 21
        let dx = ((-1) * F(x_n1, x_n, v_n1, v_n, dt) * a_22(dt, x_n1k, alpha) - (-1) * G(x_n1, x_n, v_n1, v_n, dt, alpha) * a_12(dt))/(a_11() * a_22(dt, x_n1k, alpha) - a_12(dt) * a_21(dt, x_n1k, v_n1k, alpha));

        // Równanie 22
        let dv = (a_11() * (-1) * G(x_n1, x_n, v_n1, v_n, dt, alpha) - a_21(dt, x_n1k, v_n1k, alpha) * (-1) * F(x_n1, x_n, v_n1, v_n, dt))/(a_11() * a_22(dt, x_n1k, alpha) - a_12(dt) * a_21(dt, x_n1k, v_n1k, alpha));

        // Równanie 23
        x_n1 = x_n1k + dx;

        // Równanie 24
        v_n1 = v_n1k + dv;

        //Warunek stopu
        if(Math.abs(dx) < delta && Math.abs(dv) < delta){
            break;
        }
    } 

    return {
        x: x_n + (dt/2) * (v_n + v_n1),
        v: v_n + (dt/2) * (g(x_n, v_n, alpha) + g(x_n1, v_n1, alpha))
    };
}

//Metoda RK2
function ex2_rk2(x_n, v_n, dt, alpha){
    let k_1x = v_n;
    let k_1v = g(x_n, v_n, alpha);

    let k_2x = v_n + dt * k_1v;
    let k_2v = g(x_n + dt * k_1x, v_n + dt * k_1v, alpha);

    return {
        x: x_n + (dt/2) * (k_1x + k_2x),
        v: v_n + (dt/2) * (k_1v + k_2v)
    };
}

// Exercise 2. //////////////////////// Algorytm kontroli kroku czasowego /////////////////////////////

//algorytm uniwersalny, przyjmuje wskaznik na schemat numeryczny
function algorytm_kontroli_kroku(TOL, schemat_numeryczny){
    //mamy przekazac alfe jako argument, dlatego nie predefiniowana
        
        // Inicjalizacja
        let t = 0;
        let dt = dt_0;
        let x_n = x_0;
        let v_n = v0;
        let alpha = 5;

        let tab_t = [];
        let tab_dt = [];
        let tab_x_n = [];
        let tab_v_n = [];

        // Placeholdery na obiekty
        let object1;
        let object2;

        // Dla t = 0.0
        tab_t.push(t);
        tab_dt.push(dt);
        tab_x_n.push(x_n);
        tab_v_n.push(v_n);

        do{
            // Stawiamy dwa kroki delta t
            object2 = schemat_numeryczny(x_n, v_n, dt, alpha);
            object2 = schemat_numeryczny(object2.x, object2.v, dt, alpha);
    
            // Stawiamy jeden krok 2 razy delta t
            object1 = schemat_numeryczny(x_n, v_n, 2*dt, alpha);
    
            // Liczymy: E_x, E_v
            let E_x = (object2.x - object1.x)/(Math.pow(2, p) - 1); // Równanie 6
            let E_v = (object2.v - object1.v)/(Math.pow(2, p) - 1); // Równanie 7
    
            if(Math.max(Math.abs(E_x), Math.abs(E_v)) < TOL ){
                t = t + 2 * dt;
                x_n = object2.x;
                v_n = object2.v;
                
                // Zapisujemy dane do tablic
                tab_t.push(t);
                tab_dt.push(dt);
                tab_x_n.push(x_n);
                tab_v_n.push(v_n);
            }

            dt = (Math.pow((S * TOL)/(Math.max(Math.abs(E_x) ,Math.abs(E_v))), (1/(p + 1))) * dt);
    
        } while(t < (t_max - dt));
    
        // Zwracam wynikowe tablice zapisane w obiekcie
        return {
            t: tab_t,
            dt: tab_dt,
            x_n: tab_x_n,
            v_n: tab_v_n
        }
    }


// PLOTTING //////////////////////////////////

//Rozwiązanie korzystające z metody RK2 z TOL=10^-2
let trapezy_sol_2 = algorytm_kontroli_kroku(Math.pow(10, -2), ex1_trapezy);

//Rozwiązanie korzystające z metody RK2 z TOL=10^-5
let trapezy_sol_5 = algorytm_kontroli_kroku(Math.pow(10, -5), ex1_trapezy);

//Rozwiązanie korzystające z metody RK2 z TOL=10^-2
let rk2_sol_2 = algorytm_kontroli_kroku(Math.pow(10, -2), ex2_rk2);

//Rozwiązanie korzystające z metody RK2 z TOL=10^-5
let rk2_sol_5 = algorytm_kontroli_kroku(Math.pow(10, -5), ex2_rk2);

//funkcja generująca wykres z przekazanych danych (by nie kopiować tyle kodu), korzysta z metody newPlot z biblioteki Plotly.js
function plot_ex(title, placeholder, x_axis, y_axis, x_val_1, y_val_1, x_val_2, y_val_2, name_1, name_2){
    var xtrace = {
        type: "scatter",
        mode: "step",
        name: name_1,
        x: x_val_1,
        y: y_val_1,
        line: {color: 'red'}
    }
    
    var ytrace = {
        type: "scatter",
        mode: "step",
        name: name_2,
        x: x_val_2,
        y: y_val_2,
        line: {color: 'blue'}
    }
    
    var data = [xtrace, ytrace];
    
    var layout = {
        title: title,
        xaxis: {
            title: x_axis,
            titlefont: {
                size: 20,
            }
        },
        yaxis: {
            title: y_axis,
            titlefont: {
                size: 20,
            }
      }
    }

    Plotly.newPlot(placeholder, data, layout);
}

plot_ex("Metoda RK2", "plot1", "t", "x(t)", rk2_sol_2.t, rk2_sol_2.x_n, rk2_sol_5.t, rk2_sol_5.x_n, "TOL=10^-2", "TOL=10^-5");
plot_ex("Metoda RK2", "plot2", "t", "v(t)", rk2_sol_2.t, rk2_sol_2.v_n, rk2_sol_5.t, rk2_sol_5.v_n, "TOL=10^-2", "TOL=10^-5");
plot_ex("Metoda RK2", "plot3", "t", "dt(t)", rk2_sol_2.t, rk2_sol_2.dt, rk2_sol_5.t, rk2_sol_5.dt, "TOL=10^-2", "TOL=10^-5");
plot_ex("Metoda RK2", "plot4", "x", "v", rk2_sol_2.x_n, rk2_sol_2.v_n, rk2_sol_5.x_n, rk2_sol_5.v_n, "TOL=10^-2", "TOL=10^-5");
plot_ex("Metoda Trapezów", "plot5", "t", "x(t)", trapezy_sol_2.t, trapezy_sol_2.x_n, trapezy_sol_5.t, trapezy_sol_5.x_n, "TOL=10^-2", "TOL=10^-5");
plot_ex("Metoda Trapezów", "plot6", "t", "x(t)", trapezy_sol_2.t, trapezy_sol_2.v_n, trapezy_sol_5.t, trapezy_sol_5.v_n, "TOL=10^-2", "TOL=10^-5");
plot_ex("Metoda Trapezów", "plot7", "t", "x(t)", trapezy_sol_2.t, trapezy_sol_2.dt, trapezy_sol_5.t, trapezy_sol_5.dt, "TOL=10^-2", "TOL=10^-5");
plot_ex("Metoda Trapezów", "plot8", "t", "x(t)", trapezy_sol_2.x_n, trapezy_sol_2.v_n, trapezy_sol_5.x_n, trapezy_sol_5.v_n, "TOL=10^-2", "TOL=10^-5");

