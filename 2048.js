//single number should be 7.5vh
//double number should be 6.5vh
//triple number should be 4.5vh
//2048 should be 3.8vh


//globals for the number design
let base = 'rgb(194,114,0)';
//array of colors to be able to update colors programatically 
//two = 'rgb(219, 92, 22)'
let colors = ['rgb(219, 92, 22)'];


//globals for game board
gameArray = Array(16).fill("");
prevArray = Array(16).fill("");

function Model(){

	//holds direction
	this.moveDir = null;
	//lets us know tiles need to be moved
	this.moveDirCount = [];
	this.updateNeeded = false;
	//initialize array to keep gamestate

	//gets first value for first tile
	init = this.generateRandomNumber(1,16);
	//used to make sure we dont have duplicate random numbers
	prevInit = init;
	//sets first tile
	this.setTile(init, 2, colors[0]);
	//loops until we have 2 unique random values
	while(init == prevInit)
		init = this.generateRandomNumber(1,16);
	//sets second tile
	this.setTile(init, 2, colors[0]);
	//array to hold game keys and the distance they need to move
	//updates game locations
	this.updateBoardLocations();

}

Model.prototype.update = function(){

	let distance = [];
	if(this.updateNeeded){

		//gets locations of all items
		distance = this.getLocationInfo();
		//calculates how many moves towards direction will be needed
		this.tileMove(distance, this.moveDir);

	}

}


Model.prototype.updateBoardLocations = function(){

	//sets array for calculating distances moved
	prevArray = gameArray;
	//resets array for current values 
	gameArray = Array(16).fill("");
	//gets current values from page
	let list = document.getElementById('box-container').getElementsByClassName('Box');
	for(i = 0; i < list.length; i++){
		if(list[i].innerText != "")
			gameArray[i] = list[i].innerText;
	}

}

Model.prototype.tileMove = function(distInfo, moveTowards){

	//gets all numbers on the board
	let list = document.getElementById('box-container').getElementsByClassName('Box');

	//loops all tiles to move
	for(i = 0; i < distInfo.length; i++){

		//for ease of writing
		let current = distInfo[i];

		//moving right
		if(moveTowards == 1){


				if(current.keepGoing){
					//spot is open
					//if next position is open and tile's new location is on the same row
					if( current.location+moveTowards < 16 && list[current.location+moveTowards].innerText == "" && current.location+moveTowards > 4*current.row && current.location < 4*current.row+3){
						//resets current tile
						list[current.location].innerText = "";
						list[current.location].style.backgroundColor =  base;
						//updates new tile
						list[current.location+moveTowards].innerText = current.value;
						list[current.location+moveTowards].style.backgroundColor = colors[0];
						//update location
						current.location+=1;
					}	
					else
						current.keepGoing = false;
				}
		}

		//moving left
		if(moveTowards == -1){

				
				if(current.keepGoing){
					//spot is open
					//if next position is open and tile's new location is on the same row
					if( current.location+moveTowards >= 0 && list[current.location+moveTowards].innerText == "" && current.location+moveTowards >= 4*current.row && current.location <= 4*current.row+3){
						//resets current tile
						list[current.location].innerText = "";
						list[current.location].style.backgroundColor =  base;
						//updates new tile
						list[current.location+moveTowards].innerText = current.value;
						list[current.location+moveTowards].style.backgroundColor = colors[0];
						//update location
						current.location-=1;
					}	
					else
						current.keepGoing = false;
				}
		}


	}

	//used to calculate if all possible blocks have been moved to their end location 
	mCounter = 0;
	for(i = 0; i < distInfo.length; i++)
	{
		if(distInfo[i].keepGoing == false)
			mCounter+=1;

		if(mCounter == distInfo.length)
			this.updateNeeded = false;
	}



}

Model.prototype.getLocationInfo = function(){

	//holder for information
	let distanceHolder = [];

	//gets all numbers on the board
	let list = document.getElementById('box-container').getElementsByClassName('Box');
	//get first location of number
	for(i = 0; i < list.length; i++){
		//if we've found a number
		if(list[i].innerText != ""){
			//array to store information
			let distanceInfo = [];
			//gets location
			distanceInfo.location = i;
			//gets value of location
			distanceInfo.value = list[i].innerText;

			//gets which row the value is
			if(i < 4)	
				distanceInfo.row = 0;
			else if(i < 8)
				distanceInfo.row = 1;
			else if(i < 12)
				distanceInfo.row = 2;
			else if(i < 16)
				distanceInfo.row = 3;

			distanceInfo.keepGoing = true;
			//stores that in array
			distanceHolder.push(distanceInfo);
		}
	}

	//returns array of distances
	return distanceHolder;

}

Model.prototype.setTile = function(tile, value, color){

	box = document.getElementById("b"+tile);
	box.innerText = value;
	box.style.backgroundColor = color;

}

Model.prototype.move = function(direction){

	/*
		NOTES ON FUNCTION:
		Using numbers to denote direction instead of string
		to avoid having to do string parsing in other functions

		KEY: 
		1 = right
		-1 = left
		-4 = up
		4 = down

	*/

	//move one space to right, updateNeeded check to make sure we're not mid animation
	if(direction == 'r' && this.updateNeeded == false){
		this.moveDir = 1;
		this.updateNeeded = true;
	}
	//move one space to the left, updateNeeded check to make sure we're not mid animation
	else if(direction == 'l' && this.updateNeeded == false){
		this.moveDir = -1;
		this.updateNeeded = true;
	}
	//move "up" or 4 spaces above where we are, updateNeeded check to make sure we're not mid animation
	else if(direction == 'u' && this.updateNeeded == false){
		this.moveDir = -4;
		this.updateNeeded = true;
	}
	//move "down" or 4 spaces below where we are, updateNeeded check to make sure we're not mid animation
	else if(direction == 'd' && this.updateNeeded == false){
		this.moveDir = 4;
		this.updateNeeded = true;
	}

}

//used for generating first two tiles
Model.prototype.generateRandomNumber = function(min, max){

	min = Math.ceil(min);
	max = Math.floor(max);

	return Math.floor(Math.random()*(max - min))+min;


}


//handles user interaction

function Controller(model, view){


	this.model = model;
	this.view = view;
	this.key_right = false;
	this.key_left = false;
	this.key_up = false;
	this.key_down = false;
	let self = this;

	//event listeners for key down
	document.addEventListener('keydown', function(event){self.keyDown(event);}, false);


}

Controller.prototype.keyDown = function(event){

	//checks what the key is and sets appropriate key value
	if(event.keyCode == 39) this.key_right = true;
	else if(event.keyCode == 37) this.key_left = true;
	else if(event.keyCode == 38) this.key_up = true;
	else if(event.keyCode == 40) this.key_down = true;

}

Controller.prototype.update = function(){

	//right key has been pressed
	if(this.key_right){
		this.model.move('r');
		this.key_right = false;
	}
	//left key has been pressed
	if(this.key_left){
		this.model.move('l');
		this.key_left = false;
	}
	//up key has been pressed
	if(this.key_up){
		this.model.move('u');
		this.key_up = false;
	}
	//down key has been pressed
	if(this.key_down){
		this.model.move('d');
		this.key_down = false;
	}

}



function Game(){

	this.model = new Model();
	this.controller = new Controller(this.model);

}

Game.prototype.onTimer = function(){

	this.controller.update();
	this.model.update();

}

let game = new Game();
let timer = setInterval(function(){game.onTimer();}, 40);

/*


//grid for gamestate, will be set to number if position is filed;
let game = Array(16).fill("");
//number of tiles in current game, used for moving
occurences = 2;

//global to keep game running
gameState = true;
animationsFinished = true;
waitingForCompletion = true;

var displayObjects = [];
var displayHolder = [];

i = 0;



//function for drawing background board

//function for board initialization
function setTwoTiles(){

	//gets first tile to draw on
	let tileA = Math.floor((Math.random()*4) +1);
	let tileB = Math.floor((Math.random()*4) +1);
	//create string for which box
	let box = "box";
	//set string
	let which = box.concat(tileA+""+tileB);
	//sets box value to 2
	document.getElementById(which).innerText = 2;
	//sets box background to dark orange
	document.getElementById(which).style.backgroundColor = two;

	//get second tile to draw on, make sure it's not the same tile
	let tile2A = Math.floor((Math.random()*4) +1);
	while(tile2A == tileA){
		tile2A = Math.floor((Math.random()*4) +1);
	}
	let tile2B = Math.floor((Math.random()*4) +1);
	while(tile2B == tileB){
		tile2B = Math.floor((Math.random()*4) +1);
	}
	//sets string
	which = box.concat(tile2A+""+tile2B);
	//sets that box's value
	document.getElementById(which).innerText = 2;
	//sets box color
	document.getElementById(which).style.backgroundColor = two;


	//updates board with new values
	updateBoard();
}

//handles when user presses keys
document.onkeydown = function(event){

	//37 is left key
	//38 is up arrow
	//39 is right key
	//40 is down key

	event = window.event;

	if(gameState){

		//boolean to make sure animations have completed
		//before accepting new input
		if(animationsFinished){
			if(event.keyCode == 37){

				moveLeft(undefined, undefined, undefined);

			}
			if(event.keyCode == 38){


			}
			if(event.keyCode == 39){
				
				//must be capital letter for buildling function call
				findLocations("Right", undefined);
				invokeAnimations();
				//moveRight(undefined, undefined, undefined);

			}	
			if(event.keyCode == 40){

			}
		}
	}
}

//moves all tiles to the left
function moveLeft(offset, openPos){

	/*NOTES ON FUNCTION:
	Since each test is to find the first occurence in the row
	will not need to worry about preserving position of
	multiple occurences in the same row

	*/





	/*




	var list = document.getElementById('box-container').getElementsByClassName('box');
	var openPosition = openPos;


	//we're in a recursive call
	if(offset != undefined){

		var row;
		//gets row based off of position passed in
		if(offset < 4)
			row = 0;
		else if(offset < 8)
			row = 4;
		else if(offset < 12)
			row = 8;
		else
			row = 12;

		//iterates 4 columns from current row
		for(let i = row; i < row+4; i++){
		//gets first open position
		if(list[i].innerText == ""){

				//if open position has already been set and theres
				//an opening that's before that position
				if(openPosition > i && openPosition != undefined){

					openPosition = i;
					break;
				}
				//openPosition hasn't been set
				if(openPosition == undefined){
					openPosition = i;
					break;
				}

			}
		}

			//shifts item over to open position
			shiftLX(openPosition, offset, list);

		return;

	}


	//finds first occurence, sets up recursive call
	for(let i = 0; i < list.length; i++){


		//have found number
		if(list[i].innerText == game[i] && list[i].innerText != ""){

			moveLeft(i, openPosition);

		}

	}


}


//moves all tiles to the right
function moveRight(offset, openPos, oldI, waiting){

	/*NOTES ON FUNCTION:
	Since each test is to find the first occurence in the row
	will not need to worry about preserving position of
	multiple occurences in the same row

	*/




	/*

	let list = document.getElementById('box-container').getElementsByClassName('box');
	let openPosition = openPos;
	i = oldI;
	waitingForCompletion = waiting;
	let row = 0;

	//we're in a recursive call
	if(offset != undefined){

		//gets row based off of position passed in
		//sets row to the right side
		if(offset < 4)
			row = 3;
		else if(offset < 8)
			row = 7;
		else if(offset < 12)
			row = 11;
		else
			row = 15;

		//iterates 4 columns from current row
		for(let k = row; k > row-4; k--){
		//gets first open position
		if(list[k].innerText == ""){

				if(openPosition > k && openPosition != undefined){

					openPosition = k;
					break;
				}
				//openPosition hasn't been set
				if(openPosition == undefined){
					openPosition = k;
					break;
				}

			}
		}

			//shifts item over to open position
			shiftRX(openPosition, offset, list);

		//after we've shifted first item over return to 
		//previous call to do the second item
		return;

	}

	
	//finds first occurence, sets up recursive call
		for(let j = 0; j < list.length-1; j++){

			let which = j;
			//have found number
			if(list[j].innerText == game[j] && list[j].innerText != ""){

				//moveRight(which, openPosition);

				displayObjects.direction = "right";
				displayObjects.which = which;
				displayObjects.openPosition = openPosition;
				displayHolder.push(displayObjects);
			
		}
		
	}
}




//shift is only called for moving, open < current = left
// open > current = right
function shiftLX(open, current, list){

	from = current;
	counter = current-1;

	//moving left
	if(open < current){

			for(let i = counter; i >= open; i--){

				list[current].innerText = "";
				list[current].style.backgroundColor = base;
				current -=1;
				list[i].innerText = game[from];
				list[i].style.backgroundColor = two;

				

			}
			

	}

	//updates game board to values that were just moved
	updateBoard();
}

//shift is only called for moving, open < current = left
// open > current = right
function shiftRX(open, current, list){

	from = current;
	counter = current+1;

	//moving left
	if(open > current){


	    //window.setInterval(invokeWait(open, current, from, counter, list), 10000);


	   	var id = window.setTimeout(instance, 100);
		
		function instance(){
    		if(open > current){
			list[current].innerText = "";
			list[current].style.backgroundColor = base;
			current +=1;
			list[counter].innerText = game[from];
			list[counter].style.backgroundColor = two;
			shiftRX(open, current, list);
			}
			else{
				clearInterval(id)
			}

	    }
	


			/*for(let i = counter; i <= open; i++){
				
				list[current].innerText = "";
				list[current].style.backgroundColor = base;
				current +=1;
				list[i].innerText = game[from];
				list[i].style.backgroundColor = two;

			}

	}

	//updates game board to values that were just moved
	updateBoard();

}

function findLocations(direction, openPosition){

	/*NOTES ON FUNCTION
	This reads the board and finds all occurences of
	a number in the board, and loads them into a display array
	*/



	/*

	//gets current displayed board
	let list = document.getElementById('box-container').getElementsByClassName('box');

		//finds first occurence, set up for recursive call
		for(let j = 0; j < list.length-1; j++){
			//extra layer of protection against modifying the 
			//wrong value, ran into an issue of iterator
			//being updated from recursive call for reasons I dont understand yet
			let which = j;
			//have found number
			if(list[j].innerText == game[j] && list[j].innerText != ""){

				//moveRight(which, openPosition);
				//gives information to display array
				displayObjects.push({dir:direction, whi:which, op:openPosition});
			
			}
			
		}

}

function invokeAnimations(){



		for(i = 0; i < displayObjects.length; i++){

			let item = displayObjects[i];
			//build string to call move
			let anim = "move"+item.dir+"("+item.whi+", "+item.op+", "+i+", "+waitingForCompletion+");";
			waitingForCompletion = true;
			eval(anim);

		}

	}




function updateBoard(){

	//resets game array to clear out old values after movement
	game = Array(16).fill("");

	//gets list of items from the grid
	var list = document.getElementById('box-container').getElementsByClassName('box');
	//iterates through and finds numbers, updates game array
	for(i = 0; i < list.length; i++){
		if(list[i].innerHTML != "")
			game[i] = list[i].innerHTML;

	}
}


//generate 2 random tiles to place value in to start
setTwoTiles();
//updates game controller to know which tiles were initialized



*/

