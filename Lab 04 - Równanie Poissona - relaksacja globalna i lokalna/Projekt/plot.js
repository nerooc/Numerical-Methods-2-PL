// Przyjmujemy wartości parametrów
const epsilon = 1.;
const delta = 0.1;

const n_x = 150;
const n_y = 100;

const V_1 = 10;
const V_2 = 0;

const x_max = delta * n_x;
const y_max = delta * n_y;

// Równanie 6
const dx = delta;
const dy = delta;

const sigma_x = 0.1 * x_max;
const sigma_y = 0.1 * y_max;
const TOL = Math.pow(10, -8);

// Deklaracja dwuwymiarowej tablicy gęstości
const ro = new Array(n_x + 1);
for (let i = 0; i < ro.length; i++) {
    ro[i] = new Array(n_y + 1);
}

// Funkcja [IIFE] wypełniająca tablicę ro
(function () {

    for (let i = 0; i <= n_x; i++) {
        for (let j = 0; j <= n_y; j++) {

            // Równanie 19 i 20
            ro[i][j] = Math.exp(-Math.pow(dx * i - 0.35 * x_max, 2) / (sigma_x * sigma_x) - Math.pow(dy * j - 0.5 * y_max, 2) / (sigma_y * sigma_y)) + (-Math.exp(-Math.pow(dx * i - 0.65 * x_max, 2) / (sigma_x * sigma_x) - Math.pow(dy * j - 0.5 * y_max, 2) / (sigma_y * sigma_y)));
        }
    }
})();

///////////////////////// RELAKSACJA GLOBALNA //////////////////////////////////
function relaksacjaGlobalna(omega_G) {

    let tab_x = [];
    let tab_y = [];

    let blad_x = [];
    let blad_y = [];
    let blad_z = [];

    let mapa_x = [];
    let mapa_y = [];
    let mapa_z = [];

    let S = 0.;
    let S1 = 0.;
    let iteracje = 0;

    // Deklaracja tablic
    let V_n = new Array(n_x + 1);
    for (let i = 0; i < V_n.length; i++) {
        V_n[i] = new Array(n_y + 1);
    };

    let V_s = new Array(n_x + 1);
    for (let i = 0; i < V_s.length; i++) {
        V_s[i] = new Array(n_y + 1);
    };

    // Zerowanie tablicy V (nowej)
    for (let i = 0; i <= n_x; i++) {
        for (let j = 0; j <= n_y; j++) {
            V_n[i][j] = 0.;
        }
    }

    // Uwzględniamy warunki brzegowe
    for (let i = 0; i <= n_x; i++) {
        V_n[i][0] = V_1;
        V_n[i][n_y] = V_2;
    }

    // Kopiujemy
    for (let i = 0; i <= n_x; i++) {
        for (let j = 0; j <= n_y; j++) {
            V_s[i][j] = V_n[i][j];
        }
    }

    // Obliczamy wartość S1 potrzebną do warunku stopu pętli
    S1 = warunekStopu(V_n);

    do {
        iteracje++;

        // Równanie 9
        for (let i = 1; i < n_x; i++) {
            for (let j = 1; j < n_y; j++) {
                V_n[i][j] = 0.25 * (V_s[i + 1][j] + V_s[i - 1][j] + V_s[i][j + 1] + V_s[i][j - 1] + delta * delta / epsilon * ro[i][j]);
            }
        }

        // Równanie 10 i 11
        for (let j = 1; j < n_y; j++) {
            V_n[0][j] = V_n[1][j];
            V_n[n_x][j] = V_n[n_x - 1][j];
        }

        // Równanie 12
        for (let i = 0; i <= n_x; i++) {
            for (let j = 0; j <= n_y; j++) {
                V_s[i][j] = (1 - omega_G) * V_s[i][j] + omega_G * V_n[i][j];
            }
        }

        S = S1;
        S1 = warunekStopu(V_s);

        // Zapisujemy dane do tablic
        tab_x.push(iteracje);
        tab_y.push(S1);

    // Warunek stopu - Równanie 18
    } while (Math.abs((S1 - S) / S) > TOL);


    for (let i = 0; i <= n_x; i++) {
        for (let j = 0; j <= n_y; j++) {

            // Zapisujemy mapę do tablic
            mapa_x.push(dx * i);
            mapa_y.push(dx * j);
            mapa_z.push(V_s[i][j]);

            // Zapisujemy błąd do tablic
            if (i > 0 && j > 0 && i < n_x && j < n_y) {
                blad_x.push(dx * i);
                blad_y.push(dy * j);
                blad_z.push((V_s[i + 1][j] - 2 * V_s[i][j] + V_s[i - 1][j]) / (delta * delta) + (V_s[i][j + 1] - 2 * V_s[i][j] + V_s[i][j - 1]) / (delta * delta) + ro[i][j] / epsilon);
            } else {
                blad_x.push(dx * i);
                blad_y.push(dy * j);
                blad_z.push(0.0);
            }
        }
    }

    return {
        x: tab_x,
        y: tab_y,
        bl_x: blad_x,
        bl_y: blad_y,
        bl_z: blad_z,
        mp_x: mapa_x,
        mp_y: mapa_y,
        mp_z: mapa_z
    };
}

///////////////////////// RELAKSACJA LOKALNA //////////////////////////////////
function relaksacjaLokalna(omega_L) {

    let tab_x = [];
    let tab_y = [];

    let S = 0.;
    let S1 = 0.;
    let iteracje = 0;

    // Deklaracja tablicy
    let V = new Array(n_x + 1);
    for (let i = 0; i < V.length; i++) {
        V[i] = new Array(n_y + 1);
    };

    // Zerowanie tablicy
    for (let i = 0; i <= n_x; i++) {
        for (let j = 0; j <= n_y; j++) {
            V[i][j] = 0.;
        }
    }

    // Uwzględniamy warunki brzegowe
    for (let i = 0; i <= n_x; i++) {
        V[i][0] = V_1;
        V[i][n_y] = V_2;
    }

    // Obliczamy wartość S1 potrzebną do warunku stopu pętli
    S1 = warunekStopu(V);

    do{
        iteracje++;

        // Równanie 13
        for (let i = 1; i < n_x; i++) {
            for (let j = 1; j < n_y; j++) {
                V[i][j] = (1 - omega_L) * V[i][j] + (omega_L / 4) * (V[i + 1][j] + V[i - 1][j] + V[i][j + 1] + V[i][j - 1] + delta * delta / epsilon * ro[i][j]);
            }
        }
        // Równanie 14 i 15
        for (let j = 1; j < n_y; j++) {
            V[0][j] = V[1][j];
            V[n_x][j] = V[n_x - 1][j];
        }

        S = S1;
        S1 = warunekStopu(V);

        // Zapisujemy dane do tablic
        tab_x.push(iteracje);
        tab_y.push(S1);

    // Warunek stopu - Równanie 18
    } while (Math.abs((S1 - S) / S) > TOL) ;

    return {x: tab_x, y: tab_y}
}

// Funkcja obliczająca całkę funkcjonalną służącą do wyznaczenia warunku stopu
function warunekStopu(V) {
    let S = 0.;

    for (let i = 0; i < n_x; i++) {
        for (let j = 0; j < n_y; j++) {
            // Równanie 17
            S += Math.pow(delta, 2) * (0.5 * Math.pow((V[i + 1][j] - V[i][j]) / delta, 2) + 0.5 * Math.pow((V[i][j + 1] - V[i][j]) / delta, 2) - ro[i][j] * V[i][j]);
        }
    }

    return S;
}

///////////////////////// ZAPISYWANIE WYNIKÓW //////////////////////////////////

glob1 = relaksacjaGlobalna(1.0);
glob06 = relaksacjaGlobalna(0.6);

lok10 = relaksacjaLokalna(1.0);
lok14 = relaksacjaLokalna(1.4);
lok18 = relaksacjaLokalna(1.8);
lok19 = relaksacjaLokalna(1.9);

///////////////////////// RYSOWANIE WYKRESÓW //////////////////////////////////

// Funkcja generująca wykres z przekazanych danych (by nie kopiować tyle kodu),
// przyjmuje dwa wykresy [dla Relaksacji globalnej] korzysta z metody newPlot z
// biblioteki Plotly.js

function plot_ex2(title, placeholder, x_axis, y_axis, x_val_1, y_val_1, x_val_2, y_val_2, name_1, name_2) {
    var xtrace = {
        type: "scatter",
        mode: "step",
        name: name_1,
        x: x_val_1,
        y: y_val_1,
        line: {
            color: 'red'
        }
    }

    var ytrace = {
        type: "scatter",
        mode: "step",
        name: name_2,
        x: x_val_2,
        y: y_val_2,
        line: {
            color: 'blue'
        }
    }

    var data = [xtrace, ytrace];

    var layout = {
        title: title,
        xaxis: {
            type: 'log',
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

// Funkcja generująca wykres z przekazanych danych (by nie kopiować tyle kodu),
// przyjmuje cztery wykresy [dla Relaksacji lokalnej] korzysta z metody newPlot
// z biblioteki Plotly.js

function plot_ex4(title, placeholder, x_axis, y_axis, x_val_1, y_val_1, x_val_2, y_val_2, x_val_3, y_val_3, x_val_4, y_val_4, name_1, name_2, name_3, name_4) {
    var trace1 = {
        type: "scatter",
        mode: "step",
        name: name_1,
        x: x_val_1,
        y: y_val_1,
        line: {
            color: 'red'
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
            color: 'lightblue'
        }
    }

    var trace4 = {
        type: "scatter",
        mode: "step",
        name: name_4,
        x: x_val_4,
        y: y_val_4,
        line: {
            color: 'lightgreen'
        }
    }

    var data = [trace1, trace2, trace3, trace4];

    var layout = {
        title: title,
        xaxis: {
            type: 'log',
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

function plot_heat(title, data1, data2, data3, placeholder){
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
plot_ex2("Relaksacja globalna", "plot1", "nr iteracji", "S", glob06.x, glob06.y, glob1.x, glob1.y, `om = 0.6, ${glob06.x.length - 1} it`, `om = 1.0, ${glob1.x.length - 1} it`);
plot_ex4("Relaksacja lokalna", "plot2", "nr iteracji", "S", lok10.x, lok10.y, lok14.x, lok14.y, lok18.x, lok18.y, lok19.x, lok19.y, `om = 1.0, ${lok10.x.length - 1} it`, `om = 1.4, ${lok14.x.length - 1} it`, `om = 1.8, ${lok18.x.length - 1} it`, `om = 1.9, ${lok19.x.length - 1} it`);

///////////// Rysowanie wykresów dla błędów ///////////

plot_heat("Błędy, relaksacja globalna, omega = 1.0", glob1.bl_z, glob1.bl_x, glob1.bl_y, "plot3");
plot_heat("Błędy, relaksacja globalna, omega = 0.6", glob06.bl_z, glob06.bl_x, glob06.bl_y, "plot4");

///////////// Rysowanie wykresów dla map ///////////

plot_heat("Mapa potencjału, relaksacja globalna, omega = 1.0", glob1.mp_z, glob1.mp_x, glob1.mp_y, "plot5");
plot_heat("Mapa potencjału, relaksacja globalna, omega = 0.6", glob06.mp_z, glob06.mp_x, glob06.mp_y, "plot6");


