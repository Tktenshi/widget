var arrTowns = document.getElementsByClassName("towns");
var arrImgs = document.getElementsByClassName("main-widget_img");
var btnWeath = document.getElementsByClassName("main-widget_square-btn-weather");
var inpWeath = document.getElementsByClassName("main-widget_square-inp-weather")[0];
var contWeath = document.getElementsByClassName("main-widget_chooseCity")[0];

var appId = "&APPID=97576b3b2b2568b4461029ef47e84865";
var settingsSquare = 3;
var weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
var arrCityes = ["CHICAGO", "SEATTLE", "PORTLAND", "", "SAN JOSE"];
var timerId;

var query = "weather";
var params = "";
var townsLen = arrTowns.length;

function displayWeather() {
    for (var i = 0; i < townsLen; i++) {
        if (i === 3) i++;
        var town = arrCityes[i];
        (function (i, town) {
            send(town, query, params, function (aResponseText) {
                var obj = getData(aResponseText);
                showWeath(i, obj);
            });
        })(i, town);
    }
}

interval(displayWeather);

function interval(dispFunc) {
    dispFunc();
    if (timerId) clearInterval(timerId);
    timerId = setInterval(dispFunc, 600000);  //600000
}

function send(aTown, aQuery, aParams, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://api.openweathermap.org/data/2.5/" + aQuery + "?q=" + encodeURIComponent(aTown) + "&units=metric" + aParams + appId);

    xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;

        console.log("Готово");

        if (xhr.status !== 200) {
            console.log(xhr.status + ": " + xhr.statusText);
            show(settingsSquare);
            if (xhr.status === 404) {
                contWeath.innerHTML = "The city is not found";
                interval(displayWeather);
            }
            else {
                if (xhr.status === 401) contWeath.innerHTML = "The function is paid and therefore temporarily unavailable";
                else contWeath.innerHTML = "Temporary problems, please try again later";
                if (timerId) clearInterval(timerId);
            }

        } else {
            callback(JSON.parse(xhr.responseText));
        }
    };

    xhr.timeout = 60000;
    xhr.ontimeout = function () {
        console.log('Извините, запрос превысил максимальное время');
    };

    xhr.send();
}

function showWeath(i, obj) {
    arrTowns[i].innerHTML = obj.city.toUpperCase() + " / " + obj.t + "&#176;";
    arrImgs[i].style.backgroundImage = "url('http://openweathermap.org/img/w/" + obj.icon + ".png')";
}

function chek() {
    if (inpWeath.value === "") {
        interval(displayWeather);
        show(settingsSquare);
        contWeath.innerHTML = "Invalid Input";
        return false;
    }
    return true;
}

btnWeath[0].onclick = function () {
    if (chek()) {
        interval(function () {
            if (inpWeath.value !== "")
                send(inpWeath.value, query, params, showCustom);
            displayWeather()
        });
    }
};

function hide(i) {
    contWeath.classList.add("hide");
    arrTowns[i].classList.remove("hide");
    arrImgs[i].classList.remove("hide");
}

function show(i) {
    contWeath.classList.remove("hide");
    arrTowns[i].classList.add("hide");
    arrImgs[i].classList.add("hide");
}

function showCustom(aResponseText) {
    hide(settingsSquare);
    var obj = getData(aResponseText);
    inpWeath.value = obj.city;
    showWeath(settingsSquare, obj);
}

btnWeath[1].onclick = function () {
    if (chek()) {
        interval(function () {
            if (inpWeath.value !== "")
                send(inpWeath.value, "forecast", "", showDays);
        });
    }
};

function getData(aResponseText) {
    var obj = {};
    obj.t = Math.round(aResponseText.main.temp);
    obj.icon = aResponseText.weather[0].icon;
    obj.city = aResponseText.name;
    return obj;
}

function showDays(aResponseText) {
    var countDays = 5;
    hide(settingsSquare);
    inpWeath.value = aResponseText.city.name;
    for (var k = 0; k < countDays; k++) {
        var day = new Date(aResponseText.list[k * 8].dt_txt).getDay();
        arrTowns[k].innerHTML = weekDays[day].toUpperCase() + " / " + Math.round(aResponseText.list[k * 8].main.temp) + "&#176;";
        arrImgs[k].style.backgroundImage = "url('http://openweathermap.org/img/w/" + aResponseText.list[k * 8].weather[0].icon + ".png')";
    }
}