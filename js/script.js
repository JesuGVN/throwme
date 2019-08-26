$(document).ready(function(e){
	// init

	/// SOCKET.IO

	var socket = "";
    socket = io.connect("http://192.168.0.200:8080"); // подключение к сокету

	socket.on('connect', function(e){

		$.ajax({
		  type: 'POST',
		  url: 'index.php',
		  data: 'socket='+ socket.id,
		  success: function(data){
	  		 console.log('Вы успешно подключились к SOCKET серверу, ваш ID: ' + socket.id);
		  }
		});

	});

	var page = document;
	var body = page.querySelector('body');

	var shwm_btn 		= document.querySelector('.show-menu'),     // show menu button
		navbar_left 	= document.querySelector('.nav-bar-left'),  // navbar
		gamebar 		= document.querySelector('.game-bar'),	    // gamebar
		room_score 	    = document.querySelector('.room-score'),    // room score block
		last_gamebar 	= document.querySelector('.last-game-bar'); // last events block

	var SelectLevelButton = document.querySelectorAll('#select-lvl'); // Game Level List

	var RoomLevel		= document.querySelector('.lvl_info #room_level'),		// Уровень Комнаты
		LevelType		= document.querySelector('.lvl_info #level_type'),		// Тип Уровня
		LevelAction     = document.querySelector('.lvl_info #level_action'),	// Действие пользователя
		LevelThrSum     = document.querySelector('.lvl_info #throw_sum'),		// Сумма которую отдаем
		LevelGetSum		= document.querySelector('.lvl_info #get_sum');			// Сумма которую получаем

	var startBtn        = document.querySelector('.begin');

	var LoadIs          = false;


	shwm_btn.addEventListener('mousedown', function(e){
		var menu = document.querySelector('.navigation-bar');

		if(menu.style.display == 'none'){
			hideMenu(false);

		}else{
			hideMenu(true);
		}
	});

	startBtn.addEventListener('click', function(e){
		// edit html

		var list = document.querySelector('.lvl_list');
		var lvlInfo = document.querySelector('.lvl_info');
		var loadingBlock = document.querySelector('.loading_block');


			list.style.display = 'none';
			lvlInfo.style.display = 'none';
			loadingBlock.style.display = 'block';

		LoadIs = true;



		$.ajax({
		  type: 'POST',
		  url: 'ajax/getUserInfo.php',
		  data: 'getID=1',
		  success: function(data){
		  	
		  	var userID = parseInt(data);



			var loop = setInterval(function(){
				if(LoadIs){
					// Делаем запрос на сервер
					// с проверкой свободных комнат
					socket.emit('searchRoom',userID);
					
				}else{
					clearInterval(loop);
				}
			},2500);
		  }
		});




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


	for(var i = 0; i <= SelectLevelButton.length - 1; i++ ){
		SelectLevelButton[i].addEventListener('click', function(e){
			socket.emit('GetLvlInfo',this.dataset.level);
					RoomLevel.innerHTML = 'Загрузка...';
					LevelType.innerHTML = 'Загрузка...';
					
					LevelAction.innerHTML = 'Загрузка...';
					LevelThrSum.innerHTML = 'Загрузка...';
					LevelGetSum.innerHTML = 'Загрузка...';
		});
	}


	socket.on('LevelInfo', function(e){
		var info = e[0];

		RoomLevel.innerHTML = info.LEVEL;
		LevelType.innerHTML = info.TYPE;
		

		LevelThrSum.innerHTML = 0 + ' руб.';
		LevelGetSum.innerHTML = 0 + ' руб.';

		if(info.ACTION == 0){								// 0 Отдаем
			LevelThrSum.innerHTML = info.SUM + ' руб.';		// 1 Получаем 
			LevelAction.innerHTML = 'Отдаёте';
		}else{
			LevelGetSum.innerHTML = info.SUM  + ' руб.';
			LevelAction.innerHTML = 'Получаете';
		}
	});

	socket.on('enterRoom', function(data){
		if(data){
			EnterRoom(data);
		}
	});




	function EnterRoom(data){
		var WorkZone = document.querySelector('.work-zone');


		socket.emit('updateRoomInfo',data);
		socket.on('getRoomInfo', function(data){
			if(data){
				WorkZone.innerHTML = data;
			}
		});

		socket.on('gameOver', function(e){
		  // Вернуть в главное меню
		});
	}

	function hideMenu(i){
		var menu = document.querySelector('.navigation-bar');
		
		if(!i){  // false
			menu.style.display 		  	= 'block';
		}else{
			menu.style.display 			= 'none';
		}
	}

});

