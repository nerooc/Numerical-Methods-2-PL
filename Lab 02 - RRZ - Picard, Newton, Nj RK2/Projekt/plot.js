/* Global variables */
const beta = 0.001;
const N = 500;
const gamma = 0.1;
const t_max = 100;
const dt = 0.1;
const iteracje_max = 20;
const u0 = 1.;
const TOL = Math.pow(10, -6);

function f(u){
    return ((beta * N - gamma) * u - beta * u * u);
}

function df(u){
    return ((beta * N - gamma) - 2 * beta * u);
}

// Exercise 1. //////////////////////// PICARD /////////////////////////////

function ex1_picard(){
    let u_n = u0;
    let u_n1 = u0;
    let u_mikro = 0.;

    let ta = []; //accepts t
    let ya = []; //accepts u_n1
    let yb = []; //accepts N - u_n1

    ta.push(0.);
    ya.push(u_n1);
    yb.push(N - u_n1);

    for(let t = 0.1; t < 100.; t += dt){
        let iteracja_mi = 0;
        u_n = u_n1;
        u_mikro = 0.;

        while(1){
            
            if((Math.abs(u_n1-u_mikro) < TOL) || iteracja_mi++ > iteracje_max){
                break;
            }

            u_mikro = u_n1;
            u_n1 = u_n + (dt / 2.) * (f(u_n) + f(u_mikro));
        }

        ta.push(t);
        ya.push(u_n1);
        yb.push(N - u_n1);
    }

    /* We return an object, containing our 3 arrays */
    return {
        t: ta,
        y: ya,
        y2: yb
    }
}

// Exercise 2. //////////////////////// NEWTON /////////////////////////////

function ex2_newton(){
    let u_n = u0;
    let u_n1 = u0;
    let u_mikro = 0.;

    let ta = []; //accepts t
    let ya = []; //accepts u_n1
    let yb = []; //accepts N - u_n1

    ta.push(0.);
    ya.push(u_n1);
    yb.push(N - u_n1);

    for(let t = 0.1; t < 100.; t += dt){
        let iteracja_mi = 0;
        u_n = u_n1;
        u_mikro = 0.;

        while(1){

            if((Math.abs(u_n1-u_mikro) < TOL) || iteracja_mi++ > iteracje_max){
                break;
            }

            u_mikro = u_n1;
            u_n1 = u_mikro - (u_mikro - u_n - (dt / 2.) * (f(u_n) + f(u_mikro))) / (1 - (dt / 2.) * df(u_mikro));
        }

        ta.push(t);
        ya.push(u_n1);
        yb.push(N - u_n1);
    }

    /* We return an object, containing our 3 arrays */
    return {
        t: ta,
        y: ya,
        y2: yb
    }
}

// Exercise 3. //////////////////////// RK2 /////////////////////////////

function F_1(U1, U2, un, a11, a12) {
    return (U1 - un - dt * (a11 * ((beta * N - gamma) * U1 - beta * U1 * U1) + a12 * ((beta * N - gamma) * U2 - beta * U2 * U2)));
}
function F_2(U1, U2, un, a21, a22) {
    return (U2 - un - dt * (a21 * ((beta * N - gamma) * U1 - beta * U1 * U1) + a22 * ((beta * N - gamma) * U2 - beta * U2 * U2)));
}

function m_11(U1, a11) {
    return (1 - dt * a11 * ((beta * N - gamma) - 2 * beta * U1));
}

function m_12(U2, a12) {
    return ((-1) * dt * a12 * ((beta * N - gamma) - 2 * beta * U2));
}

function m_21(U1, a21) {
    return ((-1) * dt * a21 * ((beta * N - gamma) - 2 * beta * U1));
}

function m_22(U2, a22) {
    return (1 - dt * a22 * ((beta * N - gamma) - 2 * beta * U2));
}

function ex3_rk2(){
    let a_11 = 0.25;
    let a_12 = 0.25 - Math.sqrt(3) / 6;

    let a_21 = 0.25 + Math.sqrt(3) / 6;
    let a_22 = a_11;

    let b_1 = 0.5;
    let b_2 = 0.5;

    let U_1 = 0., U_2 = 0.;

    let u_n = u0;
    let u_n1 = u0;
    let TOL = Math.pow(10, -6);

    let ta = []; //accepts t
    let ya = []; //accepts u_n1
    let yb = []; //accepts N - u_n1

    let dU_1 = 0;
    let dU_2 = 0;

    ta.push(0.);
    ya.push(u_n1);
    yb.push(N - u_n1);

    for (let t = 0.1; t < 100.; t += dt) {

        let iteracja_mi = 0;
        u_n = u_n1;

        let U_1_mikro = 0.;
        let U_2_mikro = 0.;

        U_1 = u_n;
        U_2 = u_n;

        while (1) {

            // Sprawdzamy warunek stopu
            if (iteracja_mi++ > iteracje_max || (Math.abs(U_1 - U_1_mikro) < TOL && Math.abs(U_2 - U_2_mikro) < TOL)) {
                break;
            }

            U_1_mikro = U_1;
            U_2_mikro = U_2;

            // [Równanie 27]
            dU_1 = (F_2(U_1, U_2, u_n, a_21, a_22) * m_12(U_2, a_12) - F_1(U_1, U_2, u_n, a_11, a_12) * m_22(U_2, a_22)) /
                (m_11(U_1, a_11) * m_22(U_2, a_22) - m_12(U_2, a_12) * m_21(U_1, a_21));
            
            // [Równanie 28]
            dU_2 = (F_1(U_1, U_2, u_n, a_11, a_12) * m_21(U_1, a_21) - F_2(U_1, U_2, u_n, a_21, a_22) * m_11(U_1, a_11)) /
                (m_11(U_1, a_11) * m_22(U_2, a_22) - m_12(U_2, a_12 * m_21(U_1, a_21)));

            // [Równanie 20]
            U_1 = U_1_mikro + dU_1;

            // [Równanie 21]
            U_2 = U_2_mikro + dU_2;
        }

        u_n1 = u_n + dt * (b_1 * f(U_1) + b_2 * f(U_2));

        ta.push(t);
        ya.push(u_n1);
        yb.push(N - u_n1);
    }

    /* We return an object, containing our 3 arrays */
    return {
        t: ta,
        y: ya,
        y2: yb
    }
}

// PLOTTING //////////////////////////////////

let picard_sol = ex1_picard();
let newton_sol = ex2_newton();
let rk2_sol = ex3_rk2();

/* Plot configuration: Picard */
var utracePicard = {
    type: "scatter",
    mode: "step",
    name: 'u(t)',
    x: picard_sol.t,
    y: picard_sol.y,
    line: {color: 'red'}
}

var vtracePicard = {
    type: "scatter",
    mode: "step",
    name: 'v(t)',
    x: picard_sol.t,
    y: picard_sol.y2,
    line: {color: 'blue'}
}

var dataPicard = [utracePicard, vtracePicard];

var layoutPicard = {
    title: "Picard's method",
    xaxis: {
        title: 't',
        titlefont: {
            size: 20,
        }
    },
    yaxis: {
        title: 'u(t), v(t)',
        titlefont: {
            size: 20,
        }
  }
}

/* Plot configuration: Newton */
var utraceNewton = {
    type: "scatter",
    mode: "step",
    name: 'u(t)',
    x: newton_sol.t,
    y: newton_sol.y,
    line: {color: 'red'}
}

var vtraceNewton = {
    type: "scatter",
    mode: "step",
    name: 'v(t)',
    x: newton_sol.t,
    y: newton_sol.y2,
    line: {color: 'blue'}
}

var dataNewton = [utraceNewton, vtraceNewton];

var layoutNewton = {
    title: "Newton's iteration",
    xaxis: {
        title: 't',
        titlefont: {
            size: 20,
        }
    },
    yaxis: {
        title: 'u(t), v(t)',
        titlefont: {
            size: 20,
        }
  }
}

/* Plot configuration: RK2 */
var utraceRK2 = {
    type: "scatter",
    mode: "step",
    name: 'u(t)',
    x: rk2_sol.t,
    y: rk2_sol.y,
    line: {color: 'red'}
}

var vtraceRK2 = {
    type: "scatter",
    mode: "step",
    name: 'v(t)',
    x: rk2_sol.t,
    y: rk2_sol.y2,
    line: {color: 'blue'}
}

var dataRK2 = [utraceRK2, vtraceRK2];

var layoutRK2 = {
    title: "Implicit RK2",
    xaxis: {
        title: 't',
        titlefont: {
            size: 20,
        }
    },
    yaxis: {
        title: 'u(t), v(t)',
        titlefont: {
            size: 20,
        }
    }
}

Plotly.newPlot('plot1', dataPicard, layoutPicard);
Plotly.newPlot('plot2', dataNewton, layoutNewton);
Plotly.newPlot('plot3', dataRK2, layoutRK2);

