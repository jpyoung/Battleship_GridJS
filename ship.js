/**
 * Created by JackYoung on 9/6/14.
 */

var numbers = [1,2, 3, 4, 5, 6, 7, 8, 9, 10];
var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

var takenCoords = new Array();
takenCoords.push("E8");
takenCoords.push("F8");
takenCoords.push("E2");
takenCoords.push("F2");

function splitt(x) {
    // This is a special function that splits a string into an array.
    // JS has a split function, but that function does not work when
    // we have a coord that has a 2 digit number in addition to the
    // letter.
    if (x.length == 3) {
        var t = x.split("");
        var b = new Array();
        b.push(t[0]);
        b.push(t[1] + "" + t[2]);
        return b;
    }
    return x.split("");
}


function letterPosition(e) {
    // returns the numerical position of the passed in letter
    return letters.indexOf(e) + 1;
}


function disableNAcells(except) {
    // This function disables the cells that are out of range in the row
    // and col of the selected cell.
    console.log("Except:", except);
    for (var x = 0; x < letters.length; x++) {
        if (letters[x] != except) {
            if (!$('td[id^="' + letters[x] + '"]').hasClass("clicked")) {
                $('td[id^="' + letters[x] + '"]').addClass("disabled");
            }

        }
    }

    //  $('td[id^="' + letters[x] + '"]').hasClass("clicked")
}


function disableColumncells(except) {
    // This function disables everything cell that is not in the row of col of the selected
    // cell.
    console.log("Except:", except);
    for (var x = 0; x < numbers.length; x++) {
        if (numbers[x] != except) {
            if (!$('td[id$="' + numbers[x] + '"]').hasClass("clicked")) {
                $('td[id$="' + numbers[x] + '"]').addClass("disabled");
            }

        }
    }
}

function enableCol(include) {
    $('td[id$="' + include + '"]').removeClass("disabled");
}

function disableRemaingRowsCells(initialSelectionID) {
    var tmp = splitt(initialSelectionID);
    console.log("Remaining ROw: ", tmp);
    disableNAcells(tmp[0]);
}

function disableRemaingColumnCells(initialSelectionID) {
    var tmp = splitt(initialSelectionID);
    console.log("Remaining Col: ", tmp);
    disableColumncells(tmp[1]);
}

function showPlausibleSelections(initialSelectionID) {
    var tmp = splitt(initialSelectionID);
    disableNAcells(tmp[0]);
    enableCol(tmp[1]);

}

function clearDisabledCells() {
    $('td').removeClass("disabled");
}


function clickInSamePath(previous, selec, path) {
    var first = splitt(previous);
    var second = splitt(selec);

    if (path === "row") {
        return (first[0] === second[0]) ? true : false;
    } else if (path === "column") {
        return (first[1] === second[1]) ? true : false;
    }

}

function clearArray(a) {
    while(a.length > 0) {
        a.pop();
    }
}


function autoClick(sel) {
    $(sel).addClass("disabled");
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function Shot () {
    this.isHit = null;
    this.coords = new Array();
}

Shot.prototype.getIsHit = function() {
    return this.isHit;
}

Shot.prototype.getCoords = function() {
    return this.coords;
}

Shot.prototype.setCoords = function(x, y) {
    this.coords[0] = x;
    this.coords[1] = y;
}

Shot.prototype.setIsHit = function(v) {
    this.isHit = v;
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function Ship (name, pegLength) {
    this.name = name;
    this.pegLength = pegLength;
    this.shipCords = new Array();
    this.axisAlignment = null; // x or y or defaulted to no (null).
    this.hitShotCords = new Array();
    this.isSunk = false;
    this.potentialEnds = new Array();
}



// getters and setters
Ship.prototype.getName = function () {
    return this.name;
}

Ship.prototype.setName = function (e) {
    this.name = e;
}
Ship.prototype.getPegLength = function () {
    return this.pegLength;
}

Ship.prototype.setPegthLength = function (e) {
    this.pegLength = e;
}


// Helper methods

Ship.prototype.hasAxisAlignmentBeenDetermined = function () {
    return (this.axisAlignment == null) ? false : true;
}

//e.g. isAxisalignment("x");
Ship.prototype.isAxisAlignment = function (e) {
    return (this.axisAlignment == e) ? true : false;
}

Ship.prototype.isShipBuilt = function () {
    return (this.shipCords.length < this.pegLength) ? false : true;
}

Ship.prototype.shipCords_push = function (e) {
    if (this.shipCords.length < this.pegLength) {
        this.shipCords.push(e);
        if (this.shipCords.length == 2) {
            this.axisAlignment = clickInSamePath(this.shipCords[0], e, "row") ? "x" : "y";
        }
        this.shipCords.sort();
        return true;
    } else {
        return false;
    }
}

Ship.prototype.hitShotCords_push = function (e) {
    if (this.hitShotCords.length < this.pegLength) {
        this.hitShotCords.push(e);
        this.hitShotCords.sort();
        if (this.hitShotCords.length == this.pegLength) {
            this.isSunk = true;
        }
        return true;
    } else {
        return false;
    }
}

// Fills in the gap between the two points
Ship.prototype.fillInShip = function () {

    var tmp1 = splitt(this.shipCords[0]);
    var tmp2 = splitt(this.shipCords[1]);
    var center = parseInt(tmp1[1]);

    if (this.axisAlignment === "x") {
        console.log("were doing x");

        var leftB = tmp1[1];
        var rightB = tmp2[1];

        console.log("LeftB: " + leftB + ", rightB: " + rightB);

        for (var z = parseInt(leftB) + 1; z < rightB; z++) {
            $('td[id="' + tmp1[0] + z + '"]').addClass("clicked");
        }

    }

    if (this.axisAlignment === "y") {
        console.log("were doing y");

        var topB = letterPosition(tmp1[0]);
        var bottomB = letterPosition(tmp2[0]);
        console.log("topB: " + topB + ", bottomB: " + bottomB);

        for (var z = parseInt(topB) + 1; z < bottomB; z++) {
            $('td[id="' + letters[z - 1] + center + '"]').addClass("clicked");
        }

    }


}

Ship.prototype.removePotentialEndsColoring = function () {

    //removing the potential green select end parts of the ships
    for (var x = 0; x < this.potentialEnds.length; x++) {
        $("#" + this.potentialEnds[x]).removeClass("gr");
    }

    //clearing the disabled cells;
    clearDisabledCells();
}

function searchForRowHinderances(center, letter, number) {
        console.log("Center:" + center + ", letter:" + letter + ", number" + number);
}







function anythingOnTheLeft(center, letter) {
    for (var x = center - 1; x > 0; x--) {
        if ($('td[id="' + letter + x + '"]').hasClass("clicked")) {
            return [letter, x];
        }
    }
}

function findLeftBound(center, centerLetter, SClength, p) {
    console.log("================Left ===========================");
    console.log("===========================================");
    console.log("Center : ", center, " CenterLetter : ", centerLetter);

    console.log(anythingOnTheLeft(center, centerLetter));
    var checkLeft = anythingOnTheLeft(center, centerLetter);
    var left = center - (p - SClength);
    if (checkLeft == null) {
        left = (left < 1) ? 1 : left;
        console.log("From right", left);
        //if ()
       if ((left + (center - 1)) < p) {
            return false;
       }
        return true;
    } else {
        if (left > checkLeft[1]) {
            console.log("can proceede");
            return true;
        } else {
            console.log("cannot go left");
            return false;
        }

    }

}



function anythingOnTheRight(center, letter) {

    for ( var x = center + 1; x < 11; x++) {
        if ($('td[id="' + letter + x + '"]').hasClass("clicked")) {
            return [letter, x];
        }
    }
    return null;
}

function findRightBound(center, centerLetter, SClength, p) {
//    console.log("===========================================");
//    console.log("===========================================");
//    console.log("Center : ", center, " CenterLetter : ", centerLetter);
//    =-=Used COords:  ["E8", "F8"] ship.js:332
//    Center: 4, CenterLetter: 5 ship.js:352
//    Left: 1 , Right: 7, Top: 2, Bottom: 8 ship.js:353
//    =========================================== ship.js:278
//    =========================================== ship.js:279
//    Center :  4  CenterLetter :  E ship.js:280
//        ["E", 8] ship.js:282
//    can proceede

    console.log(anythingOnTheRight(center, centerLetter));
    var checkRight = anythingOnTheRight(center, centerLetter);
    var right = center + (p - SClength);

    if (checkRight == null) {
        right = (right > 10) ? 10 : right;
        console.log("From right", right);
        if ((right - (center - 1)) < p) {
            return false;
        }
        return true;
    } else {
        if (right < checkRight[1]) {
            console.log("can proceede");
            return true;
        } else {
            console.log("cannot go right");
            return false;
        }

    }

}



function anythingOnTheBottom(center, letter) {
    var lp = letterPosition(letter);
    for (var x = lp + 1; x < 11; x++) {
        if ($('td[id="' + letters[x - 1] + center + '"]').hasClass("clicked")) {
            return [letters[x - 1], x];
        }
    }
    return null;
}

Ship.prototype.findBottomBound = function(center, centerLetter) {
    console.log("================Bottom ===========================");
    console.log("===========================================");
    console.log("Center : ", center, " CenterLetter : ", centerLetter);


    var check = anythingOnTheBottom(center, centerLetter);
    var bottom = letterPosition(centerLetter) + (this.pegLength - this.shipCords.length);
    console.log("top:", bottom, " checkTop:", check);
    if (check == null) {
        bottom = (bottom > 10) ? 10 : bottom;
        console.log("From Top", top);
        //if ()
        if ((bottom - (letterPosition(centerLetter) - 1)) < this.pegLength) {
            return false;
        }
        return true;
    } else {
        if (bottom < check[1]) {
            console.log("can proceede");
            return true;
        } else {
            console.log("cannot go Bottom");
            return false;
        }

    }

}



function anythingOnTheTop(center, letter) {
    var lp = letterPosition(letter);
    for (var x = lp - 1; x > 0; x--) {
        if ($('td[id="' + letters[x - 1] + center + '"]').hasClass("clicked")) {
            return [letters[x - 1], x];
        }
    }
    return null;
}

Ship.prototype.findTopBound = function(center, centerLetter) {
    console.log("================Top ===========================");
    console.log("===========================================");
    console.log("Center : ", center, " CenterLetter : ", centerLetter);


    var checkTop = anythingOnTheTop(center, centerLetter);
    var top = letterPosition(centerLetter) - (this.pegLength - this.shipCords.length);
    console.log("top:", top, " checkTop:", checkTop);
    if (checkTop == null) {
        top = (top < 1) ? 1 : top;
        console.log("From Top", top);
        //if ()
        if ((top + (letterPosition(centerLetter) - 1)) < this.pegLength) {
            return false;
        }
        return true;
    } else {
        if (top > checkTop[1]) {
            console.log("can proceede");
            return true;
        } else {
            console.log("cannot go top");
            return false;
        }

    }

}

Ship.prototype.step1 = function () {

    var tmp1 = splitt(this.shipCords[0]);
    var center = parseInt(tmp1[1]);
    var centerLetter = letterPosition(tmp1[0]);

    var left = center - (this.pegLength - this.shipCords.length);
    var right = center + (this.pegLength - this.shipCords.length);
    var top = centerLetter - (this.pegLength - this.shipCords.length);
    var bottom = centerLetter + (this.pegLength - this.shipCords.length);

   // findRightBound(center, tmp1[0], this.shipCords.length, this.pegLength);

    //this.findBottomBound(center, tmp1[0]);


    left = (left < 1) ? 1 : left;
    right = (right > 10) ? 10 : right;
    top = (top < 1) ? 1 : top;
    bottom = (bottom > 10) ? 10 : bottom;


    console.log("=-=Used COords: ", takenCoords);

// code used to elinminate stuff in the row that are out of reach
//    for (var x = 1; x < left; x++) {
//        $('td[id="' + tmp1[0] + x + '"]').addClass("disabled");
//    }
//
//    for (var y = 10; y > right; y--) {
//        $('td[id="' + tmp1[0] + y + '"]').addClass("disabled");
//    }
//
//    for (var x = 1; x < top; x++) {
//        //console.log(letters[x-1] + "=+=" + center);
//        $('td[id="' + letters[x-1] + center + '"]').addClass("disabled");
//    }
//
//    for (var y = 10; y > bottom; y--) {
//        $('td[id="' + letters[y-1] + center + '"]').addClass("disabled");
//    }

    console.log("Center: " + center + ", CenterLetter: " + centerLetter);
    console.log("Left: " + left + " , Right: " + right + ", Top: " + top + ", Bottom: " + bottom);

//    if (center >= this.pegLength) {
//        this.potentialEnds.push(tmp1[0] + left);
//        $('td[id="' + tmp1[0] + left + '"]').addClass("gr");
//    } else {
//        console.log("====================No Left");
//    }





    if (findLeftBound(center, tmp1[0], this.shipCords.length, this.pegLength)) {
        this.potentialEnds.push(tmp1[0] + left);
        $('td[id="' + tmp1[0] + left + '"]').addClass("gr");
    } else {
        console.log("====================No Left");
    }

    if (findRightBound(center, tmp1[0], this.shipCords.length, this.pegLength)) {
        this.potentialEnds.push(tmp1[0] + right);
        $('td[id="' + tmp1[0] + right + '"]').addClass("gr");
    } else {
        console.log("====================No RIght");
    }


    if (this.findTopBound(center, tmp1[0])) {
        this.potentialEnds.push(letters[top-1] + center);
        $('td[id="' + letters[top-1] + center + '"]').addClass("gr");
    } else {
        console.log("====================No top");
    }

    if (this.findBottomBound(center, tmp1[0])) {
        this.potentialEnds.push(letters[bottom - 1] + center);
        $('td[id="' + letters[bottom - 1] + center + '"]').addClass("gr");
    } else {
        console.log("====================No bottom");
    }








    //    if ((center + (this.pegLength - this.shipCords.length)) <= 10) {
//        this.potentialEnds.push(tmp1[0] + right);
//        $('td[id="' + tmp1[0] + right + '"]').addClass("gr");
//    } else {
//        console.log("====================No RIght");
//    }


//    if (centerLetter >= this.pegLength) {
//        this.potentialEnds.push(letters[top-1] + center);
//        $('td[id="' + letters[top-1] + center + '"]').addClass("gr");
//    } else {
//        console.log("====================No top");
//    }


//    if ((centerLetter + (this.pegLength - this.shipCords.length)) <= 10) {
//        this.potentialEnds.push(letters[bottom - 1] + center);
//        $('td[id="' + letters[bottom - 1] + center + '"]').addClass("gr");
//    } else {
//        console.log("====================No top");
//    }


//    $('td[id="' + tmp1[0] + left + '"]').addClass("gr");
//    $('td[id="' + tmp1[0] + right + '"]').addClass("gr");
//    $('td[id="' + letters[top-1] + center + '"]').addClass("gr");
//    $('td[id="' + letters[bottom-1] + center + '"]').addClass("gr");


}


//Ship.prototype. = function () {

