// NODE



/* 
    TTTTTTTTTT TT   TT  TTTTTT      TTTT     TT      TT      TT
        TT     TT   TT  TT   TT   TT    TT    TT    TTTT    TT
        TT     TTTTTTT  TTTTT    TT      TT    TT  TT TT  TT
        TT     TT   TT  TT  TT    TT    TT      TTTT   TTTT
        TT     TT   TT  TT   TT     TTTT         TT     TT

        				TTTT    TTTT  TTTTTT
        				TT TT  TT TT  TT
        				TT  TTTT  TT  TTTTTT
        				TT   TT   TT  TT
        				TT        TT  TTTTTT


        			  T H R O W M E - 2 0 1 9

		  DEV:           EDUARD SHUMKOV
		  PRODUCT TYPE:  WEB-SITE
		  PRODUCT NAME:  THROWME
		  DOMAIN:        THROWME.RU
		  IP ADRESS:     37.230.115.44


*/	

const express = require('express');
const app     = express();
const server  = require('http').Server(app);
const io      = require('socket.io')(server);



const mysql       = require('mysql');
var config        = require('../config.json');
var md5           = require('md5');
var connection;

const TelegramBot = require('node-telegram-bot-api');
const token       = '872752319:AAEcZBm4blRogdY0joCFecI5bw3OwvObQRI';
const bot = new TelegramBot(token, {polling: true, parse_mode: 'html'}); // Подключаем Бота

var currentDate; // Текущая Дата
var currentUsersCount = 0; // Кол-во пользователей


setInterval(function(){
  date = new Date();
  currentDate  = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear();   // Узнаем текущую дату.

},1000);



require('events').defaultMaxListeners = 100;


_Init();

io.on('connection', function(socket){

    currentUsersCount++;
    // socket.broadcast.emit('lastGameAction', '1');
    this.setMaxListeners(150);
    console.log('User Connected, id: ' + socket.id);

    var roomTimer;

    getLastGames(false); // Выводим список последних игр для пользователя

    socket.on('disconnect', function (e) {

        currentUsersCount--;
        clearInterval(roomTimer);
        connection.query('SELECT * FROM users WHERE socket_id = ?', socket.id, function(err,user){
            if(err) throw err;
            else{
                if(user.length > 0){
                    connection.query('UPDATE users SET ? WHERE vk_id = ?', [{socket_id: 'none', is_online: 'offline'}, user[0].vk_id], function(err,res){
                        if(err) throw err;
                        else{
                            console.log('Пользователь, ' + user[0].first_name + ' ' + user[0].last_name + '(' + user[0].vk_id + ')' + ' Отключился');

                            if(user[0].gave == 0 && user[0].current_room != 0){
                                connection.query('SELECT * FROM rooms WHERE ID = ?',parseInt(user[0].current_room), function(err,res){
                                    
                                    if(err) throw err;
                                    else{
                                        if(res.length > 0){
                                            console.log(true);
                                            res = res[0];
                                            if(res.STATUS != 1){
                                                connection.query('UPDATE rooms SET ? WHERE ID = ?',[{USERS_COUNT: res.USERS_COUNT - 1}, res.ID], function(err,res){
                                                    if(err) throw err;
                                                    else{
                                                        connection.query('UPDATE users SET ? WHERE vk_id = ?', [{current_room: 0, gave: 0}, user[0].vk_id], function(err, res){
                                                            if(err) throw err;
                                                        });
                                                    }
                                                });
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });

                }
            }
        });
    });
    socket.on('replSubmit', function(data){
        var obj = {
            PaySystem: parseInt(data.paySys),
            SUM: parseFloat(data.sum),
            REQ: data.req 
        }

        if(obj){
            connection.query('SELECT * FROM users WHERE socket_id = ?', socket.id, function(err,res){
                if(err) throw err;
                else{
                    if(res.length > 0){
                    	connection.query('SELECT * FROM repls', function(err,count){
                			
                    		if(err) throw err;
                    		else{
                    			var count  = count.length;
                    		    var SIGN_1 = md5(config.freekassa.m_id + ':' + obj.SUM + ':' + config.freekassa.s_word + ':' + count);
		                        var SIGN_2 = md5(config.freekassa.m_id + ':' + obj.SUM + ':' + config.freekassa.s_word_2 + ':' + count);

		                        console.log(config.freekassa.m_id + ':' + obj.SUM + ':' + config.freekassa.s_word + ':' + count);
		                        console.log(SIGN_1);

		                        var data_obj = {
		                            VK_ID: res[0].vk_id,
		                            HASH_ID: count,
		                            SUM: obj.SUM,
		                            REQ: obj.REQ,
		                            PAY_SYS: obj.PaySystem,
		                            SIGN: SIGN_1,
		                            SIGN_2: SIGN_2,
		                            DATE: currentDate
		                        }

		                        var url = 'http://www.free-kassa.ru/merchant/cash.php?m=' + config.freekassa.m_id + "&oa=" + obj.SUM + '&o=' + count + "&s=" + SIGN_1 + "&i=" + obj.PaySystem + "&phone=" + obj.REQ;    
		                        if(data_obj){

		                            connection.query('INSERT INTO repls SET ?',data_obj, function(err,fields){
		                                if(err) throw err;
		                                else{	
                                   			 socket.emit('redirect', url);
		                                }
		                            });
		                        }   
                    		}
                    	});
                    }
                }
            });
        }

    });
    socket.on('outPutBalance', function(e){
        connection.query('SELECT * FROM users WHERE socket_id = ?', socket.id, function(err,res){
            if(err) throw err;
            else{
                if(res.length > 0){
                    var USER = res[0];
                    var error = null;

                    if(USER.user_balance == 0){
                        error =  'На Балансе не достаточно средств';
                    }else if(USER.user_balance >= 10 && USER.user_balance <= 49){
                        error =  'Для Вывода на Балансе должно быть более 50 руб.';
                    }else if(USER.current_room != 0){
                        error = 'Завершите текущую комнату чтобы вывести средства.';
                    }

                    if(error != null){
                        socket.emit('outPutError', error);
                    }else{
                        var date = new Date();
                        var request_object = {
                            USER_ID: USER.id,
                            USER_VK: USER.vk_id,
                            USER_NAME: USER.first_name,
                            SUM: USER.user_balance,
                            PAY_SYSTEM: e[0],
                            NUMBER: e[1],
                            DATE: currentDate,
                            DATE_TIME: date.toLocaleTimeString()
                        }

                        if(request_object){
                            connection.query('UPDATE users SET ? WHERE vk_id = ?', [{user_balance: 0}, request_object.USER_VK], function(err,res){
                                if(err) throw err;
                                else{
                                    getBalance(socket.id);
                                    connection.query('INSERT INTO withdraws SET ?', request_object, function(err,res){
                                        if(err) throw err;
                                        else{
                                            socket.emit('moneyOutputSucces', 1);
                                        }
                                    });

                                }
                            });
                        }
                    }
                }
            }
        });
    });

    socket.on('getBalance', function(e){
        if(socket.id.length > 0){
            getBalance(socket.id);
        }
    });

    socket.on('updateRoomInfo', function(data){
      // console.log(data);
      var id = 0;
      roomTimer =  setInterval(function(){

        // console.log(data);

        console.log(id);
        id++;

            getRoomInfo(data.id, data.own)

        socket.on('offTimer', function(){
            console.log(1);
            clearInterval(roomTimer);

            connection.query('SELECT * FROM users WHERE socket_id = ?', socket.id, function(err,user){
                if(err) throw err;
                else{
                    if(user.length > 0){
                        if(user[0].gave == 0 && user[0].current_room != 0){
                            connection.query('SELECT * FROM rooms WHERE ID = ?',parseInt(user[0].current_room), function(err,res){
                                
                                if(err) throw err;
                                else{
                                    if(res.length > 0){
                                        console.log(true);
                                        res = res[0];
                                        if(res.STATUS != 1){
                                            connection.query('UPDATE rooms SET ? WHERE ID = ?',[{USERS_COUNT: res.USERS_COUNT - 1}, res.ID], function(err,res){
                                                if(err) throw err;
                                                else{
                                                    connection.query('UPDATE users SET ? WHERE vk_id = ?', [{current_room: 0, gave: 0}, user[0].vk_id], function(err, res){
                                                        if(err) throw err;
                                                    });
                                                }
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
        });
        },1200);

    });

// io.to(socketsID[s]).emit('getRoomInfo', html);
    socket.on('GetLvlInfo', function(e){
        connection.query('SELECT * FROM levels WHERE LEVEL = ?', parseInt(e), function(err,res){
            if(err) throw err;
            else{
                if(res){
                    socket.emit('LevelInfo',res);
                }
            }
        });
    });

    socket.on('searchRoom', function(userID){
        console.log('Search');
        if(userID != null){
            console.log(userID);
            connection.query('SELECT * FROM users WHERE vk_id = ?', parseInt(userID), function(err,user){
                if(err) throw err;
                else{
                    if(user.length > 0){

                        if(user[0].current_room == 0 || user[0].gave == 0){ // none

                            if((user[0].current_lvl % 2) == 0){ // Без остатка(2,4,6,8...)
                                // Создаем комнату

                                connection.query('SELECT * FROM levels WHERE LEVEL = ?', user[0].current_lvl, function(err,res){
                                    if(err) throw err;
                                    else{
                                        if(res.length > 0){
                                            var LEVEL = res[0];


                                            console.log(true);
                                            connection.query('SELECT * FROM rooms WHERE OWNER_ID = ?', userID, function(err,res){
                                                if(err) throw err;
                                                else{
                                                    if(res.length > 0){
                                                        // Ошибка у вас уже есть комната

                                                        socket.emit('enterHasOwner',{room: res[0]});
                                                    }else{
                                                        if(LEVEL){
                                                            connection.query('INSERT INTO rooms SET ?',{
                                                                ROOM_LEVEL: user[0].current_lvl - 1,
                                                                SUM: LEVEL.SUM,
                                                                OWNER_ID: user[0].vk_id,
                                                                BALANCE: 0,
                                                                USERS_COUNT: 0,
                                                                STATUS: 0
                                                            }, function(err,res,fields){
                                                                if(err) throw err;
                                                                else{
                                                                    // getRoomInfo(user[0].vk_id);
                                                                    
                                                                    connection.query('SELECT * FROM rooms WHERE OWNER_ID = ?', userID, function(err,res){
                                                                        if(err) throw err;
                                                                        else{
                                                                            if(res.length > 0){
                                                                                var data = res[0];
                                                                                if(data.STATUS == 0){


                                                                                    socket.emit('enterHasOwner',{room: data});

                                                                                    connection.query('UPDATE users SET ? WHERE vk_id = ?',[
                                                                                    {
                                                                                        own_room: data.ID
                                                                                    },
                                                                                        parseInt(userID)
                                                                                    ], function(err,res){
                                                                                        if(err) throw err;
                                                                                        else{
                                                                                             // socket.emit('enterHasOwner',{room: data});
                                                                                        }
                                                                                    });
                                                                                }
                                                                            }
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        }
                                                    }
                                                }
                                            });

                                        }
                                    }
                                });
                            }else{
                                connection.query('SELECT * FROM rooms WHERE USERS_COUNT < 3', function(err,res){
                                    if(err) throw err;
                                    else{
                                        if(res.length > 0){
                                            for(var i = 0; i <= res.length - 1; i++){
                                                if(res[i].ROOM_LEVEL == user[0].current_lvl){
                                                    console.log(user[0].user_balance + ' | ' + res[i].SUM);
                                                    if(user[0].user_balance >= (res[i].SUM / 3)){                                               
                                                        var room = res[i];
                                                        connection.query('UPDATE rooms SET ? WHERE ?',[{USERS_COUNT: res[i].USERS_COUNT + 1},{ID: res[i].ID}],function(err,res){
                                                            if(err) throw err;
                                                            else{
                                                                connection.query('UPDATE users SET ? WHERE vk_id = ?',[{current_room: room.ID}, userID], function(err,res){
                                                                    if(err) throw err;
                                                                    else{
                                                                        socket.emit('enterRoom',{room: room, user: user[0], socketID: socket.id}); // CALLBACK
                                                                    }
                                                                });
                                                            }
                                                        });

                                                    }else{
                                                        socket.emit('searchBalanceError',1);
                                                    }
                                                    break;
                                                }
                                            }
                                        }else{

                                            return false;
                                        }
                                    }
                                });
                            }
                        }else if(user[0].gave == 1 && user[0].current_room > 0){
                            connection.query('SELECT * FROM rooms WHERE ID = ?', parseInt(user[0].current_room), function(err,res){
                                if(err) throw err;
                                else{
                                    if(res.length > 0){
                                        var room = res[0];
                                        socket.emit('enterRoom',{room: room, user: user[0], socketID: socket.id}); // CALLBACK
                                    }
                                }
                            });   
                        }
                        else{
                           socket.emit('searchError',1);
                        }
                    }
                }
            });
        }
    });


    socket.on('throwMoney', function(e){
        var ID  = socket.id;

        console.log(ID);
        if(ID){
            connection.query('SELECT * FROM users WHERE socket_id = ?', ID, function(err,res){
                if(err) throw err;
                else{
                    if(res.length > 0){
                        var USER = res[0];

                        if(USER){
                            if(USER.gave != 1){                               
                                connection.query('SELECT * FROM rooms WHERE ID = ?', parseInt(USER.current_room), function(err,res){
                                    if(err) throw err;
                                    else{
                                        if(res.length > 0){
                                            var ROOM = res[0];

                                            if(ROOM.STATUS == 0){
                                                if(ROOM.BALANCE != (ROOM.SUM)){

                                                    console.log(ROOM.SUM + ' - ' + USER.user_balance);
                                                    if( parseInt(USER.user_balance) >= parseInt( (ROOM.SUM / 3) ) ){

                                                        connection.query('UPDATE rooms SET ? WHERE ID = ?',[{BALANCE: ROOM.BALANCE + (ROOM.SUM / 3) }, parseInt(ROOM.ID)], function(err,res){
                                                            if(err) throw err;
                                                            else{
                                                                connection.query('UPDATE users SET ? WHERE vk_id = ?', [{user_balance: USER.user_balance - (ROOM.SUM / 3), gave: 1}, parseInt(USER.vk_id)], function(err,res){
                                                                    if(err) throw err;
                                                                    else{
                                                                        if(res){
                                                                            
                                                                            getBalance(socket.id);
                                                                            connection.query('SELECT * FROM rooms WHERE ID = ?', parseInt(ROOM.ID), function(err,res){
                                                                                if(err) throw err;
                                                                                else{
                                                                                    if( res[0].BALANCE >= (res[0].SUM)){
                                                                                        gameOver(res[0].ID); // Завершаем сессию комнаты
                                                                                    }
                                                                                }
                                                                            });
                                                                            
                                                                        }
                                                                    }
                                                                });
                                                            }
                                                        });

                                                    }else{
                                                        
                                                        console.log('Недостаточно средств на счету')
                                                    }
                                                }else{
                                                    console.log('Данная комната набрала нужную сумму');
                                                }
                                            }else{
                                                console.log('Сессия комнаты завершенна');
                                            }
                                        }
                                    }
                                });
                            }else{
                                console.log('Вы уже скинули нужную сумму');
                            }
                        }
                    }
                }
            });
        }
    });
	socket.on('getReplHistory', function(e){
		connection.query('SELECT * FROM users WHERE socket_id = ?', socket.id, function(err,res){
			if(err) throw err;
			else{
				if(res.length > 0){
					console.log(res);
					var user = res[0];

					if(user){
						connection.query('SELECT * FROM repls WHERE VK_ID = ? AND STATUS = 1 ORDER BY ID DESC LIMIT 25',user.vk_id, function(err,res){
							if(err) throw err;
							else{
								if(res.length > 0){
									var html = '';

									for(var i = 0; i <= res.length - 1; i++){
										html = html + `
										<tr>
											<td>`+ res[i].ID +`</td>	
											<td>`+ res[i].DATE +`</td>	
											<td> <img src='/images/paySystem/`+ res[i].PAY_SYS +`.png' height="20">` + res[i].REQ +`</td>	
											<td>`+ res[i].SUM +`</td>	
										</tr>
										`;


										if (i == (res.length - 1)) {
											socket.emit('getReplHistory', html);
										}
									}
								}else{
									// Пополнения отсутствуют
									socket.emit('getReplHistory', '<p style="color: #FEFEFE; margin-top: 20px;">Пополнения отсутствуют</p>');
								}
							}
						});
					}
				}
			}
		});
	});
    socket.on('getOutputHistory', function(e){
        connection.query('SELECT * FROM users WHERE socket_id = ?', socket.id, function(err,res){
            if(err){
                throw err;
            }else{
                console.log(res);
                if(res.length > 0){
                    var user = res[0];

                    if(user){
                        connection.query('SELECT * FROM withdraws WHERE USER_VK = ? ORDER BY ID DESC LIMIT 10', user.vk_id, function(err,res){
                            if(err) throw err;
                            else{
                                if(res.length > 0){
                                    var output = res;
                                    var html = '';
                                    for(var i = 0; i <= output.length - 1; i++){

                                        if(output[i].STATUS == 'WAIT'){
                                            html = html + `
                                            <tr>
                                                <td>`+ output[i].ID +`</td>
                                                <td>`+ output[i].DATE + ' ' + output[i].DATE_TIME +`</td>
                                                <td title="`+ output[i].PAY_SYSTEM +`"> <img src='/images/paySystem/`+ output[i].PAY_SYSTEM +`.png' height="20">` + output[i].NUMBER +`</td>
                                                <td>`+ output[i].SUM +`</td>
                                                <td >
                                                    <div id="wait">ОЖИДАНИЕ</div>
                                                </td>
                                            </tr>
                                            `;
                                        }else{
                                           html = html + `
                                            <tr>
                                                <td>`+ output[i].ID +`</td>
                                                <td>`+ output[i].DATE + ' ' + output[i].DATE_TIME +`</td>
                                                <td title="`+ output[i].PAY_SYSTEM +`"> <img src='/images/paySystem/`+ output[i].PAY_SYSTEM +`.png' height="20">` + output[i].NUMBER +`</td>
                                                <td>`+ output[i].SUM +`</td>
                                                <td >
                                                    <div id="done">ВЫПЛАЧЕНО</div>
                                                </td>
                                            </tr>
                                            `; 
                                        }

                                        if(output.length - 1 == i ){
                                            socket.emit('getOutPutHistory', html);
                                        }
                                    }
                                }else{
                                    socket.emit('getOutPutHistory', '<p style="color: #FEFEFE; margin-top: 20px;">Выплаты отсутствуют</p>');
                                }
                            }
                        });
                    }
                }
            }
        });
    });


    function getRoomInfo(id,owner){

        var result;

        console.log(id);

        connection.query('SELECT * FROM rooms WHERE ID = ?', id, function(err,res){
            if(err) throw err;
            else{
                if(res.length > 0){
                    var room = res[0];


                    var RoomTypeHTML = '',
                        UsersHTML    = '',
                        OwnerHTML    = '',
                        RoomInfo     = '',
                        html         = '';

                    if(room.ROOM_LEVEL >= 7){
                       RoomTypeHTML = '<li>Тип комнаты: <small style=" color: #37CE47">PRO</small></li>';
                    }else{
                       RoomTypeHTML = '<li>Тип комнаты: <small>SMALL</small></li>';
                    }


                    if(owner == true){

                        RoomInfo = `
                        <div class="col-md-4 col-sm-12 room-score">
                            <div class="row justify-content-md-center justify-content-sm-center justify-content-xs-center">
                                <div class="score-block col-md-11 col-sm-11 ">
                                    <h3 id="lvl" class="col-md-12 col-sm-12">LEVEL `+ room.ROOM_LEVEL +`</h3>
                                    <div class="room-info col-md-12 col-sm-12">
                                        <ul>
                                            <li>ID Комнаты: <small>`+ room.ID +`</small></li>
                                            `+RoomTypeHTML+`
                                            <li>Кол-во участников: <small style="color: #E8AC03">`+ room.USERS_COUNT +`/3</small></li>
                                            <li>Ставка: <small style="color: #F24B18">`+ room.SUM +` рублей.</small></li>
                                            <li>Собрано: <small style="color: #E8AC03">`+ room.BALANCE + '/' + (room.SUM) + `</small></li>
                                            <li>Статус: <small style="color: #FF0031">Не завершенно</small></li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                    }else{
                        RoomInfo = `
                        <div class="col-md-4 col-sm-12 room-score">
                            <div class="row justify-content-md-center justify-content-sm-center justify-content-xs-center">
                                <div class="score-block col-md-11 col-sm-11 ">
                                    <h3 id="lvl" class="col-md-12 col-sm-12">LEVEL `+ room.ROOM_LEVEL +`</h3>
                                    <div class="room-info col-md-12 col-sm-12">
                                        <ul>
                                            <li>ID Комнаты: <small>`+ room.ID +`</small></li>
                                            `+RoomTypeHTML+`
                                            <li>Кол-во участников: <small style="color: #E8AC03">`+ room.USERS_COUNT +`/3</small></li>
                                            <li>Ставка: <small style="color: #F24B18">`+ room.SUM +` рублей.</small></li>
                                            <li>Собрано: <small style="color: #E8AC03">`+ room.BALANCE + '/' + (room.SUM) + `</small></li>
                                            <li>Статус: <small style="color: #FF0031">Не завершенно</small></li>
                                        </ul>
                                    </div>
                                    <div id="throw_button" class="col-md-12 col-sm-12">
                                        <button id="throw">Отдать</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        `;
                    }


                    if(RoomInfo){
                        connection.query('SELECT * FROM users WHERE vk_id = ?', room.OWNER_ID, function(err,res){
                            if (err) throw err;
                            else{
                                if(res.length > 0){
                                    var OWNER = res[0];

                                    OwnerHTML = `
                                        <div class="user-avatar">
                                            <img src="`+ OWNER.photo_big +`" height="100" alt="user.png"></img>
                                        </div>
                                        <h6 class="user-name">`+ OWNER.first_name +`</h6>
                                    `;


                                    if(OwnerHTML){
                                        connection.query('SELECT * FROM users WHERE current_room = ?', id, function(err,res){
                                            if(err) throw err;
                                            else{

                                                if(res.length >= 0){




                                                    var _SOCKETS = [];
                                                    var _GAVES   = 0;

                                                    for(var i = 0; i <= res.length - 1; i++){
                                                        var USER = res[i];

                                                                  
                                                        _SOCKETS.push(USER.socket_id);

                                                        if(USER.gave == 1){
                                                            UsersHTML = UsersHTML + `
                                                                <div class="user col-md-3 col-sm-3 col-xs-3">
                                                                    <div class="user-avatar payed">
                                                                            <img src="`+ USER.photo_big +`" height="80" alt="user.png"></img>
                                                                    </div>
                                                                    <h6 class="user-name ">`+ USER.first_name +`</h6>
                                                                </div>`;

                                                            _GAVES++;

                                                        }else{
                                                             UsersHTML = UsersHTML + `
                                                                <div class="user col-md-3 col-sm-3 col-xs-3">
                                                                    <div class="user-avatar">
                                                                            <img src="`+ USER.photo_big +`" height="80" alt="user.png"></img>
                                                                    </div>
                                                                    <h6 class="user-name ">`+ USER.first_name +`</h6>
                                                                </div>`;                                           
                                                        }
                                                    


                                                    }
                                                    if(room.USERS_COUNT == 1){
                                                        UsersHTML = UsersHTML + `
                                                            <div class="user col-md-3 col-sm-3 col-xs-3">
                                                                <div class="user-avatar"></div>
                                                                <h6 class="user-name ">Свободно</h6>
                                                            </div>

                                                            <div class="user col-md-3 col-sm-3 col-xs-3">
                                                                <div class="user-avatar"></div>
                                                                <h6 class="user-name ">Свободно</h6>
                                                            </div>`;


                                                    }else if(room.USERS_COUNT == 2){
                                                          UsersHTML = UsersHTML + `
                                                            <div class="user col-md-3 col-sm-3 col-xs-3">
                                                                <div class="user-avatar"></div>
                                                                <h6 class="user-name ">Свободно</h6>
                                                            </div>`;                                                      
                                                    }else if(room.USERS_COUNT == 0){
                                                        UsersHTML = UsersHTML + `
                                                            <div class="user col-md-3 col-sm-3 col-xs-3">
                                                                <div class="user-avatar"></div>
                                                                <h6 class="user-name ">Свободно</h6>
                                                            </div>

                                                            <div class="user col-md-3 col-sm-3 col-xs-3">
                                                                <div class="user-avatar"></div>
                                                                <h6 class="user-name ">Свободно</h6>
                                                            </div>

                                                            <div class="user col-md-3 col-sm-3 col-xs-3">
                                                                <div class="user-avatar"></div>
                                                                <h6 class="user-name ">Свободно</h6>
                                                            </div>`;    
                                                    }




                                                         html = `
                                                            <div class="row justify-content-md-center justify-content-sm-center">                                                                                                              
                                                                <div class="game-bar col-md-8 col-sm-12">
                                                                <!-- Визульная игровая зона -->
                                                                <div class="row justify-content-md-center justify-content-sm-center">
                                                                    <div class="description col-md-11 col-sm-11 col-11">
                                                                        <h4>Подсказка</h4>
                                                                        <p>Чтобы скинуть N - сумму, нажмите кнопку <b style="color: #37CE47;">Отдать</b></p>
                                                                    </div>
                                                                    <div id="hr" class="col-md-12 col-sm-12"></div>
                                                                    <div class="session-owner col-md-5 col-sm-5">
                                                                        `+ OwnerHTML +`
                                                                    </div>
                                                                    <div class="regular-users col-md-12 col-sm-12 col-xs-12">

                                                                        <div class="row justify-content-md-center justify-content-sm-center">
                                                                         `+ UsersHTML +`   
                                                                        </div>                                      
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            `+ RoomInfo +`
                                                          </div> `;

                                                        // console.log(html);
                                                        socket.emit('getRoomInfo',html);

                                                }
                                            }

                                        });
                                    }

                                }
                            }
                        });
                    }
                }
            }
        });
    }


    function gameOver(roomID){
        connection.query('SELECT * FROM rooms WHERE ID = ?', parseInt(roomID), function(err,roomRes){
            if(err) throw err;
            else{
                if(roomRes.length > 0){
                    var ROOM = roomRes[0];

                    if(ROOM.STATUS == 0 && ROOM.USERS_COUNT == 3 && ROOM.BALANCE >= (ROOM.SUM)){
                        connection.query('DELETE FROM rooms WHERE ID = ?',ROOM.ID, function(err,result){
                            if(err) throw err;
                            else{


                                connection.query('INSERT INTO gameHistory SET ?',{
                                    GAME_ID: ROOM.ID,
                                    OWNER_ID: ROOM.OWNER_ID,
                                    BALANCE: ROOM.BALANCE,
                                    LEVEL: ROOM.ROOM_LEVEL,
                                    DATE: currentDate
                                }, function(err,done){
                                    if(err) throw err;
                                    else{
                                        if(done){

                                            connection.query('SELECT * FROM users WHERE vk_id = ?', ROOM.OWNER_ID, function(err,owner){
                                                if(err) throw err;
                                                else{
                                                    var OWNER = owner[0]; // создатель комнаты

                                                    var level = 1;

                                                    if(OWNER.current_lvl == 4){
                                                        level = 1;
                                                    }else{
                                                        level = OWNER.current_lvl + 1;
                                                    }


                                                    

                                                    var obj = {
                                                        own_room: 0,
                                                        user_balance: OWNER.user_balance + ( (ROOM.SUM) / 100 * 90),
                                                        current_lvl: level
                                                    }
                                                    


                                                    if(OWNER){
                                                        connection.query('INSERT INTO buyResetLevel SET ?', {
                                                            USER_ID: OWNER.id,
                                                            USER_VK: OWNER.vk_id,
                                                            SUM: (ROOM.SUM / 100) * 10,
                                                            DATE: currentDate

                                                        }, function(err,res){
                                                            if(err) throw err;
                                                        });


                                                        connection.query('UPDATE users SET ? WHERE vk_id = ?',[obj, OWNER.vk_id],function(err){
                                                            if(err) throw err;
                                                            else{
                                                                // console.log(obj);
                                                                io.to(OWNER.socket_id).emit('gameOver', 1); // Завершаем сессию Создателя комнаты
                                                                getBalance(socket.id);

                                                                connection.query('SELECT * FROM users WHERE current_room = ?', ROOM.ID, function(err,users){
                                                                    if(err) throw err;
                                                                    else{
                                                                        var _SOCKETS = [];
                                                                        for(var i = 0; i <= users.length - 1; i++){

                                                                            var USER = users[i];

                                                                            if( users[i].socket_id != 0){
                                                                                io.to(users[i].socket_id).emit('gameOver', 1);
                                                                            }

                                                                        
                                                                            if(USER){
                                                                                connection.query('UPDATE users SET ? WHERE vk_id = ?',[{current_room: 0,current_lvl: USER.current_lvl + 1,gave: 0}, USER.vk_id], function(err,res){
                                                                                    if(err) throw err;
                                                                                });
                                                                                connection.query('INSERT INTO userGameHistory SET ?',{ USER_ID: USER.id, USER_VK: USER.vk_id, GAME_ID: ROOM.ID }, function(err,res){
                                                                                    if(err) throw err;
                                                                                });
                                                                            }


                                                                            if( (users.length - 1) == i){
                                                                                getLastGames(true);
                                                                            }
                                                                        }
                                                                    }
                                                                });
                                                            }

                                                        });
                                                    }
                                                }
                                            });

                                        }
                                    }
                                });


                            }
                        });
                    }
                }
            }
        });
    }


    function getLastGames(all){

        connection.query('SELECT * FROM gameHistory ORDER BY ID DESC LIMIT 25', function(err,games){
            if(err) throw err;
            else{
                if(games.length > 0){
                    var GAMES = games;
                    var iteration = 0;
                    var GAME_LIST = `
                        <tr>
                            <th>Комната</th>
                            <th>Имя</th>
                            <th>Сумма</th>
                            <th>Тип</th>
                            <th>LVL</th>
                        </tr>`;  // null


                    for(var i = 0; i <= GAMES.length - 1; i++){
                        connection.query('SELECT * FROM users WHERE vk_id = ?', parseInt(GAMES[i].OWNER_ID), function(err,user){
                            if(err) throw err;
                            else{
                                if (user.length > 0) {
                                    var OWNER_NAME = user[0].first_name;
                                    var obj = {
                                        ROOM_ID: GAMES[iteration].GAME_ID,
                                        OWNER_NAME: OWNER_NAME,
                                        SUM: GAMES[iteration].BALANCE,
                                        TYPE: 'SMALL',
                                        LEVEL: GAMES[iteration].LEVEL
                                    }

                                    if(GAMES[iteration].LEVEL >= 7){
                                        obj.TYPE = 'PRO';
                                    }

                                    GAME_LIST = GAME_LIST + `

                                    <tr>
                                        <td>`+ obj.ROOM_ID +`</td>
                                        <td>`+ obj.OWNER_NAME +`</td>
                                        <td>`+ obj.SUM +`</td>
                                        <td>`+ obj.TYPE +`</td>
                                        <td>`+ obj.LEVEL +`</td>
                                    </tr>
                                    `;

                                    iteration++;

                                    if((GAMES.length - 1) == iteration){

                                        if(all){

                                            socket.broadcast.emit('lastGameAction', GAME_LIST); // Отпровляем всем кроме текущего пользователя
                                        }else{
                                            socket.emit('lastGameAction', GAME_LIST); // Отпровляем текущему пользователю
                                        }
                                    }



                                }
                            }
                        });
                    } 

                }
            }
        });
    }

    function getBalance(id){
        if(id.length > 1){ // если socket_id существует (2я проверка)
            connection.query('SELECT * FROM users WHERE socket_id = ?', id, function(err,res){
                if(err) throw err;
                else{
                    if(res.length > 0){
                        socket.emit('GetBalance', res[0].user_balance);
                    }
                }
            });
        }
    }
});



// ================== АДМИНКА ==================

bot.onText(/\/start (.+)/, (msg, match) =>{

});
bot.on('message', (msg) => {

    var isAdmin = checkIsAdmin(msg.from.id);

    if(isAdmin){
        if(msg.text == '/start'){
            __GetMainMenu(msg.from);
        }
    }
});

bot.on('callback_query', function(msg){

    var isAdmin = checkIsAdmin(msg.from.id);
    var userID = msg.from.id;

    var QUERY   = msg.data;
        QUERY   = QUERY.split('-');

    if(isAdmin){

        // Events..

        if(QUERY[0] == 'STATISTICS'){
            // Выводим Статистику



               var object = {
                    DailyProfit:        0, // Дневной Заработок
                    UserRegToday:       0, // Зарегистрированно Сегодня
                    CurrentUsersOnline: currentUsersCount, // Кол-во пользователей Онлайн
                    TotalEarnings:      0, // Общий Заработок
                    UsersCount:         0, // Кол-во пользователей
                    TotalClosedRooms:   0, // Кол-во завершенных комнат
                    TotalOpenedRooms:   0  // Кол-во открытых комнат

               }

              


               if(object){
                    connection.query('SELECT * FROM buyResetLevel', function(err,res){
                        if(err) throw err;
                        else{
                            if(res.length > 0){
                                
                                for(var i = 0; i <= res.length - 1; i++){
                                    object.TotalEarnings = object.TotalEarnings + res[i].SUM;


                                    if(res[i].DATE == currentDate){
                                        object.DailyProfit = object.DailyProfit + res[i].SUM;
                                    }


                                    if((res.length - 1) == i ){
                                        connection.query('SELECT * FROM users WHERE reg_date = ?', String(currentDate), function(err,res){
                                            if(err) throw err;
                                            else{
                                                object.UserRegToday = res.length;

                                                connection.query('SELECT * FROM users', function(err,res){
                                                    if(err) throw err;
                                                    else{
                    
                                                            object.UsersCount = res.length

                                                            connection.query('SELECT * FROM rooms', function(err,res){
                                                                if(err) throw err;
                                                                else{
                                                                    object.TotalOpenedRooms = res.length;

                                                                    connection.query('SELECT * FROM gameHistory', function(err,res){

                                                                        if(err) throw err;
                                                                        else{
                                                                            object.TotalClosedRooms = res.length;

          // Дневной заработок
          // Зарегистрированно сегодня
          // Текущий Онлайн
          // Общий заработок
          // Кол-во пользователей
          // Общее кол-во завершенных комнат
          // Общее кол-во открытых комнат


                                                                              var message = `
        ➖➖➖ <b>СТАТИСТИКА</b> ➖➖➖

        <b>🔸Дневной Заработок:</b> <i> `+ object.DailyProfit +`  руб.</i> 
        <b>🔹Общий Заработок:</b> <i> `+ object.TotalEarnings +`  руб.</i>
        <b>🔰Текущий Онлайн:</b> <i> `+ object.CurrentUsersOnline +` </i>
        <b>✳️Зарегистрированных Сегодня:</b> <i> `+ object.UserRegToday +` </i>
        <b>👨🏼‍💻Кол-во пользователей:</b> <i> `+ object.UsersCount +` </i>
        <b>❌Общее кол-во завершенных комнат:</b> <i> `+ object.TotalClosedRooms +` </i>
        <b>✅Общее кол-во открытых комнат:</b> <i> `+ object.TotalOpenedRooms +` </i>
                                                                              `;


                                                                              if(msg){

                                                                                  
                                                                                  bot.deleteMessage(userID, msg.message.message_id);
                                                                                  bot.sendMessage(userID, message, {parse_mode: 'html', reply_markup:{
                                                                                    'inline_keyboard': [
                                                                                        [{text: '📝Назад в Меню', callback_data: 'BACK_TO_MENU'}]
                                                                                    ]
                                                                                   }});
                                                                              }


                                                                        }
                                                                    });
                                                                }
                                                            })
                                                        
                                                    }
                                                }); 
                                            }

                                        })
                                    }

                                }

                            }else{

                                bot.sendMessage(userID, '<b>Статистика Отсутствует</b>', {parse_mode: 'html', reply_markup:{
                                'inline_keyboard': [
                                    [{text: '📝Назад в Меню', callback_data: 'BACK_TO_MENU'}]
                                ]
                               }});
                            }
                        }



                    });
               }




              

        }else if(QUERY[0] == 'MONEY_OUTPUT'){
            // Выводим список Выплат

            connection.query('SELECT * FROM withdraws WHERE STATUS = ? LIMIT 3','WAIT', function(err,res){
                // console.log(res);
                if(err) throw err;
                else{
                    if(res.length > 0){
                        var outputs = res;
                        var id = 0;

                        for(var i = 0; i <= res.length - 1; i++){
                            if(outputs){   
                                connection.query('SELECT * FROM gameHistory WHERE OWNER_ID = ?', res[i].USER_VK, function(err,result){                         
                                    if(err) throw err;
                                    else{
                                        var TOTAL_AMOUT = 0;
                                        var TOTAL_GAMES = result.length || 0;

                                        if(result.length > 0){
                                            for(var amout = 0; amout <= result.length - 1; amout++){
                                                TOTAL_AMOUT = TOTAL_AMOUT + result[amout].BALANCE;
                                            }

                                            if(outputs){

                                                var output_message = `
<b>🔸ID Выплаты: </b>`+ outputs[id].ID +`
<b>🙎‍♂️Имя: </b>`+ outputs[id].USER_NAME +`
<b>💰Сумма Выплаты: </b>`+ outputs[id].SUM +`
<b>💳Система: </b>`+ outputs[id].PAY_SYSTEM +`
<b>📝Реквизиты: </b>`+ outputs[id].NUMBER +`

<b>💵Общая сумма Заработка: </b>`+ TOTAL_AMOUT +` руб.
<b>🔘Кол-во Созданных Игр: </b>`+ TOTAL_GAMES +`
<b>🔺Кол-во Игр с последнего пополнения: </b>`+ 0 +`

<b>🕒Дата Выплаты: </b>`+ outputs[id].DATE + ' ' + outputs[id].DATE_TIME +`
                                                `;

                                                // bot.deleteMessage(userID, msg.message.message_id);
                                                bot.sendMessage(userID, output_message, {parse_mode: 'html', reply_markup:{
                                                    'inline_keyboard': [
                                                        [{text: '✅Подтвердить Выплату', callback_data: 'CONFIRM_OUTPUT-' + outputs[id].ID}],
                                                        [{text: '🔰Профиль Вконтакте', url: 'http://vk.com/id'+outputs[id].USER_VK}],
                                                        [{text: '📝Назад в Меню', callback_data: 'BACK_TO_MENU'}]
                                                    ]
                                                }});

                                                id++;
                                            }


                                        }
                                    }
                                });
                            }
                        }
                    }else{
                        bot.deleteMessage(userID, msg.message.message_id);
                        bot.sendMessage(userID, '<b>❌Выплаты Отсутствуют</b>', {parse_mode: 'html', reply_markup:{
                            'inline_keyboard': [
                                [{text: '📝Назад в Меню', callback_data: 'BACK_TO_MENU'}]
                            ]
                        }});
                    }
                }
            });



            // bot.deleteMessage(userID, msg.message.message_id);
            // bot.sendMessage(userID, '<b>Выплаты</b>', {parse_mode: 'html', reply_markup:{
            //     'inline_keyboard': [
            //         [{text: '📝Назад в Меню', callback_data: 'BACK_TO_MENU'}]
            //     ]
            // }});

        }else if(QUERY[0] == 'CONFIRM_OUTPUT'){
            // Подтвердить Выплату
            var outputID = parseInt(QUERY[1]);

                connection.query('SELECT * FROM withdraws WHERE ID = ?', outputID, function(err,res){
                    if(err) throw err;
                    else{
                        if(res.length > 0){
                            var output = res[0];

                            if(output){
                                connection.query('UPDATE withdraws SET ? WHERE ID = ?',[{STATUS: 'DONE'}, output.ID], function(err,res){
                                    if(err) throw err;
                                    else{
                                        bot.editMessageText('✅<b>Вывод успешно совершен</b>',
                                        {
                                          chat_id: msg.message.chat.id, message_id: msg.message.message_id, parse_mode: "html"
                                        });
                                    }
                                });
                            }
                        }else{
                            // Выплаты не существует
                            bot.sendMessage(userID, '<b>❌Выплаты не существует</b>', {parse_mode: 'html', reply_markup:{
                            'inline_keyboard': [
                                [{text: '📝Назад в Меню', callback_data: 'BACK_TO_MENU'}]
                            ]
                        }});
                        }
                    }
                });
        }
        else if(QUERY[0] == 'USERS'){
            // Выводим список пользователей
            bot.deleteMessage(userID, msg.message.message_id);
            bot.sendMessage(userID, '<b>Список пользователей</b>', {parse_mode: 'html', reply_markup:{
                'inline_keyboard': [
                    [{text: '📝Назад в Меню', callback_data: 'BACK_TO_MENU'}]
                ]
            }});

        }else if(QUERY[0] == 'SERVER_SETTINGS'){
            // Выводим настройки сервера
            bot.deleteMessage(userID, msg.message.message_id);
            bot.sendMessage(userID, '<b>Настройки Сервера</b>', {parse_mode: 'html', reply_markup:{
                'inline_keyboard': [
                    [{text: '📝Назад в Меню', callback_data: 'BACK_TO_MENU'}]
                ]
            }});

        }else if(QUERY[0] == 'BACK_TO_MENU'){
            bot.deleteMessage(userID, msg.message.message_id);
            // console.log(msg);
            __GetMainMenu(msg.from);
        }

    }
});


function checkIsAdmin(id){
    if((id == config.admins.admin_1) || (id == config.admins.admin_2)){
        return true;c
    }
}


function __GetMainMenu(from){
    var greeting = `
<b>✋Добро пожаловать:</b> @` + from.username +`

<b>📝Выберите то что хотите сделать:</b> 
    `;
    bot.sendMessage(from.id, greeting, {parse_mode: 'html', reply_markup:{
        'inline_keyboard':[
            [{text: '📊Статистика', callback_data: 'STATISTICS'}],
            [{text: '💳Выводы', callback_data: 'MONEY_OUTPUT'}],
            [{text: '👥Пользователи', callback_data: 'USERS'}],
            [{text: '⚙️Настройки', callback_data: 'SERVER_SETTINGS'}],
        ]
    }});    
}




// ======================================================


function handleConnection(){

  connection = mysql.createConnection(config.database); // Пересоздание соединения
                                                  // так как прошлое соединение использовать невозможно

  connection.connect(function(err) {              // Сервер либо не работает
    if(err) {                                     // либо перезагружается(может занять некоторое время)
      return console.log('Ошибка при подключении к базе данных, проверьте подключение',err);

      setTimeout(handleConnection, 2000); // Мы делаем небольшую задержку перед попыткой переподключения
                                          // чтобы избежать перемешанной петли и чтобы наш скрипт обрабатывал
    }                                     // Асинхронные запросы
    else{
        // return console.log('Подключение к базе данных установленно');
        // return connection; // Возврощаем подключение
    }
  
  });                                     

  connection.on('error', function(err) {
    // console.log('Ошибка базы данных, превышено время простоя');

    if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Cоединение с сервером MySQL обычно
      handleConnection();                         // теряется из-за перезапуска или из-за
    } else {                                      // тайм-аута простоя соединения
      throw err;                                  // (переменная сервера wait_timeout настраивает это).
    }
  });
}


function _Init(){
    handleConnection();
    connection.query('SELECT * FROM users', function(err,users){
        if(err) throw err;
        else{
            if(users.length > 0){
                for(var i = 0; i <= users.length - 1; i++){
                    connection.query('UPDATE users SET ? WHERE ?', [{socket_id: 'none', is_online: 'offline'}, users[i].vk_id], function(err,res){
                        if(err) throw err;
                    });

                    if(i == users.length - 1){
                    	console.log(`
TTTTTTTTTT TT   TT  TTTTTT      TTTT     TT      TT      TT
    TT     TT   TT  TT   TT   TT    TT    TT    TTTT    TT
    TT     TTTTTTT  TTTTT    TT      TT    TT  TT TT  TT
    TT     TT   TT  TT  TT    TT    TT      TTTT   TTTT
    TT     TT   TT  TT   TT     TTTT         TT     TT

		TTTT    TTTT  TTTTTT
		TT TT  TT TT  TT
		TT  TTTT  TT  TTTTTT
		TT   TT   TT  TT
		TT        TT  TTTTTT


	   T H R O W M E - 2 0 1 9


  DEV:           EDUARD SHUMKOV
  PRODUCT TYPE:  WEB-SITE
  PRODUCT NAME:  THROWME
  DOMAIN:        THROWME.RU
  IP ADRESS:     37.230.115.44
                    		`);
                        console.log('Инициализация Базы Данных прошла успешно');
                    }
                }
            }
        }
    });

    // connection.query('SELECT * FROM rooms', function(err,rooms){
    //     if(err) throw err;
    //     else{
    //        for(var i = 0; i <= rooms.length - 1; i++){
    //          if(rooms[i].STATUS == 0){
    //             connection.query('UPDATE rooms SET ? WHERE ID = ?', [{USERS_COUNT: 0}, rooms[i].ID], function(err,res){
    //                 if(err) throw err;
    //             });
    //          }
    //        } 
    //     }
    // });
}



app.get('/repl', function(req,resl){

  // ПОПОЛНЕНИЕ
  console.log(req.query);
  var MERCHANT_ID       = req.query.MERCHANT_ID,          // ID Вашего магазина
      AMOUNT            = req.query.AMOUNT,               // Сумма заказа
      intid             = req.query.intid,                // Номер операции Free-Kassa
      MERCHANT_ORDER_ID = req.query.MERCHANT_ORDER_ID,    // Ваш номер заказа
      P_EMAIL           = req.query.P_EMAIL,              // Email плательщика
      SIGN              = req.query.SIGN;                 // Подпись

      resl.send(req.query);
      connection.query('SELECT * FROM repls WHERE HASH_ID = ?', MERCHANT_ORDER_ID, function(err,results){
        var repl = results[0];
        if(err) throw err;
        else{
            if(results.length > 0){
                if(parseInt(MERCHANT_ORDER_ID) == repl.HASH_ID && MERCHANT_ID == config.freekassa.m_id && SIGN == repl.SIGN_2 && repl.STATUS == 0){
                    connection.query('SELECT * FROM users WHERE vk_id = ?',repl.VK_ID, function(err,user){
                        if(err) throw err;
                        else{
                            var user = user[0];

                                var CURRENT_BALANCE =  user.user_balance,
                                    USER_TOTAL_REPL =  user.user_replenishment,
                                    SUMM            =  parseFloat(AMOUNT);

                                var result = CURRENT_BALANCE + SUMM,
                                    UTR    = USER_TOTAL_REPL + SUMM

                                if(result){
                                    connection.query('UPDATE users SET ? WHERE vk_id = ?', [{user_balance: result,  user_replenishment: UTR}, user.vk_id], function(err,res){
                                        if(err) throw err;
                                        else{
                                            connection.query('UPDATE repls SET ? WHERE ID = ?', [{EMAIL: P_EMAIL, ORDER_ID: intid, STATUS: 1}, repl.ID], function(err,res){
                                                if(err) throw err;
                                                else{
                                                    console.log('Счет пополнен успешно');
                                                    connection.query('SELECT * FROM users WHERE id = ?', user.user_ref, function(err,res){
                                                        if(err) throw err;
                                                        else{
                                                            if(res.length > 0){
                                                                var BALANCE = res[0].user_balance,
                                                                    r = BALANCE + ((SUMM / 100) * 10);
                                                                    r = parseFloat(r).toFixed(2);

                                                                    if(r){
                                                                        connection.query('UPDATE users SET ? WHERE vk_id = ?', [{user_balance: r}, res[0].vk_id], function(err,res){
                                                                            if(err) throw err;
                                                                        });
                                                                    }
                                                            }
                                                        }
                                                    });
                                                }
                                            });
                                        }
                                    });
                                }
                        }
                    });
                }else{
                    // Попытка мошенничества
                    console.log('Пополнение уже совершенно');
                }
            }
        }
      });
});


/// Запускаем Сервер

server.listen(config.server.port, function() {
    console.log('Server has been started on port ' + config.server.port);
});
