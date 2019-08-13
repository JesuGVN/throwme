$(document).ready(function(e){
	// init

	var page = document;
	var body = page.querySelector('body');

	var shwm_btn 		= document.querySelector('.show-menu'),     // show menu button
		navbar_left 	= document.querySelector('.nav-bar-left'),  // navbar
		gamebar 		= document.querySelector('.game-bar'),	    // gamebar
		room_score 	    = document.querySelector('.room-score'),    // room score block
		last_gamebar 	= document.querySelector('.last-game-bar'); // last events block

	shwm_btn.addEventListener('mousedown', function(e){
		var menu = document.querySelector('.navigation-bar');

		if(menu.style.display == 'none'){
			hideMenu(false);

		}else{
			hideMenu(true);
		}
	});

	$(window).resize(function(e){

		var width  = e.currentTarget.innerWidth,
			height = e.currentTarget.innerHeight,
		    menu = document.querySelector('.navigation-bar');

		if(width >= 770){
			hideMenu(true);
			menu.style.display = 'block';	
		}else{
			hideMenu(true);
		}
	});



	function hideMenu(i){
		var menu = document.querySelector('.navigation-bar');
		
		if(!i){  // false
			menu.style.display 		  	= 'block';
			// menu.style.background 		= '#FF844D';
			
		}else{
			menu.style.display 			= 'none';

		}
	}
});
