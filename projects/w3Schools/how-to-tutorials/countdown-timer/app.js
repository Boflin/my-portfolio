const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",    
    "October",
    "November",
    "December",
];
const weekdays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

const giveaway = document.querySelector('.giveaway');
const deadline = document.querySelector('.deadline');
const items = document.querySelectorAll('.deadline-format h4');

let futureDate = new Date(2025, 3, 2, 4, 20, 0);
const year = futureDate.getFullYear();
const hours = futureDate.getHours();
const minutes = futureDate.getMinutes();
let month = futureDate.getMonth();
month = months[month];
const date = futureDate.getDate();
const weekday = weekdays[futureDate.getDay()];

// change the text content on the HTML 
giveaway.textContent = `My birthday is on ${weekday}, ${month} ${date} ${year} - ${hours}:${minutes}am`;

// future time in ms
const futureTime = futureDate.getTime();

function getRemainingTime() {
    const today = new Date().getTime();

    const t = futureTime - today;
    
    // values in ms
    const oneDay = 24*60*60*1000;
    const oneHour = 60*60*1000; 
    const oneMinute = 60*1000;

    // calc all values 
    let days = t / oneDay;
    days = Math.floor(days);
    let hours = ((t % oneDay) / oneHour);
    hours = Math.floor(hours);
    let minutes = Math.floor((t % oneHour) / oneMinute);
    let seconds = Math.floor((t % oneMinute) / 1000);

    // set values array 
    const values = [days, hours, minutes, seconds];

    items.forEach(function(item, index) {
        item.innerHTML = values[index]
    });
}

// countdown 
let countdown = setInterval(getRemainingTime, 1000);
getRemainingTime();