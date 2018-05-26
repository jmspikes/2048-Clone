//single number should be 7.5vh
//double number should be 6.5vh
//triple number should be 4.5vh
//2048 should be 3.8vh


//globals for the number design
let base = 'rgb(194,114,0)';
//array of colors to be able to update colors programatically, just call color[value] to get right color 
//colors follow pattern red blue green
let colors = {2 : 'rgb(219, 92, 22)', 4 :'rgb(7, 95, 150)', 8 : 'rgb(12, 164, 94)', 16 : 'rgb(164, 12, 116)',
			  32 : 'rgb(12, 141, 164)', 64 : 'rgb(12, 164, 105)', 128 : 'rgb(164, 12, 12)', 256 : 'rgb(12, 83, 164',
			  512 : 'rgb(12, 247, 164)', 1028 : 'rgb(247, 12, 172)', 2048 : 'rgb(0, 0, 0)'};


//globals for game board
gameArray = Array(16).fill("");
prevArray = Array(16).fill("");

function Model(){

	//holds direction
	this.moveDir = null;
	//boolean to update on key press
	this.updateNeeded = false;
	//gets first value for first tile
	init = this.generateRandomNumber(1,16);
	//used to make sure we dont have duplicate random numbers
	prevInit = init;
	//sets first tile
	this.setTile(init, 2);
	//loops until we have 2 unique random values
	while(init == prevInit)
		init = this.generateRandomNumber(1,16);
	//sets second tile
	this.setTile(init, 2);
	//updates game locations
	this.updateBoardLocations();

}

Model.prototype.update = function(){

	let locations = [];
	let checkCollide = false;
	if(this.updateNeeded){

		//gets locations of all items
		locations = this.getLocationInfo();
		//moves tiles over based on direction indicated from user
		this.tileMove(locations, this.moveDir);

	}

	//if all items on board have been moved
	//update game board to reflect changes
	//after all moves have been made check for collisions and combine
	let doUpdate;
	if(locations.length > 0){
		for (let item of locations){
			if(item.keepGoing){
				doUpdate = false;
				break;
			}
			else
				doUpdate = true;
		}
		if(doUpdate){
			checkCollide = true;
			this.updateBoardLocations();
		}
	}

	if(checkCollide){
		//check for two tiles being adjacent in relation to direction and combine like numbers
		this.collideAndCombine(this.moveDir);
		//will update board with random tile
		this.generateNewTile();
		this.updateBoardLocations();

	}	


}

Model.prototype.generateNewTile = function(){

	//gets all numbers on the board
	let list = document.getElementById('box-container').getElementsByClassName('Box');
	let i = 0;
	//generates random number
	let newNum = this.generateRandomNumber(1,15);

	//tests if the space we've generated is already taken
	//if it iterates through all locations and cant find an open spot the game is over
	while((list[newNum-1].innerText != "") && i < 16)
		newNum = this.generateRandomNumber(1,15);
	//sets new tile
	this.setTile(newNum, 2);
}

Model.prototype.collideAndCombine = function(direction){

	//gets all numbers on the board
	let list = document.getElementById('box-container').getElementsByClassName('Box');
	//checks for first number
	for(i = 0; i < list.length; i++){
		//if number is found check for another number in the move direction
		if(list[i].innerText != ""){
			if(i+direction >= 0 && i+direction < 16){
				//checks if number to whichever direction of current item is a number
				if(list[i+direction].innerText != ""){
					//checks to see if those numbers are equal
					if(list[i+direction].innerText == list[i].innerText){
						let value = parseInt(list[i+direction].innerText)+parseInt(list[i].innerText);
						list[i].innerText = "";
						list[i].style.backgroundColor = base;
						this.setTile(i+direction+1, value);


					}

				}

			}

		}
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
						list[current.location+moveTowards].style.backgroundColor = colors[current.value];
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
						list[current.location+moveTowards].style.backgroundColor = colors[current.value];
						//update location
						current.location-=1;
					}	
					else
						current.keepGoing = false;
				}
		}

		//moving down
		if(moveTowards == 4){


				if(current.keepGoing){
					//spot is open
					//if next position is open and tile's new location is on the same row
					if( current.location+moveTowards < 16 && list[current.location+moveTowards].innerText == ""){
						//resets current tile
						list[current.location].innerText = "";
						list[current.location].style.backgroundColor =  base;
						//updates new tile
						list[current.location+moveTowards].innerText = current.value;
						list[current.location+moveTowards].style.backgroundColor = colors[current.value];
						//update location
						current.location+=1;
					}	
					else
						current.keepGoing = false;
				}
		}

		//moving up
		if(moveTowards == -4){


				if(current.keepGoing){
					//spot is open
					//if next position is open and tile's new location is on the same row
					if( current.location+moveTowards >= 0 && list[current.location+moveTowards].innerText == ""){
						//resets current tile
						list[current.location].innerText = "";
						list[current.location].style.backgroundColor =  base;
						//updates new tile
						list[current.location+moveTowards].innerText = current.value;
						list[current.location+moveTowards].style.backgroundColor = colors[current.value];
						//update location
						current.location+=1;
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

Model.prototype.setTile = function(tile, value){

	box = document.getElementById("b"+tile);
	box.innerText = value;
	box.style.backgroundColor = colors[value];

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

function Controller(model){


	this.model = model;
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

