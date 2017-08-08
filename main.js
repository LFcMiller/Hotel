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
//Cleaning Staff can only clean one room per day (equivalent to 8 hour shift) +++DONE+++
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
    day = new Day();
    day.startCount();
});

function Day() {// creates the day and sets the hour interval to 5 seconds
    this.day = 0;
    this.hour = 0;
    this.startCount = function () {
        (function (time) {
            setInterval(function () {
                time.hour++;
                if (time.hour === 24) {
                    for (var i = 0; i < hotel.cleaningStaff.length; i++) {//resetting the cleaning staffs availability each new day
                        hotel.cleaningStaff[i].workedToday = false;
                        hotel.cleaningStaff[i].workTimeRemaining = 40000;

                    }
                    time.day++;
                    time.hour = 0;
                }
            }, 5000)
        })(this);
    }
}


function Hotel() {
    this.rooms = []; //All rooms in hotel
    this.roomsOccupied = 0; //Rooms currently occupied
    this.currentGuests = {}; //Guests currently in hotel
    this.guestHistory = {}; //All guests who have stayed in hotel
    this.guestsTotal = 0; //number of guests who have stayed in hotel
    this.cleaningStaff = []; //Array of all cleaning staff
    this.availableFunds = 3000; //Available money to be spent. Must buy first floor, so initial total should be 1000 dollars.
    this.goodReviews = 0; //Number of good reviews accrued from guests
    this.badReviews = 0; //Number of bad reviews accrued from rejected potential guests
    this.hireStaff = function(number) { //hire new staff
        for (var i = 0; i < number; i++) {
            var staffName = null; //FIND WAY TO SET RANDOM NAME WHILE NOT RUNNING GUEST ARRIVAL AUTOMATICALLY
            this.cleaningStaff.push(new Staff(staffName));
        }
    };
    this.clean = function() { //clean hotel with all cleaning staff
        var availStaff = this.cleaningStaff.map(function(x){return x.workedToday === false});//new array of staff who haven't worked today
        for (var i = 0; i < availStaff.length; i++) {
            availStaff[i].cleanRoom();
        }
    };
    this.init = function() {
        this.hireStaff(2); //start with two cleaning staff
    };
    this.currentDemand = function() {
        return (5000-(this.goodReviews*50)+(this.badReviews*50)); //Adjust time for effects of reviews
    };
    this.addFloor = function (number) { //Buy floor for hotel
        var numberOfFloors = parseInt(number);
        if(numberOfFloors === undefined || isNaN(numberOfFloors)) {
            console.log("That is not a viable number of floors.");
            return;
        }
        this.availableFunds-=(numberOfFloors*2000); //Remove cost of floor
        for ( var i = 0; i < (numberOfFloors*20); i++) { //20 rooms per floor
            this.rooms.push(new Room());
        }
        controller.resetDisplays(); //update DOM
    };
    this.checkIn = function (guest) {
        for (var i = 0; i < this.rooms.length; i++) { //search for unoccupied room
            if(this.rooms[i].guest === null && this.rooms[i].isClean === true) { //if not occupied and clean
                if(this.rooms[i].hasWindow === guest.wantsView && this.rooms[i].numBeds >= guest.partySize) { //check if room can accomodate guest's party and desire for window
                    this.rooms[i].guest = guest; //put guest in room
                    guest.numberOfRoom = i; //save room number to guest
                    this.currentGuests[guest] = guest; //add guest to current guest registry
                    $("#checkInDisplay > span").text("Welcome, "+guest.name+"! Your room is Room "+i+"."); //Message on DOM
                    this.roomsOccupied++; //increment occupied rooms
                    this.guestsTotal++; //increment total guests count
                    guest.beginStay(); //begin timer for length of stay
                    controller.resetDisplays(); //update DOM
                    return;
                }
            }
        }
        $("#checkInDisplay > span").text("No rooms are available that fit your needs, "+guest.name+", sorry."); //if they couldn't be placed, show rejection message
        this.badReviews++; //give hotel bad review
        controller.resetDisplays(); //Update DOM
    };
    this.checkOut = function (guest) { //check out guest
        this.rooms[guest.numberOfRoom].guest = null; //reset room to empty
        this.rooms[guest.numberOfRoom].isClean = false; //set room to dirty
        delete this.currentGuests[guest.ID]; //delete guest from current registry, still in guest history
        $("#checkOutDisplay > span").text("Thank you for staying at The Empty Array, "+guest.name+"! Please come back soon!"); //message on DOM
        this.availableFunds+=(this.rooms[guest.numberOfRoom].price * guest.lengthOfStay); //calculate price based on room price and length of stay
        this.roomsOccupied--; //decrement occupied room count
        this.goodReviews++; //increment good reviews
        controller.resetDisplays(); //update DOM
    };
    this.init(); //currently gives two cleaning staff
}
function Room() {
    this.numBeds = Math.floor(Math.random() * 2) +1; //number of beds in room
    this.hasWindow = Math.round(Math.random()); // 0 is no, 1 is yes
    this.price = 40 * this.numBeds + (this.hasWindow * 20); // additional cost for extra beds and window
    this.isClean = true; //clean and ready to be used or not
    this.beingCleaned = false; //currently being cleaned
    this.guest = null; //guest currently in room
}
function Guest(name) {
    this.name = name; //guest name
    this.ID = null; //guest ID
    this.numberOfRoom = null; //room number once checked in
    this.partySize = Math.floor(Math.random() * 2) + 1; //number of people in party
    this.wantsView = Math.round(Math.random()); //wants window or not. 0 is no, 1 is yes
    this.lengthOfStay = Math.floor(Math.random() * 4) + 1; //number of days staying
    this.beginStay = function() { //starts time period of guest stay using closure and immediately invoked function
        (function (guest) {
            setTimeout(function(){
                hotel.checkOut(guest);
            }, 30000 * guest.lengthOfStay);
        }(this));
    };
}
function Staff(name) {
    this.name = name; //staff name
    this.speed = 1; //Can be altered to affect how fast they clean. Maybe with happiness level?
    this.workedToday = false; //If true, they should wait until next day begins to try cleaning again.
    this.workTimeRemaining = 40000; //If we want tasks that take up certain amounts of time use this to decrement realtive to hours
    this.cleanRoom = function () {
        for (var i = 0; i < hotel.rooms.length; i++) { //cycle through hotel rooms
            if (hotel.rooms[i].isClean === false && hotel.rooms[i].beingCleaned === false) { //if room is dirty and not currently being cleaned
                hotel.rooms[i].beingCleaned = true; //mark room as being cleaned
                (function (i, staff) { //closure to save i value and current staff member
                    setTimeout(function () { //finish cleaning room in ten seconds
                        hotel.rooms[i].isClean = true; //room now clean
                        hotel.rooms[i].beingCleaned = false; //no longer being cleaned
                        console.log("Room " + i + " is clean, boss!"); //message should be on DOM eventually
                        staff.workedToday = true; //mark staff as having worked today
                        staff.workTimeRemaining = 0; //AFTER ROOM IS CLEANED NO EMPLOYEE DONE FOR DAY
                        staff.workedToday = true; //AFTER WORK IS DONE STATUS CHANGED
                    }, 10000);
                }(i, this));
                return; //end function before message denoting no room was cleaned
            }
        }
        console.log("Nothing to clean today!"); //logged if all rooms were already clean
    };
}
function Controller() {
    this.addEventListeners = function() {
        $("#submitNewRooms").on("click", function() { //click handler to build floor
            var num = parseInt($("#newFloorInput").val());
            hotel.addFloor(num);
        });
    };
    this.init = function() { //add click handler on startup
        this.addEventListeners();
    };
    this.resetDisplays = function() { //reset DOM elements
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

var day =  null;
var hotel = null; //reserve variable for document ready
var controller = null; //reserve variable for document ready
var ajaxOptions = { //random name repository preferences
    url: 'https://uinames.com/api/?region=united+states', //only american names
    success: guestArrival, //upon successfully getting name, run this function
    dataType: 'json', //type data is saved as
    error: function(){ console.log('oops')} //logged if there was a problem getting name
};
function getName() { //function to start getting random name
    $.ajax(ajaxOptions);
}