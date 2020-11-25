// Przyjmujemy wartości parametrów
const delta = 0.2;

const n_x = 128;
const n_y = 128;

const dx = delta;
const dy = delta;

const x_max = delta * n_x;
const y_max = delta * n_y;

const TOL = Math.pow(10, -8);

///////////////////////// RELAKSACJA WIELOSIATKOWA //////////////////////////////////

function poisson(k_min) {
  
    let calka_iter = [];
    let calka_s1 = [];

    let mapa_x = [];
    let mapa_y = [];
    let mapa_z = [];

    let S = 0.;
    let S1 = 0.;
    let iteracje = 0;

    let k = 16;

    // Deklaracja tablicy
    const V = new Array(n_x + 1);
    for (let i = 0; i < V.length; i++) {
        V[i] = new Array(n_y + 1);
    }

    // Zerowanie tablicy
    for (let i = 0; i <= n_x; i++) {
        for (let j = 0; j <= n_y; j++) {
            V[i][j] = 0;
        }
    }

    // Uwzględniamy warunki brzegowe
    for (let j = 0; j <= n_y; j++) {
        V[0][j] = Math.sin(Math.PI * dy * j / y_max);
        V[n_x][j] = Math.sin(Math.PI * dy * j / y_max);
    }

    for (let i = 0; i <= n_x; i++) {
        V[i][n_y] = (-1) * Math.sin(2 * Math.PI * dx * i / x_max);
        V[i][0] = Math.sin(2 * Math.PI * dx * i / x_max);
    }

    while (k >= k_min) {

        S1 = warunekStopu(V, k);

        do{
            for(let i = k; i <= n_x - k; i += k) {
                for (let j = k; j <= n_y - k; j += k) {
                    V[i][j] = 0.25 * (V[i + k][j] + V[i - k][j] + V[i][j + k] + V[i][j - k]);
                }
            }
            
            S = S1;
            S1 = warunekStopu(V, k);

            calka_iter.push(iteracje);
            calka_s1.push(S1);

            iteracje++;

        } while (Math.abs((S1 - S) / S) > TOL);


        for (let i = 0; i <= n_x; i += k) {
            for (let j = 0; j <= n_y; j += k) {
                mapa_x.push(dx * i);
                mapa_y.push(dy * j);
                mapa_z.push(V[i][j]);
            }
        }

        for (let i = 0; i <= n_x - k; i += k) {
            for (let j = 0; j <= n_y - k; j += k) {
                V[i + k / 2][j + k / 2] = 0.25 * (V[i][j] + V[i + k][j] + V[i][j + k] + V[i + k][j + k]);
                if (i != n_x - k) 
                    V[i + k][j + k / 2] = 0.5 * (V[i + k][j] + V[i + k][j + k]);
                if (j != n_y - k) 
                    V[i + k / 2][j + k] = 0.5 * (V[i][j + k] + V[i + k][j + k]);
                if (j != 0) 
                    V[i + k / 2][j] = 0.5 * (V[i][j] + V[i + k][j]);
                if (i != 0) 
                    V[i][j + k / 2] = 0.5 * (V[i][j] + V[i][j + k]);
                }
            }

        k /= 2;
    }

    return {
        mp_x: mapa_x,
        mp_y: mapa_y,
        mp_z: mapa_z,
        ck_i: calka_iter,
        ck_s: calka_s1
    }
}


// Funkcja obliczająca całkę funkcjonalną służącą do wyznaczenia warunku stopu
function warunekStopu(V, k) {
    let S = 0.;

    for (let i = 0; i <= n_x - k; i += k) {
        for (let j = 0; j <= n_y - k; j += k) {
            S += 0.5 * Math.pow(k * delta, 2) * (Math.pow((V[i + k][j] - V[i][j]) / (2 * k * delta) + (V[i + k][j + k] - V[i][j + k]) / (2 * k * delta), 2) + Math.pow((V[i][j + k] - V[i][j]) / (2 * k * delta) + (V[i + k][j + k] - V[i + k][j]) / (2 * k * delta), 2));
        }
    }

    return S;
}

///////////////////////// ZAPISYWANIE WYNIKÓW //////////////////////////////////

const results16 = poisson(16);
const results8 = poisson(8);
const results4 = poisson(4);
const results2 = poisson(2);

///////////////////////// RYSOWANIE WYKRESÓW //////////////////////////////////


// Funkcja generująca wykres z przekazanych danych (by nie kopiować tyle kodu),
// przyjmuje cztery wykresy 
// korzysta z metody newPlot z biblioteki Plotly.js

function plot_ex(title, placeholder, x_axis, y_axis, x_val_1, y_val_1, x_val_2, y_val_2, x_val_3, y_val_3, x_val_4, y_val_4, name_1, name_2, name_3, name_4) {
    var trace1 = {
        type: "scatter",
        mode: "step",
        name: name_1,
        x: x_val_1,
        y: y_val_1,
        line: {
            color: 'orange'
        }
    }

    var trace2 = {
        type: "scatter",
        mode: "step",
        name: name_2,
        x: x_val_2,
        y: y_val_2,
        line: {
            color: 'blue'
        }
    }

    var trace3 = {
        type: "scatter",
        mode: "step",
        name: name_3,
        x: x_val_3,
        y: y_val_3,
        line: {
            color: 'green'
        }
    }

    var trace4 = {
        type: "scatter",
        mode: "step",
        name: name_4,
        x: x_val_4,
        y: y_val_4,
        line: {
            color: 'purple'
        }
    }

    var data = [trace1, trace2, trace3, trace4];

    var layout = {
        title: title,
        xaxis: {
            title: x_axis,
            titlefont: {
                size: 20
            }
        },
        yaxis: {
            title: y_axis,
            titlefont: {
                size: 20
            }
        }
    }

    Plotly.newPlot(placeholder, data, layout);
}

// Funkcja generująca heatmapę z przekazanych danych (by nie kopiować tyle kodu),
// przyjmuje trzy zestawy danych i korzysta z metody plot z biblioteki Plotly.js

function plot_heat(title, data1, data2, data3, placeholder) {

    var data = [
        {
            z: data1,
            x: data2,
            y: data3,
            type: "heatmap"
        }
    ];

    var layout = {
        title: title,
        xaxis: {
            title: "x",
            titlefont: {
                size: 20
            }
        },
        yaxis: {
            title: "y",
            titlefont: {
                size: 20
            }
        }
    };

    Plotly.plot(placeholder, data, layout);
}

// Wykonanie funkcji dla naszych danych

///////////// Rysowanie wykresów dla map ///////////
plot_heat("k = 16", results16.mp_z, results16.mp_x, results16.mp_y, "plot1");
plot_heat("k = 8", results8.mp_z, results8.mp_x, results8.mp_y, "plot2");
plot_heat("k = 4", results4.mp_z, results4.mp_x, results4.mp_y, "plot3");
plot_heat("k = 2", results2.mp_z, results2.mp_x, results2.mp_y, "plot4");


///////////// Rysowanie wykresu dla całki ///////////
plot_ex("S(it) - każdy skok to kolejne k", "plot5", "iteracje", "S", results2.ck_i, results2.ck_s, results4.ck_i, results4.ck_s, results8.ck_i, results8.ck_s, results16.ck_i, results16.ck_s, "k=2", "k=4", "k=8", "k=16");