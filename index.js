var arrTowns = document.getElementsByClassName("towns");
var arrImgs = document.getElementsByClassName("main-widget_img");
var appId = "&APPID=97576b3b2b2568b4461029ef47e84865";

for (var i = 0; i < arrTowns.length; i++) {
    var params = "q=" + encodeURIComponent((arrTowns[i].innerHTML).split(" / ")[0]);
    send(params, i);
}

function send(param, i) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://api.openweathermap.org/data/2.5/weather?" + param + "&units=metric" + appId);

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        console.log("Готово");

        if (xhr.status !== 200) {
            console.log(xhr.status + ": " + xhr.statusText);
        } else {
            show(i, Math.round(JSON.parse(xhr.responseText).main.temp), JSON.parse(xhr.responseText).weather[0].icon);
        }
    };

    xhr.send();
}

function show(i, t, icon) {
    arrTowns[i].innerHTML = arrTowns[i].innerHTML.split(" / ")[0] + " / " + t + "&#176;";
    arrImgs[i].style.backgroundImage = "url('http://openweathermap.org/img/w/" + icon + ".png')";
}

