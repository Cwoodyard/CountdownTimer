setInterval(() => {
    d = new Date(); //object of date()
    hr = d.getHours();
    min = d.getMinutes();
    sec = d.getSeconds();
    hour.innerHTML = hr;
    minute.innerHTML = min;
    second.innerHTML = sec;
}, 1000);