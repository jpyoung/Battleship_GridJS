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
takenCoords.push("C4");
takenCoords.push("C5");
takenCoords.push("C6");

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

Shot.prototype.setCoords = function(letter, number) {
    this.coords[0] = letter;
    this.coords[1] = number;
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
        //console.log("were doing x");
        var leftB = tmp1[1];
        var rightB = tmp2[1];
        //console.log("LeftB: " + leftB + ", rightB: " + rightB);

        for (var z = parseInt(leftB) + 1; z < rightB; z++) {
            //console.log("Coords: ", tmp1[0] + z);
            this.shipCords_push(tmp1[0] + z);
            $('td[id="' + tmp1[0] + z + '"]').addClass("clicked");
        }

    }

    if (this.axisAlignment === "y") {
        //were doing y");

        var topB = letterPosition(tmp1[0]);
        var bottomB = letterPosition(tmp2[0]);
        //"topB: " + topB + ", bottomB: " + bottomB);

        for (var z = parseInt(topB) + 1; z < bottomB; z++) {
            this.shipCords_push(letters[z - 1] + center);
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


function hasClickedClass(letter, number) {
    // function is used by the anything methods to check if
    // the given letter and number have click class
    if ($('td[id="' + letter + number + '"]').hasClass("clicked")) {
        return true;
    }
    return false;
}



function anythingOnTheLeft(center, letter) {
    // returns an array  example ["F", 2] Center :  5  CenterLetter :  F  peg length of 3
    for (var x = center - 1; x > 0; x--) {
        if (hasClickedClass(letter, x)) {
            return [letter, x];
        }
    }
}

Ship.prototype.findLeftBound = function (center, centerLetter) {

    var check = anythingOnTheLeft(center, centerLetter);
    var left = center - (this.pegLength - this.shipCords.length);
    if (check == null) {
        // no bound found on left side
        left = (left < 1) ? 1 : left;

        if ((left + (center - 1)) < this.pegLength) {
            return false;
        }
        return true;
    } else {
        // found a bound on the left side

        // true can go left, false cannot go left
        return (left > check[1]) ? true : false;
    }

}


function anythingOnTheTop(center, letter) {
    var lp = letterPosition(letter);
    for (var x = lp - 1; x > 0; x--) {
        if (hasClickedClass(letters[x - 1], center)) {
            return [letters[x - 1], x];
        }
    }
    return null;
}

Ship.prototype.findTopBound = function(center, centerLetter) {

    var check = anythingOnTheTop(center, centerLetter);
    var top = letterPosition(centerLetter) - (this.pegLength - this.shipCords.length);

    if (check == null) {
        top = (top < 1) ? 1 : top;

        if ((top + (letterPosition(centerLetter) - 1)) < this.pegLength) {
            return false;
        }
        return true;
    } else {
        // true can go top, false cannot go top
        return (top > check[1]) ? true : false;
    }

}


function anythingOnTheRight(center, letter) {

    for ( var x = center + 1; x < 11; x++) {
        if (hasClickedClass(letter, x)) {
            return [letter, x];
        }
    }
    return null;
}

Ship.prototype.findRightBound = function(center, centerLetter) {

    var check = anythingOnTheRight(center, centerLetter);
    var right = center + (this.pegLength - this.shipCords.length);

    if (check == null) {
        right = (right > 10) ? 10 : right;
        if ((right - (center - 1)) < this.pegLength) {
            return false;
        }
        return true;
    } else {
        // true can go left, false cannot go left
        return (right < check[1]) ? true : false;
    }

}



function anythingOnTheBottom(center, letter) {
    var lp = letterPosition(letter);
    for (var x = lp + 1; x < 11; x++) {
        if (hasClickedClass(letters[x - 1], center)) {
            return [letters[x - 1], x];
        }
    }
    return null;
}

Ship.prototype.findBottomBound = function(center, centerLetter) {

    var check = anythingOnTheBottom(center, centerLetter);
    var bottom = letterPosition(centerLetter) + (this.pegLength - this.shipCords.length);

    if (check == null) {
        bottom = (bottom > 10) ? 10 : bottom;
        if ((bottom - (letterPosition(centerLetter) - 1)) < this.pegLength) {
            return false;
        }
        return true;
    } else {
        // true can go bottom, false cannot go bottom
        return (bottom < check[1]) ? true : false;
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

    left = (left < 1) ? 1 : left;
    right = (right > 10) ? 10 : right;
    top = (top < 1) ? 1 : top;
    bottom = (bottom > 10) ? 10 : bottom;

    var anyValidEndPoints = 0;

    if (this.findLeftBound(center, tmp1[0])) {
        this.potentialEnds.push(tmp1[0] + left);
        $('td[id="' + tmp1[0] + left + '"]').addClass("gr");
    } else {
        //No Left bound");
        anyValidEndPoints++;
    }

    if (this.findRightBound(center, tmp1[0])) {
        this.potentialEnds.push(tmp1[0] + right);
        $('td[id="' + tmp1[0] + right + '"]').addClass("gr");
    } else {
        //No RIght bound");
        anyValidEndPoints++;
    }

    if (this.findTopBound(center, tmp1[0])) {
        this.potentialEnds.push(letters[top-1] + center);
        $('td[id="' + letters[top-1] + center + '"]').addClass("gr");
    } else {
        //No top bound");
        anyValidEndPoints++;
    }

    if (this.findBottomBound(center, tmp1[0])) {
        this.potentialEnds.push(letters[bottom - 1] + center);
        $('td[id="' + letters[bottom - 1] + center + '"]').addClass("gr");
    } else {
        //No bottom bound");
        anyValidEndPoints++;
    }

    if ( anyValidEndPoints === 4) {
        alert("Error, there are no possible endpoints to end this ship on. U must undo");
    }

}
