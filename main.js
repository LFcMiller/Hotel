//Each floor has 20 rooms, rooms must be built in groups of 20 +++DONE+++
// Rooms are to be built with money +++DONE+++
// Create New Guests on a set interval +++DONE+++
// Guests checked out after predetermined number of days in JS Object
// Money accrued from room payments
//Starting cleaning staff 2 staff +++DONE+++
//charge from funds for cleaning staff based on number of rooms cleaned
//daily fees for other hotel employees
//each checkout leaves dirty room, cant be used until clean
//hire new cleaning staff as hotel grows
//price is per day, set final price to stay length * price
//Fake Yelp, negative affects lead to bad reviews, extend interval between new guests +++DONE+++
//Length of Day: 30 seconds
//Time to clean room: 10 seconds;
//Cleaning Staff can only clean one room per day (equivalent to 8 hour shift)
//Dynamically create variable name for guest equal to their name from name array !!!!!IMPORTANT!!!!!
//save number of good and bad reviews to guests created. After a certain number of bad reviews, they do not return.
//Create a system for repeat guests

var names = ["Jim","Pam","Kevin","Creed","Michael","Dwight","Angela","Meredith","Toby","Stanley","Big Tuna","Andy","Kelly","Ryan","Erin","Oscar","Phyllis","Darryl","Gabe","Holly","Jan","Robert California"];
var theEmptyArray = new Hotel();
setInterval(function(){
    var guestName = names[Math.floor(Math.random()*names.length)];
    window[guestName] = new Guest(guestName);
    theEmptyArray.checkIn(window[guestName]);
}, theEmptyArray.currentDemand);
function Hotel() {
    this.rooms = [];
    this.guests = {};
    this.cleaningStaff = 2;
    this.availableFunds = 1000;
    this.goodReviews = 0;
    this.badReviews = 0;
    this.currentDemand = function() {
        var output = 5000-(theEmptyArray.goodReviews*50)+(theEmptyArray.badReviews*50);
        return output;
    };
    this.init = function() {
      this.addFloor(1);
    };
    this.addFloor = function (number) {
        this.availableFunds-=(number*2000);
        for ( var i = 0; i < (number*20); i++) {
            this.rooms.push(new Room());
        }
    };
    this.checkIn = function (guest) {
        for (var i = 0; i < this.rooms.length; i++) {
            if(this.rooms[i].guest === null) {
                if(this.rooms[i].hasWindow === guest.wantsView && this.rooms[i].numBeds >= guest.partySize) {
                    this.rooms[i].guest = guest;
                    guest.numberOfRoom = i;
                    this.guests[guest] = guest;
                    console.log("Welcome! Your room is room "+i);
                    return;
                }
            }
        }
        console.log("No room, sorry.");
        this.badReviews++;
    };
    this.init();
}
function Room() {
    this.numBeds = Math.floor(Math.random() * 2) +1;
    this.hasWindow = Math.round(Math.random());
    this.price = 40 * this.numBeds + (this.hasWindow * 20);
    this.isClean = true;
    this.guest = null;
}
function Guest(name) {
    this.name = name;
    this.partySize = Math.floor(Math.random() * 2) + 1;
    this.wantsView = Math.round(Math.random());
    this.lengthOfStay = Math.floor(Math.random() * 4) + 1;
    this.beginStay = function(stayTime) {
        setTimeout(theEmptyArray.checkOut(window[this.name]))
    };
    this.numberOfRoom = null;
}
function Controller() {
    this.addEventListeners = function() {

    };
}