// NODE


var express = require('express');
var app     = express();
var server  = require('http').Server(app);
var io      = require('socket.io')(server);


var mysql       = require('mysql');
var config      = require('../config.json');
var connection;


_Init();

io.on('connection', function(socket){
    console.log('User Connected, id: ' + socket.id);

    var roomTimer;


    socket.on('disconnect', function (e) {
        clearInterval(roomTimer);
        connection.query('SELECT * FROM users WHERE socket_id = ?', socket.id, function(err,user){
            if(err) throw err;
            else{
                if(user.length > 0){
                    connection.query('UPDATE users SET ? WHERE vk_id = ?', [{socket_id: 'none'}, user[0].vk_id], function(err,res){
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

                                                                                connection.query('UPDATE users SET ? WHERE vk_id = ?',[
                                                                                {
                                                                                    current_room: data.ID
                                                                                },
                                                                                    parseInt(userID)
                                                                                ], function(err,res){
                                                                                    if(err) throw err;
                                                                                    else{
                                                                                         socket.emit('enterHasOwner',{room: data});
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
                                                if(user[0].user_balance >= res[i].SUM){                                               
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
                                                if(ROOM.SUM != (ROOM.SUM * 3)){

                                                    console.log(ROOM.SUM + ' - ' + USER.user_balance);
                                                    if( parseInt(USER.user_balance) >= parseInt(ROOM.SUM) ){

                                                        connection.query('UPDATE rooms SET ? WHERE ID = ?',[{BALANCE: ROOM.BALANCE + ROOM.SUM}, parseInt(ROOM.ID)], function(err,res){
                                                            if(err) throw err;
                                                            else{
                                                                connection.query('UPDATE users SET ? WHERE vk_id = ?', [{user_balance: USER.user_balance - ROOM.SUM, gave: 1}, parseInt(USER.vk_id)], function(err,res){
                                                                    if(err) throw err;
                                                                    else{
                                                                        connection.query('SELECT * FROM rooms WHERE ID = ?', parseInt(ROOM.ID), function(err,res){
                                                                            if(err) throw err;
                                                                            else{
                                                                                if(ROOM.BALANCE == (ROOM.SUM * 3) || ROOM.BALANCE >= (ROOM.SUM * 3)  ){
                                                                                    

                                                                                    // Пификсить
                                                                                    for(var i = 0; i <= 10; i++){
                                                                                        console.log('ИГРА ЗАВЕРШЕННА!!!');
                                                                                    }



                                                                                    connection.query('DELETE FROM rooms  WHERE ?', ROOM.ID, function(err,res){
                                                                                        if(err) throw err;
                                                                                        else{
                                                                                            connection.query('SELECT * FROM users WHERE current_room = ?', parseInt(ROOM.ID), function(err,res){
                                                                                                if(err) throw err;
                                                                                                else{
                                                                                                    if(res.length > 0){
                                                                                                        for(var i = 0; i <= res.length - 1; i++){

                                                                                                            io.to(res[i].socket_id).emit('gameOver', 1);
                                                                                                            connection.query('UPDATE users SET ? WHERE vk_id = ?', [{gave: 0, current_room: 0, current_lvl: res[i].current_lvl + 1}, res[i].vk_id], function(err,res){
                                                                                                                if(err) throw err;
                                                                                                                else{
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
                                                                        });
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
                                            <li>Собрано: <small style="color: #E8AC03">`+ room.BALANCE + '/' + (room.SUM * 3) + `</small></li>
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
                                            <li>Собрано: <small style="color: #E8AC03">`+ room.BALANCE + '/' + (room.SUM * 3) + `</small></li>
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

                                                        console.log(html);
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
        
        // return true;

    }

function roomResult(data){
    return data;
}
});


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
                    connection.query('UPDATE users SET ? WHERE ?', [{socket_id: 'none'}, users[i].vk_id], function(err,res){
                        if(err) throw err;
                    });

                    if(i == users.length - 1){
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


/// Запускаем Сервер

server.listen(config.server.port, function() {
    console.log('Server has been started on port ' + config.server.port);
});
