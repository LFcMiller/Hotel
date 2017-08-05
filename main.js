//Each floor has 20 rooms, rooms must be built in groups of 20 +++DONE+++
// Rooms are to be built with money +++DONE+++
// Create New Guests on a set interval +++DONE+++
// Guests checked out after predetermined number of days in JS Object +++DONE+++
// Money accrued from room payments +++DONE+++
//Starting cleaning staff 2 staff +++DONE+++
//charge from funds for cleaning staff based on number of rooms cleaned
//daily fees for other hotel employees
//each checkout leaves dirty room, cant be used until clean +++DONE+++
//hire new cleaning staff as hotel grows
//price is per day, set final price to stay length * price +++DONE++
//Fake Yelp, negative affects lead to bad reviews, extend interval between new guests +++DONE+++
//Length of Day: 30 seconds
//Time to clean room: 10 seconds; ++IMPLEMENTED++
//Cleaning Staff can only clean one room per day (equivalent to 8 hour shift) ---IN PROGRESS(CHRIS)---
//Dynamically create variable name for guest equal to their name from name array +++DONE+++
//save number of good and bad reviews to guests created. After a certain number of bad reviews, they do not return. ---IN PROGRESS(CODY)---
//Create a system for repeat guests
//Update DOM Elements to reflect current values +++DONE+++
//attach click handler to button to build new floors +++DONE+++
//Set cycle of guests arriving at Hotel to start after first floor is built
//Create DOM Elements for hiring new cleaning staff
//Set interval for hotel to be cleaned

$(document).ready(function(){
    hotel = new Hotel(); //sets variable to its actual value, the Hotel
    controller = new Controller(); //sets variable to its actual value, the Controller
    setInterval(getName, hotel.currentDemand()); //time period set to period adjusted for reviews
});

function Day() {
    var day = 0;
    var hour = 0;
    if (hour === 24) {
        day++;

    }
    setInterval(function() {
        hour++
    }, 5000)
}

console.log()


function Hotel() {
    this.rooms = [];
    this.roomsOccupied = 0;
    this.currentGuests = {};
    this.guestHistory = {};
    this.guestsTotal = 0;
    this.cleaningStaff = [];
    this.availableFunds = 3000;
    this.goodReviews = 0;
    this.badReviews = 0;
    this.hireStaff = function(number) { //hire new staff
        for (var i = 0; i < number; i++) {
            var staffName = names[Math.floor(Math.random()*names.length)];
            this.cleaningStaff.push(new Staff(staffName));
        }
    };
    this.clean = function() { //clean hotel with all cleaning staff
        for (var i = 0; i < this.cleaningStaff.length; i++) {
            this.cleaningStaff[i].cleanRoom();
        }
    };
    this.init = function() {
        this.hireStaff(2); //start with two cleaning staff
    };
    this.currentDemand = function() {
        return (5000-(this.goodReviews*50)+(this.badReviews*50)); //Adjust time for effects of reviews
    };
    this.addFloor = function (number) {
        var numberOfFloors = parseInt(number);
        if(numberOfFloors === undefined || isNaN(numberOfFloors)) {
            console.log("That is not a viable number of floors.");
            return;
        }
        this.availableFunds-=(numberOfFloors*2000);
        for ( var i = 0; i < (numberOfFloors*20); i++) {
            this.rooms.push(new Room());
        }
        controller.resetDisplays();
    };
    this.checkIn = function (guest) {
        for (var i = 0; i < this.rooms.length; i++) {
            if(this.rooms[i].guest === null && this.rooms[i].isClean === true) {
                if(this.rooms[i].hasWindow === guest.wantsView && this.rooms[i].numBeds >= guest.partySize) {
                    this.rooms[i].guest = guest;
                    guest.numberOfRoom = i;
                    this.currentGuests[guest] = guest;
                    $("#checkInDisplay > span").text("Welcome, "+guest.name+"! Your room is Room "+i+".");
                    // console.log("Welcome, "+guest.name+"! Your room is Room "+i+".");
                    this.roomsOccupied++;
                    this.guestsTotal++;
                    guest.beginStay();
                    controller.resetDisplays();
                    return;
                }
            }
        }
        $("#checkInDisplay > span").text("No rooms are available that fit your needs, "+guest.name+", sorry.");
        // console.log("No rooms are available that fit your needs, "+guest.name+", sorry.");
        this.badReviews++;
        controller.resetDisplays();
    };
    this.checkOut = function (guest) {
        this.rooms[guest.numberOfRoom].guest = null;
        this.rooms[guest.numberOfRoom].isClean = false;
        delete this.currentGuests[guest.ID];
        $("#checkOutDisplay > span").text("Thank you for staying at The Empty Array, "+guest.name+"! Please come back soon!");
        this.availableFunds+=(this.rooms[guest.numberOfRoom].price * guest.lengthOfStay);
        this.roomsOccupied--;
        this.goodReviews++;
        controller.resetDisplays();
    };
    this.init();
}
function Room() {
    this.numBeds = Math.floor(Math.random() * 2) +1;
    this.hasWindow = Math.round(Math.random());
    this.price = 40 * this.numBeds + (this.hasWindow * 20);
    this.isClean = true;
    this.beingCleaned = false;
    this.guest = null;
}
function Guest(name) {
    this.self = this;
    this.name = name;
    this.ID = null;
    this.numberOfRoom = null;
    this.partySize = Math.floor(Math.random() * 2) + 1;
    this.wantsView = Math.round(Math.random());
    this.lengthOfStay = Math.floor(Math.random() * 4) + 1;
    this.beginStay = function() {
        var self = this;
        setTimeout(function(){
            hotel.checkOut(self);
        }, 30000 * this.lengthOfStay);
    };
    this.numberOfRoom = null;
}
function Staff(name) {
    this.name = name;
    this.speed = 1; //Can be altered to affect how fast they clean. Maybe with happiness level?
    this.workedToday = false; //If true, they should wait until next day begins to try cleaning again.
    this.cleanRoom = function () {
        var roomCleaned = false;
        for (var i = 0; i < hotel.rooms.length; i++) {
            if (hotel.rooms[i].isClean === false && hotel.rooms[i].beingCleaned === false) {
                hotel.rooms[i].beingCleaned = true;
                roomCleaned = true;
                (function (i, staff) {
                    setTimeout(function () {
                        hotel.rooms[i].isClean = true;
                        hotel.rooms[i].beingCleaned = false;
                        console.log("Room " + i + " is clean, boss!");
                        staff.workedToday = true;
                        staff.workTimeRemaining = 0; //AFTER ROOM IS CLEANED NO EMPLOYEE DONE FOR DAY
                        staff.workedToday = true; //AFTER WORK IS DONE STATUS CHANGED
                    }, 10000);
                }(i, this));
                return;
            }
        }
        if (roomCleaned === false) {
            console.log("Nothing to clean today!");
        }
    };
    this.workTimeRemaining = 10000;
}
function Controller() {
    this.addEventListeners = function() {
        $("#submitNewRooms").on("click", function() {
            var num = parseInt($("#newFloorInput").val());
            hotel.addFloor(num);
        });
    };
    this.init = function() {
        this.addEventListeners();
    };
    this.resetDisplays = function() {
        $("#floorCount").text((hotel.rooms.length / 20));
        $("#roomsOccupied").text(hotel.roomsOccupied);
        $("#roomsAvailable").text((hotel.rooms.length - hotel.roomsOccupied));
        $("#guestsCheckedIn").text(Object.keys(hotel.currentGuests).length);
        $("#guestsTotal").text(hotel.guestsTotal);
        $("#guestsRejected").text(hotel.badReviews);
        $("#cleaningStaff").text(hotel.cleaningStaff.length);
        $("#fundsAvailable").text(hotel.availableFunds);
    };
    this.init();
}
function guestArrival(person){ //Interval for guests arriving at hotel
    var guestName = person.name; //sets guest name from array at random
    var guest = new Guest(guestName); //creates new guest with name
    hotel.checkIn(guest); //checks in guest
    if (guest.numberOfRoom !== null) { //if guest didn't get a room, this will not execute
        var guestID = Math.floor(Math.random()*1000000); //sets guest ID
        guest.ID = guestID; //Gives guest their ID as attribute
        hotel.currentGuests[guestID] = [guest]; //Adds guest to current Guest list by ID
        if (hotel.guestHistory[guestName] === undefined) { //Adds guest to guestHistory by name
            hotel.guestHistory[guestName] = [guest]; //If no other guests with their name have been to hotel, they are added to guest history as an array with themself as 0th value
        } else {
            hotel.guestHistory[guestName].push(guest); //If another guest has been in hotel by their name, they are pushed to the array containing guests by that name
        }
    }
}
var hotel = null;
var controller = null;
var ajaxOptions = {
    url: 'https://uinames.com/api/?region=united+states',
    success: guestArrival,
    dataType: 'json',
    error: function(){ console.log('oops')}
};
function getName(){
    $.ajax(ajaxOptions);
}