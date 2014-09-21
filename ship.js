/**
 * Created by JackYoung on 9/6/14.
 */

var numbers = [1,2, 3, 4, 5, 6, 7, 8, 9, 10];
var letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

function splitt(x) {
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
    return letters.indexOf(e) + 1;
}

function disableNAcells(except) {
    console.log("Except:", except);
    for (var x = 0; x < letters.length; x++) {
        if (letters[x] != except) {
            $('td[id^="' + letters[x] + '"]').addClass("disabled");
        }
    }
}
function disableColumncells(except) {
    console.log("Except:", except);
    for (var x = 0; x < numbers.length; x++) {
        if (numbers[x] != except) {
            $('td[id$="' + numbers[x] + '"]').addClass("disabled");
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

    for (var x = 1; x < left; x++) {
        $('td[id="' + tmp1[0] + x + '"]').addClass("disabled");
    }

    for (var y = 10; y > right; y--) {
        $('td[id="' + tmp1[0] + y + '"]').addClass("disabled");
    }

    for (var x = 1; x < top; x++) {
        //console.log(letters[x-1] + "=+=" + center);
        $('td[id="' + letters[x-1] + center + '"]').addClass("disabled");
    }

    for (var y = 10; y > bottom; y--) {
        $('td[id="' + letters[y-1] + center + '"]').addClass("disabled");
    }

    console.log("Center: " + center + ", CenterLetter: " + centerLetter);
    console.log("Left: " + left + " , Right: " + right + ", Top: " + top + ", Bottom: " + bottom);

    if (center >= this.pegLength) {
        this.potentialEnds.push(tmp1[0] + left);
        $('td[id="' + tmp1[0] + left + '"]').addClass("gr");
    } else {
        console.log("====================No Left");
    }

    if ((center + (this.pegLength - this.shipCords.length)) <= 10) {
        this.potentialEnds.push(tmp1[0] + right);
        $('td[id="' + tmp1[0] + right + '"]').addClass("gr");
    } else {
        console.log("====================No RIght");
    }

    if (centerLetter >= this.pegLength) {
        this.potentialEnds.push(letters[top-1] + center);
        $('td[id="' + letters[top-1] + center + '"]').addClass("gr");
    } else {
        console.log("====================No top");
    }


    if ((centerLetter + (this.pegLength - this.shipCords.length)) <= 10) {
        this.potentialEnds.push(letters[bottom - 1] + center);
        $('td[id="' + letters[bottom - 1] + center + '"]').addClass("gr");
    } else {
        console.log("====================No top");
    }


//    $('td[id="' + tmp1[0] + left + '"]').addClass("gr");
//    $('td[id="' + tmp1[0] + right + '"]').addClass("gr");
//    $('td[id="' + letters[top-1] + center + '"]').addClass("gr");
//    $('td[id="' + letters[bottom-1] + center + '"]').addClass("gr");


}


//Ship.prototype. = function () {

