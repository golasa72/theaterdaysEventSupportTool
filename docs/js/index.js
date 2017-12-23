
function toJPUnit(num) {
    var str = new String(num);
    var n = "";
    var count = 0;
    var ptr = 0;
    var kName = ["万", "億"];
    for (var i = str.length - 1; i >= 0; i--) {
        n = str.charAt(i) + n;
        count++;
        if (((count % 4) == 0) && (i != 0)) n = kName[ptr++] + n;
    }
    return n;
}

function toHms(t) {
    let time = "";
    let y = Math.floor(t / 31536000);
    let d = Math.floor(t % 31536000 / 86400);
    let h = Math.floor(t % 31536000 % 86400 / 3600);
    let m = Math.floor(t % 3600 / 60);
    let s = Math.floor(t % 60);

    if (y != 0) {
        time = toJPUnit(y) + "年" + padZero(d) + "日" + padZero(h) + "時間" + padZero(m) + "分" + padZero(s) + "秒";
    } else if (d != 0) {
        time = d + "日" + padZero(h) + "時間" + padZero(m) + "分" + padZero(s) + "秒";
    } else if (h != 0) {
        time = h + "時間" + padZero(m) + "分" + padZero(s) + "秒";
    } else if (m != 0) {
        time = m + "分" + padZero(s) + "秒";
    } else {
        time = s + "秒";
    }
    return time;

    function padZero(v) {
        if (v < 10) {
            return "0" + v;
        } else {
            return v;
        }
    }
}

function get() {
    let check1 = document.querySelector("#platinumStarTheater").checked;
    let check2 = document.querySelector("#platinumStarTour").checked;

    if (check1) {
        getPlatinumStarTheater();
    }
    else if (check2) {
        getPlatinumStarTour();
    }
}

function updateResultLabel(normalPlayCount, eventPlayCount, eventPlay5timesCount, eventPlay4timesCount, healthy, normalSongTime, eventSongTime, interval) {
    let label = document.querySelector("#normalPlayCount");
    label.innerHTML = normalPlayCount + '';

    let label2 = document.querySelector("#eventPlayCount");
    label2.innerHTML = eventPlayCount + '';

    let label3 = document.querySelector("#eventPlay5timesCount");
    label3.innerHTML = eventPlay5timesCount + '';

    let label4 = document.querySelector("#eventPlay4timesCount");
    label4.innerHTML = eventPlay4timesCount + '';

    let jewel = Math.ceil((normalPlayCount * 30) / healthy);
    let label5 = document.querySelector("#jewel");
    label5.innerHTML = jewel + '';

    let sec = (normalPlayCount * normalSongTime) + (eventPlayCount * eventSongTime) + ((normalPlayCount + eventPlayCount) * interval);
    let label6 = document.querySelector("#time");
    label6.innerHTML = toHms(sec) + '';

    var text = "目標とするイベントptまで 残り\n" + "通常楽曲: " + normalPlayCount + '' + "回\n" + "イベント楽曲: " + eventPlayCount + '' + "回\n元気回復のため " + jewel + '' + "回 ジュエルを使用\n" + "所要時間: およそ" + toHms(sec) + '' + "\nhttps://golasa72.github.io/theaterdaysEventSupportTool/\n#ミリシタ";
    let element = document.querySelector("#tweet");
    element.setAttribute('href', "https://twitter.com/intent/tweet?text=" + encodeURIComponent(text));
    element.setAttribute('class', 'btn btn-primary');
}

function addError(str) {
    const preTag = '<div class="alert alert-warning" role="alert">';
    const postTag = '</div>';
    let element = document.getElementById("errorArea");
    element.innerHTML = element.innerHTML + preTag + str + postTag;
}

function clearError() {
    let element = document.getElementById("errorArea");
    element.innerHTML = "";
}

function validate(value, max, min, name) {
    if (isNaN(value) || value === "") {
        addError(name + " を入力してください。");
        return false;
    }
    else if (value > max) {
        addError(name + "は上限値(" + max + ")以下にしてください");
        return false;
    }
    else if (value < min) {
        addError(name + "は" + min + "以上にしてください");
        return false;
    }
    return true;
}

function getPlatinumStarTour() {
    let currentPoint = document.querySelector("#currentPoint").value;
    let goalPoint = document.querySelector("#goalPoint").value;
    let healthy = document.querySelector("#healthy").value;

    clearError();

    let isCurrentPointValid = validate(currentPoint, Number.MAX_SAFE_INTEGER, 0, "現在の累積イベントpt");
    let isGoalPointValid = validate(goalPoint, Number.MAX_SAFE_INTEGER, 0, "目標イベントpt");
    let isHealthyValid = validate(healthy, 300, 61, "現在の元気の上限値");

    if (isCurrentPointValid && isGoalPointValid && isHealthyValid) {
        const normalPlay = 140;
        const eventPlay = 720;
        const eventPlay4times = 576;
        const eventPlayCost = 20;
        let progress = 0;
        let normalPlayCount = 0;
        let eventPlayCount = 0;
        let eventPlay4timesCount = 0;
        let can5times = false;
        let progressFor5times = 0;
        let remainingPoint = goalPoint - currentPoint + '';

        let loopCount = Math.floor(remainingPoint / 10680); //1周 6360 22860
        remainingPoint = remainingPoint % 10680;
        normalPlayCount = 30 * loopCount; // 10回
        console.log(remainingPoint);
        eventPlayCount = 3 * loopCount;// 3回
        progress = normalPlayCount * 6 - eventPlayCount * eventPlayCost * 3;

        while (remainingPoint > 0) {
            if (progressFor5times >= 40) {
                can5times = true;
            }
            if (remainingPoint <= normalPlay) {
                progress += 6;
                progressFor5times += 6;
                remainingPoint -= normalPlay;
                normalPlayCount++;
            }
            else if ((remainingPoint <= eventPlay || remainingPoint <= eventPlay4times) && progress >= eventPlayCost) {
                progress -= eventPlayCost;
                if (can5times) {
                    remainingPoint -= eventPlay;
                    can5times = false;
                    progressFor5times = 0;
                    eventPlayCount++;
                } else {
                    remainingPoint -= eventPlay4times;
                    eventPlay4timesCount++;
                }
            }
            else if (((remainingPoint <= eventPlay * 2 || remainingPoint <= eventPlay4times * 2) && progress >= eventPlayCost * 2)) {
                progress -= eventPlayCost * 2;
                if (can5times) {
                    remainingPoint -= eventPlay * 2;
                    can5times = false;
                    progressFor5times = 0;
                    eventPlayCount++;
                } else {
                    remainingPoint -= eventPlay4times * 2;
                    eventPlay4timesCount++;
                }
            }
            else if (progress >= eventPlayCost * 3) {
                progress -= eventPlayCost * 3;
                if (can5times) {
                    remainingPoint -= eventPlay * 3;
                    can5times = false;
                    progressFor5times = 0;
                    eventPlayCount++;
                } else {
                    remainingPoint -= eventPlay4times * 3;
                    eventPlay4timesCount++;
                }
            }
            else {
                progress += 6;
                progressFor5times += 6;
                remainingPoint -= normalPlay;
                normalPlayCount++;
            }
        }

        //計算結果を出力
        updateResultLabel(normalPlayCount, eventPlayCount + eventPlay4timesCount, eventPlayCount, eventPlay4timesCount, healthy, 131, 140, 20);
    }
}

function getPlatinumStarTheater() {
    let currentPoint = document.querySelector("#currentPoint").value;
    let goalPoint = document.querySelector("#goalPoint").value;
    let healthy = document.querySelector("#healthy").value;

    clearError();

    let isCurrentPointValid = validate(currentPoint, Number.MAX_SAFE_INTEGER, 0, "現在の累積イベントpt");
    let isGoalPointValid = validate(goalPoint, Number.MAX_SAFE_INTEGER, 0, "目標イベントpt");
    let isHealthyValid = validate(healthy, 300, 61, "現在の元気の上限値");

    if (isCurrentPointValid && isGoalPointValid && isHealthyValid) {
        const onePlay = 68;
        const eventPlayCost = 180;
        const eventPlay = 429;
        let normalPlayCount = 0;
        let eventPlayCount = 0;
        let eventPoint = 0;

        let remainingPoint = goalPoint - currentPoint + '';

        let loopCount = Math.floor(remainingPoint / 41412);
        remainingPoint = remainingPoint % 41412;
        eventPlayCount = 17 * loopCount;
        normalPlayCount = 180 * loopCount;
        eventPoint = normalPlayCount * onePlay - eventPlayCount * eventPlayCost * 4;

        while (remainingPoint > 0) {
            if (remainingPoint <= onePlay) {
                eventPoint += onePlay;
                remainingPoint -= onePlay;
                normalPlayCount++;
            }
            else if (remainingPoint <= eventPlay && eventPoint >= eventPlayCost) {
                eventPoint -= eventPlayCost;
                remainingPoint -= eventPlay;
                eventPlayCount++;
            }
            else if ((remainingPoint <= eventPlay * 2 && eventPoint >= eventPlayCost * 2)
                || (remainingPoint <= eventPlay * 3 && eventPoint >= eventPlayCost * 3)) {
                eventPoint -= eventPlayCost * 2;
                remainingPoint -= eventPlay * 2;
                eventPlayCount++;
            }
            else if (eventPoint >= eventPlayCost * 4) {
                eventPoint -= eventPlayCost * 4;
                remainingPoint -= eventPlay * 4;
                eventPlayCount++;
            }
            else {
                eventPoint += onePlay;
                remainingPoint -= onePlay;
                normalPlayCount++;
            }
        }

        //計算結果を出力
        updateResultLabel(normalPlayCount, eventPlayCount, 0, 0, healthy, 112, 138, 20);
    }
}
