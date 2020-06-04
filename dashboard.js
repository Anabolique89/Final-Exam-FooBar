import { gsap } from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);

const endpoint = "https://miserables.herokuapp.com/";
let counter = 1;
let queue = [];
let queueCurrent = [];

window.addEventListener("DOMContentLoaded", start);

function start() {
    navIcon();
    getBeerData();
    setInterval(getBeerData, 5000);
    setInterval(checkDropDataForAnimation, 5000);
    getSVG();
}

function navIcon() {
    const navIcon = document.querySelector(".navIcon");
    navIcon.addEventListener("click", function () {
        const beerLevelSection = document.querySelector("#beerLevelSection");
        beerLevelSection.classList.toggle("navOpen");


        navIcon.classList.toggle("navIconTransform");
        if (navIcon.classList.contains("navIconTransform")) {
            navIcon.innerHTML = "&times;";

        } else {
            navIcon.innerHTML = "&#9776;";
        }

    })
}

async function getBeerData() {
    fetch(endpoint)
        .then((response) => {
            return response.json();
        })
        .then((data) => {

            // remove current information from divs, so it doesn't overlay when new information is pushed

            document.querySelector("#beerName").innerHTML = "";
            document.querySelector("#beerLevel").innerHTML = "";
            document.querySelector("#beerLeftTaps").innerHTML = "";
            document.querySelector("#beerLeftStorage").innerHTML = "";


            console.log(data)
            data.taps.forEach(beersLevel);
            squareInfo(data);
            data.bartenders.forEach(bartenderInfo);
            data.storage.forEach(storageInfo);
            data.queue.forEach(beerDrops);
        });
}

function beersLevel(data) {

    // first section

    const beerName = document.createElement("p");
    beerName.classList.add("beerName");
    beerName.innerHTML = data.beer;

    document.querySelector("#beerName").appendChild(beerName);

    const barrelLevel = document.createElement("img");

    // checks how much is left in each tap and then displays needed barrel image

    function between(x, min, max) {
        return x >= min && x <= max;
    }

    if (between(data.level, 2000, 2500)) {
        barrelLevel.src = "barrel_full.png";

    } else if (between(data.level, 1000, 1999)) {
        barrelLevel.src = "barrel_medium.png";

    } else if (between(data.level, 1, 999)) {
        barrelLevel.src = "barrel_little.png";

    } else if (data.level == 0) {
        barrelLevel.src = "barrel_empty.png";

    }

    document.querySelector("#beerLevel").appendChild(barrelLevel);

    // taps section

    const template = document.querySelector("#tapsTemplate").content;
    const clone = template.cloneNode(true);

    clone.querySelector(".cell p").innerHTML = data.beer;
    clone.querySelector(".beerImage").src = `${data.beer}.png`;
    clone.querySelector(".cell div div p span").innerHTML = data.level / 100;

    document.querySelector("#beerLeftTaps").appendChild(clone);


}

function squareInfo(data) {

    // info for three of the squares on top, for the people served today just takes first number from serving now array

    const orders = document.querySelector("#ordersInLine").innerHTML = data.queue.length + data.serving.length;
    document.querySelector("#estimatedTime").innerHTML = Math.round(orders * 4 / data.bartenders.length);
    document.querySelector("#peopleAll").innerHTML = data.serving[0].id;
}

function bartenderInfo(data) {

    const template = document.querySelector("#bartenderTemplate").content;
    const clone = template.cloneNode(true);

    // bartenders section
    // counter made, so that we can use nth-child repeatedly and it doesn't go over the number of childs in the table

    counter++;

    if (counter > 4) {
        counter = 2;
        document.querySelectorAll(".dynamicRow").forEach(el => {
            el.remove();
        })
    }

    const status = data.status;
    const statusChanged = status.charAt(0) + status.slice(1).toLowerCase();

    const task = data.statusDetail;
    const taskChanged = task.charAt(0).toUpperCase() + task.slice(1);

    clone.querySelector("td:nth-child(1)").innerHTML = data.name;
    clone.querySelector("td:nth-child(2)").innerHTML = statusChanged;
    clone.querySelector("td:nth-child(3)").innerHTML = taskChanged;
    clone.querySelector("td:nth-child(4)").innerHTML = data.usingTap;
    clone.querySelector("td:nth-child(5)").innerHTML = data.servingCustomer;


    document.querySelector(`#bartendersTable tr:nth-child(${counter})`).appendChild(clone);


}

function storageInfo(data) {

    // storage section

    const template = document.querySelector("#storageTemplate").content;
    const clone = template.cloneNode(true);

    clone.querySelector(".cell p").innerHTML = data.name;
    clone.querySelector(".beerImage").src = `${data.name}.png`;
    clone.querySelector(".cell div div p").innerHTML = data.amount;

    document.querySelector("#beerLeftStorage").appendChild(clone);

}

function beerDrops(data) {

    const template = document.querySelector("#beerDropTemplate").content;
    const clone = template.cloneNode(true);

    clone.querySelector(".beerDrop").innerHTML = data.id;
    clone.querySelector(".beerDrop").setAttribute("data-id", data.id);

    // global objects made as arrays which stores the ids of orders and compares them, so that the same circle is not made

    function checkLine(number) {
        return number == data.id;
    }

    // if the new order number doesn't exist yet, then make a new circle

    if (queue.some(checkLine) == false) {
        document.querySelector(".beerDrops").appendChild(clone);
    }

    queueCurrent.push(data.id);

    queue.push(data.id);

}

function checkDropDataForAnimation() {

    console.log(queueCurrent)

    document.querySelectorAll(".beerDrop").forEach(el => {
        function checkQueue(number) {
            return number == el.dataset.id;
        }

        // if the order number is not inside the serving state yet, do nothing, otherwise move it to the glass of beer and remove afterwards

        if (queueCurrent.some(checkQueue) == false) {

            gsap.to(el, {
                duration: 5,
                ease: "power1.inOut",
                motionPath: {
                    path: "#lineToFollow",
                    align: "#lineToFollow",
                    autoRotate: true,
                    alignOrigin: [0.5, 0.5]
                },
                onComplete: function () {
                    el.remove();
                }
            });
        }
    })

    queueCurrent = [];

}

async function getSVG() {

    let response = await fetch("motionPath.svg");

    let mySvgData = await response.text();

    document.querySelector("#svgLine").innerHTML = mySvgData;
}
