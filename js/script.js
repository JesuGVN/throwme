$(document).ready(function(e){
	// init

	/// SOCKET.IO

	var socket = "";
       	socket = io.connect('http://localhost:3000'); // подключение к сокету 

	socket.on('connect', function(e){

		$.ajax({
		  type: 'POST',
		  url: 'index.php',
		  data: 'socket='+ socket.id
		});

	});

	var page = document;
	var body = page.querySelector('body');

	var shwm_btn 		= document.querySelector('.show-menu'),     // show menu button
		navbar_left 	= document.querySelector('.nav-bar-left'),  // navbar
		gamebar 		= document.querySelector('.game-bar'),	    // gamebar
		room_score 	    = document.querySelector('.room-score'),    // room score block
		last_gamebar 	= document.querySelector('.last-game-bar'); // last events block


	var RoomLevel		= document.querySelector('.lvl_info #room_level'),		// Уровень Комнаты
		LevelType		= document.querySelector('.lvl_info #level_type'),		// Тип Уровня
		LevelAction     = document.querySelector('.lvl_info #level_action'),	// Действие пользователя
		LevelThrSum     = document.querySelector('.lvl_info #throw_sum'),		// Сумма которую отдаем
		LevelGetSum		= document.querySelector('.lvl_info #get_sum');			// Сумма которую получаем


	if ( document.querySelector('.nav-bar-menu') ) {
		var navbarMenu   	= document.querySelectorAll('.nav-bar-menu ul li a'),
			beginLink       = document.querySelector('.nav-bar-menu #begin'),
			myRefLink		= document.querySelector('#myRef'),
			regulLink	    = document.querySelector('#regulations'),
			userBalance     = document.querySelector('#user_balance');

		var openModal     = document.querySelectorAll('#openmodal'),
			modalZone     = document.querySelector('.modal-window'),
			allModals     = document.querySelectorAll('#window'),
			ModalClose    = document.querySelector('#window-close')

		var outPutHistory      = document.querySelector('.outPutHistory'),
			outPutButtonSubmit = document.querySelector('#outMoney');




		for(var i = 0; i <= openModal.length - 1; i++){
			openModal[i].addEventListener('click', function(data){
				openModalWindow(this.dataset);
			});
		}




		outPutButtonSubmit.addEventListener('click', function(e){
			var requisites = document.querySelector('.requisites').value,
				paySystem  = document.querySelector('.window-money-output .paySystem').value,
				errorZone  = document.querySelector('.submitOutMoney #error');
		    var errors = null;

		    console.log(requisites.length);

		    if(paySystem.length == 0){
		    	errors = 'Выберите Платежную Систему';
		    }else if(requisites.length == 0){
		    	errors = 'Заполните поле Реквизиты';
		    }else if(requisites.length < 9){
		    	errors = 'Заполните поле Реквизиты правильно!';
		    }

		    if(errors != null){
		    	errorZone.innerHTML = errors;

		    	setTimeout(function(){ errorZone.innerHTML = ""},4000);
		    }else{
		    	socket.emit('outPutBalance',[paySystem,requisites])
		    }






		});
		ModalClose.addEventListener('click', function(e){
			closeModals();
		});
		userBalance.addEventListener('click', function(e){
			socket.emit('getBalance');
		});

		socket.on('GetBalance', function(e){
			document.querySelector('#balance').innerHTML = e;
			var UOB = document.querySelector('#userOutBalance');
				UOB.value = e;
		});


		myRefLink.addEventListener('click', function(e){

			clearInterval(window.loop);
			LoadIs = false;

			var WorkZone = document.querySelector('.work-zone');

			WorkZone.innerHTML = `<div class="loading_block col-md-12 col-sm-12">
									<img src="./images/loading.svg">
									<h3 style="padding-top: 10px;">ИДЕТ ЗАГРУЗКА</h3>
								</div>`;


			$.ajax({
			  type: 'POST',
			  url: './includes/referals.php',
			  success: function(data){
		  		 WorkZone.innerHTML = data;

		  		 var copyBtn = document.querySelector('.copy'),
		  		 	 copyTxt = document.querySelector('#copy_ref');

	  		 	 copyBtn.addEventListener('click', function(e){


	  		 	 	var dummy = document.createElement("input");
				    document.body.appendChild(dummy);
				    dummy.setAttribute('value', copyTxt.innerHTML);
				    dummy.select();
				    document.execCommand("copy");
				    document.body.removeChild(dummy);


				    var saveTxt = copyTxt.innerHTML;

				    copyTxt.innerHTML = 'Ваша Ссылка Скопированна';
				   	copyTxt.classList.add('copyTrue');

				   	setTimeout(function(e){
				   		copyTxt.classList.remove('copyTrue');
				   		copyTxt.innerHTML = saveTxt;
				   	},2500);
				  




	  		 	 });
			  }
			});
		});

		beginLink.addEventListener('click', function(e){

			clearInterval(window.loop);
			LoadIs = false;

			var WorkZone = document.querySelector('.work-zone');

			WorkZone.innerHTML = `<div class="loading_block col-md-12 col-sm-12">
									<img src="./images/loading.svg">
									<h3 style="padding-top: 10px;">ИДЕТ ЗАГРУЗКА</h3>
								</div>`;


			$.ajax({
			  type: 'POST',
			  url: './includes/levels.php',
			  success: function(data){
		  		 WorkZone.innerHTML = data;
		  		 begin();
			  }
			});
		});

			for(var i = 0; i <= navbarMenu.length - 1; i++){
				navbarMenu[i].addEventListener('click', function(e){
					var hasActive = document.querySelector('.nav-bar-menu .active');
						hasActive.classList.remove('active');

					this.classList.add('active');

				});
			}
	}

	if(document.querySelector('.begin')){
		var startBtn        = document.querySelector('.begin');
	}


	var LoadIs = false;


	shwm_btn.addEventListener('mousedown', function(e){
		var menu = document.querySelector('.navigation-bar');

		if(menu.style.display == 'none'){
			hideMenu(false);

		}else{
			hideMenu(true);
		}
	});

	if(document.querySelector('.begin')){
		begin();


	}

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

	socket.on('getOutPutHistory', function(e){
		var tbody = document.querySelector('.window-money-output-history table tbody');
			tbody.innerHTML = e;
	});
	socket.on('outPutError', function(e){
		var errorZone = document.querySelector('.submitOutMoney #error');
			errorZone.innerHTML = e;

		setTimeout(function(){errorZone.innerHTML = ""}, 4000);
	});
	socket.on('moneyOutputSucces', function(e){
		var succesZone = document.querySelector('.submitOutMoney #succes');
			succesZone.innerHTML = 'Выплата успешно Создана';

		setTimeout(function(){succesZone.innerHTML = ""}, 4000);

	});
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
			console.log(data);
			EnterRoom(data);
			clearInterval(window.loop);
		}
	});

	socket.on('enterHasOwner', function(data){

		var WorkZone     = document.querySelector('.work-zone');
		clearInterval(window.loop);

		console.log(data.room.ID);
		socket.emit('updateRoomInfo',{id: data.room.ID, own: true});
		socket.on('getRoomInfo', function(data){
			if(data){
				WorkZone.innerHTML = data;
				WorkZone.style.padding = '0 0 0 15px';


			}
		});

		socket.on('gameOver', function(e){
		  // Вернуть в главное меню
		  document.location.reload(true);
		});
	});

	socket.on('lastGameAction', function(e){
		var last_gamebar = document.querySelector('.last-game-bar .block table tbody');

			if(e){
				last_gamebar.innerHTML = e;
			}


	});

	socket.on('test', function(e){
		alert('test');
	});



	function begin(){

		startBtn = document.querySelector('.begin');
		startBtn.addEventListener('click', function(e){
			// edit html

			var list = document.querySelector('.lvl_list');
			var lvlInfo = document.querySelector('.lvl_info');

			var WorkZone = document.querySelector('.work-zone');



				list.style.display = 'none';
				lvlInfo.style.display = 'none';

				WorkZone.innerHTML = `<div class="loading_block col-md-12 col-sm-12">
								<img src="./images/loading.svg">
								<p>Идет поиск. Дождитесь окончания Поиска, сервис пытается найти свободную комнату для вас!</p>
							</div>`;

				// alert(window.innerWidth);

				if(window.innerWidth < 900){

					WorkZone.scrollIntoView(true);
				}

			LoadIs = true;



			$.ajax({
			  type: 'POST',
			  url: 'ajax/getUserInfo.php',
			  data: 'getID=1',
			  success: function(data){
			  	
			  	var userID = parseInt(data);

				window.loop = setInterval(function(){
					if(LoadIs){
						// Делаем запрос на сервер
						// с проверкой свободных комнат
						socket.emit('searchRoom',userID);
						
					}else{
						clearInterval(loop);
					}
				},2000);

		  		socket.on('searchError', function(data){
					if(data){

						clearInterval(window.loop);
						var WorkZone = document.querySelector('.work-zone');
						WorkZone.innerHTML = `
							<div class="loading_block error col-md-12 col-sm-12" style="display: block">
							    <h1 style="color: #E5671B;">Ошибка</h1>
							    <p>Вы пытаетесь войти в 2 комнаты одновременно, завершите текущий уровень чтобы продолжиь.</p>
							</div>
						`;

						var LoadBlock = document.querySelector('.loading_block');
							LoadBlock.style.display = 'block';
					}
				});
		  		socket.on('searchBalanceError', function(data){
					if(data){

						clearInterval(window.loop);
						var WorkZone = document.querySelector('.work-zone');
						WorkZone.innerHTML = `
							<div class="loading_block error col-md-12 col-sm-12" style="display: block">
							    <h1 style="color: #E5671B;">Ошибка</h1>
							    <p>На вашем балансе недостаточно средств.</p>
							    <a href="/">Назад</a>
							</div>
						`;

						var LoadBlock = document.querySelector('.loading_block');
							LoadBlock.style.display = 'block';
					}
				});
			  }
			});




		});
	}

	function EnterRoom(data){
		var WorkZone     = document.querySelector('.work-zone');
		

		socket.emit('updateRoomInfo',{id: data.room.ID, own: false});


		socket.on('getRoomInfo', function(data){
			if(data){
				WorkZone.innerHTML = data;
				WorkZone.style.padding = '0 0 0 15px';

				var ThrowButton  = document.querySelector('#throw');

				ThrowButton.addEventListener('click', function(e){
					socket.emit('throwMoney',1);
				});

			}
		});

		socket.on('gameOver', function(e){
		  // Вернуть в главное меню
		  document.location.reload(true);
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



	function openModalWindow(modalID){
		closeModals(); // Закрывает все Модальные Окна
		updateData();

		var id = modalID.open; 	// 0 = Пополнение		3 = Завершение Игры
								// 1 = Вывод средств    4 = История Пополнений
								// 2 = История Вывода

		var ModalZone = document.querySelector('.modal-window'),
			Windows   = document.querySelectorAll('#window');

			console.log(Windows);


		for(var i = 0; i <= Windows.length - 1; i++){
			if(i == parseInt(id)){
				ModalZone.style.display = 'block';
				Windows[i].style.display = 'block';
			}
		}



	}

	function closeModals(){
		var ModalZone = document.querySelector('.modal-window'),
			Windows   = document.querySelectorAll('#window');

		for(var i = 0; i <= Windows.length - 1; i++){
			Windows[i].style.display = 'none'; // Закрываем все окна
		}

		ModalZone.style.display = 'none'; // Закрываем видимую зону
	}

	function updateData(){
		socket.emit('getBalance');
		socket.emit('getOutputHistory');
	}

});

