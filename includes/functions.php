<?php 


	function init(){
		if(isset($_SESSION['logged_user'])){
			// require_once('./includes/game.php'); // Рабочая Зона
			getLevelList();
			require_once('./includes/last-game-bar.php'); // Последние действия
			getModals();

			if($_POST['socket']){
				$User = R::findOne('users', 'vk_id = ?', array($_SESSION['logged_user']->vk_id));

				if($User->socket_id == 'none'){
					$User->socket_id = (string)$_POST['socket'];
					$User->is_online  = 'online';
					R::store($User);	
				}

			}

		}else{
			require_once('./includes/notauth.php'); // Не авторизованные
			if($_GET['ref']){


				if(is_numeric($_GET['ref'])){
					$r = (string)$_GET['ref'];
				    $_SESSION['referal'] = $r;
				}
			}
		}

		require_once('./includes/footer.php'); // Подвал сайта

	}
	function getReferals(){
		require 'referals.php';
	}

	function getLevelList(){
			// Init
		$USER_INFO  = R::findOne('users', 'vk_id = ?', array($_SESSION['logged_user']->vk_id));
		$LEVELS     = R::getAll('SELECT * FROM levels');
		$LEVEL_INFO = R::findOne('levels', 'LEVEL = ?', array($USER_INFO->current_lvl));

		$LEVEL_INFO = $LEVEL_INFO->export();
	 ?>				
		
					<!-- Контентная часть -->
						<div class="nav-bar-left col-md-3 col-sm-12 col-xs-12 ">
							<!-- Кнопки и Инфо о пользователе -->

							<div class="user-info ">

								<div class="avatar-zone ">
									<a href="http://vk.com/id<?php echo $_SESSION['logged_user']->vk_id?>">
										<img id="user_avatar" src="<? echo $_SESSION['logged_user']->photo_big?>" alt="user.png" height="50">
									</a>
								</div>

								<div class="info-zone ">
									<h6 id="user_name"><i class="fas fa-user-tie"> </i><?php echo '    '.$_SESSION['logged_user']->first_name; ?></h6>
									<h5 id="user_balance"><i class="fas fa-wallet"></i> <balance id="balance" title="Нажмите чтобы обновить"><?echo $USER_INFO->user_balance; ?> </balance> <i class="fas fa-ruble-sign" style="color: #bdbdbd;font-size: 17px;"></i></h5>
								</div>


								<div class="pay-button-zone ">
									<button id="openmodal"  data-open="0">Пополнить</button>
									<button id="openmodal"  data-open="1">Вывести</button>
								</div>

							</div>

							<div class="nav-bar-menu">
								<ul>
									<li><a href="#" id="begin" class="active">Начать</a></li>
									<li><a href="#" id="myRef">Мои Рефералы</a></li>
									<li><a href="#" id="regulations">Правила</a></li>
									<li><a href="/logout.php">Выход</a></li>
								</ul>
							</div>
						</div>
						

						<div class="work-zone col-md-9 col-sm-12">	


													
							<div class="lvl_list col-md-8 col-sm-12">
								<div class="row justify-content-md-center justify-content-sm-center">
									<div class="block col-md-12 col-sm-12">
										<div class="list col-md-12 col-sm-12">
										<h3>Уровни</h3>
											<ul>
											<? 
											foreach($LEVELS as $level){

												if($USER_INFO->current_lvl < $level['LEVEL']){ ?>
													<li>
														<div class="element">
															<img src="./images/lvls/<?php echo $level['LEVEL'] ?>.png" height="70">
															<small><? echo $level['SUM']?> Рублей</small>
														</div>
													</li>

											  <?}else if($USER_INFO->current_lvl == $level['LEVEL']){ ?>

													<li>
														<div class="element">
															<img src="./images/lvls/current_<?php echo $level['LEVEL'] ?>.png" height="70">
															<small><? echo $level['SUM']?> Рублей</small>
														</div>
													</li>
												<?}else{?>
													<li>
														<div class="element">
															<img src="./images/lvls/blocked_<?php echo $level['LEVEL'] ?>.png" height="70">
															<small><? echo $level['SUM']?> Рублей</small>
														</div>
													</li>
												<?}
										     }?>
											</ul>
										</div>
									</div>
								</div>
							</div>

							<div class="lvl_info col-md-4 col-sm-12">
								<div class="row justify-content-md-center justify-content-sm-center">
									<div class="block col-md-12 col-sm-12">
										<div class="info">
										<h1>Информация</h1>
											<ul>

												<li style="color: #FF5D2B">Уровень комнаты - <small id="room_level"><?php echo $LEVEL_INFO['LEVEL'] ?></small></li>
												<li style="color: #FF5D2B;">Тип уровня - <small id="level_type"><?php echo $LEVEL_INFO['TYPE'] ?></small></li>
												<? if($LEVEL_INFO['ACTION'] == 0){ ?>
												    <li style="color: #FF5D2B;">Действие - <small id="level_action">Отдаете </small></li>
												    <br>
													<li style="color: red;"><i class="fas fa-level-up-alt"></i> Отдаете - <small id="throw_sum"><?php echo $LEVEL_INFO['SUM'] ?> <i class="fas fa-ruble-sign"></i></small></li>
													<li style="color: #37C441;"><i class="fas fa-level-down-alt"></i> Получаете - <small id="get_sum">0 <i class="fas fa-ruble-sign"></i></small></li>
												<?}else{ ?>
													<li style="color: #FF5D2B;">Действие - <small id="level_action">Получаете</small></li>
													<br>
													<li style="color: red;"><i class="fas fa-level-up-alt"></i> Отдаете - <small id="throw_sum">0 <i class="fas fa-ruble-sign"></i></small></li>
													<li style="color: #37C441;"><i class="fas fa-level-down-alt"></i> Получаете - <small id="get_sum"><?php echo $LEVEL_INFO['SUM'] ?> <i class="fas fa-ruble-sign"></i></small></li>

											   <? } ?>
											</ul>
											<button class="begin">Начать</button>
										</div>

										
									</div>
								</div>
							</div>

						</div> <?
	}


	function getLevelListAjax(){
			// Init
		$USER_INFO  = R::findOne('users', 'vk_id = ?', array($_SESSION['logged_user']->vk_id));
		$LEVELS     = R::getAll('SELECT * FROM levels');
		$LEVEL_INFO = R::findOne('levels', 'LEVEL = ?', array($USER_INFO->current_lvl));

		$LEVEL_INFO = $LEVEL_INFO->export();
	 ?>				
		
																			
							<div class="lvl_list col-md-8 col-sm-12">
								<div class="row justify-content-md-center justify-content-sm-center">
									<div class="block col-md-12 col-sm-12">
										<div class="list col-md-12 col-sm-12">
										<h3>Уровни</h3>
											<ul>
											<? 
											foreach($LEVELS as $level){

												if($USER_INFO->current_lvl < $level['LEVEL']){ ?>
													<li>
														<div class="element">
															<img src="./images/lvls/<?php echo $level['LEVEL'] ?>.png" height="70">
															<small><? echo $level['SUM']?> Рублей</small>
														</div>
													</li>

											  <?}else if($USER_INFO->current_lvl == $level['LEVEL']){ ?>

													<li>
														<div class="element">
															<img src="./images/lvls/current_<?php echo $level['LEVEL'] ?>.png" height="70">
															<small><? echo $level['SUM']?> Рублей</small>
														</div>
													</li>
												<?}else{?>
													<li>
														<div class="element">
															<img src="./images/lvls/blocked_<?php echo $level['LEVEL'] ?>.png" height="70">
															<small><? echo $level['SUM']?> Рублей</small>
														</div>
													</li>
												<?}
										     }?>
											</ul>
										</div>
									</div>
								</div>
							</div>

							<div class="lvl_info col-md-4 col-sm-12">
								<div class="row justify-content-md-center justify-content-sm-center">
									<div class="block col-md-12 col-sm-12">
										<div class="info">
										<h1>Информация</h1>
											<ul>

												<li style="color: #FF5D2B">Уровень комнаты - <small id="room_level"><?php echo $LEVEL_INFO['LEVEL'] ?></small></li>
												<li style="color: #FF5D2B;">Тип уровня - <small id="level_type"><?php echo $LEVEL_INFO['TYPE'] ?></small></li>
												<? if($LEVEL_INFO['ACTION'] == 0){ ?>
												    <li style="color: #FF5D2B;">Действие - <small id="level_action">Отдаете </small></li>
												    <br>
													<li style="color: red;"><i class="fas fa-level-up-alt"></i> Отдаете - <small id="throw_sum"><?php echo $LEVEL_INFO['SUM'] ?> <i class="fas fa-ruble-sign"></i></small></li>
													<li style="color: #37C441;"><i class="fas fa-level-down-alt"></i> Получаете - <small id="get_sum">0 <i class="fas fa-ruble-sign"></i></small></li>
												<?}else{ ?>
													<li style="color: #FF5D2B;">Действие - <small id="level_action">Получаете</small></li>
													<br>
													<li style="color: red;"><i class="fas fa-level-up-alt"></i> Отдаете - <small id="throw_sum">0 <i class="fas fa-ruble-sign"></i></small></li>
													<li style="color: #37C441;"><i class="fas fa-level-down-alt"></i> Получаете - <small id="get_sum"><?php echo $LEVEL_INFO['SUM'] ?> <i class="fas fa-ruble-sign"></i></small></li>

											   <? } ?>
											</ul>
											<button class="begin">Начать</button>
										</div>
									</div>
								</div>
							</div>

						 <?
	}

	function getModals(){
		?>

			<div class="modal-window" style="display: none;">
				<div class="contain">
					<div class="window">
						<div class="window-header">
							<button id="window-close" title="Закрыть Модальное Окно">
								<!-- Закрыть модальное окно -->
								<i class="fas fa-times"></i>
							</button>
						</div>
						<div class="windows-modal">
							<!-- Тут размещены все модальные окна -->

							<div class="window-money-repl" id="window" data-modal="0" style="display: block;">
								<!-- Окно Пополнения Баланса -->
								<h1>Пополнение</h1>
							</div>

							<div class="window-money-output" id="window" data-modal="1" style="display: block;">
								<!-- Окно Вывода Баланса -->
								<p>
									<b>Выберите Систему:</b><br>
									<select name="select" class="paySystem"> <!--Supplement an id here instead of using 'name'-->
									  <option value="Qiwi">Qiwi</option> 
									  <option value="Payeer">Payeer</option>
									  <option value="WebMoney">WebMoney</option>
									  <option value="Яндекс.Деньги">Яндекс.Деньги</option>
									</select>
								</p>

								<p>
									<b>Укажите реквизиты:</b><br>
									<input type="text" placeholder="+79XXXXXXXXX" class="requisites">
								</p>
								<p>
									<b>Сумма:</b><br>
									<input type="text" disabled value="713" id="userOutBalance" title="К заполнению не подлежит">
								</p>

								<small><b>Примечание:</b> Для работоспособности Реферальных програм и Платежных Систем мы выводим весь оставшийся баланс на вашем счету! <div class="comission" title="Сервису приходиться на что-то жить и иметь с этого выгоду=)">Комисcия: 10%</div></small>

								<div class="submitOutMoney">
									<small style="color: red" id="error"></small>
									<small style="color: green;" id="succes"></small>
									<button id="outMoney">Вывести</button>
								</div>
								<div class="moreOutput">
								
									<a href="#" class="outPutHistory" id="openmodal" data-open="2"><i class="fas fa-long-arrow-alt-down"></i> Мои Выплаты <i class="fas fa-long-arrow-alt-down"></i></a>
								</div>


							</div>
							<div class="window-money-output-history" id="window" data-modal="2" style="display: block;">
								<!-- История Выводов -->
								<table align="center">
									<thead>
										<tr>
											<th>ID</th>
											<th>Дата</th>
											<th>Реквизиты</th>
											<th>Сумма</th>
											<th>Статус</th>
										</tr>
									</thead>
									<tbody>
										<tr>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td >
												<div id="wait">ЗАГРУЗКА</div>
											</td>
										</tr>
										<tr>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td >
												<div id="wait">ЗАГРУЗКА</div>
											</td>
										</tr>
										<tr>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td >
												<div id="wait">ЗАГРУЗКА</div>
											</td>
										</tr>
										<tr>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td >
												<div id="wait">ЗАГРУЗКА</div>
											</td>
										</tr>
										<tr>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td>ЗАГРУЗКА</td>
											<td >
												<div id="wait">ЗАГРУЗКА</div>
											</td>
										</tr>
										<!-- <tr>
											<td>6482055</td>
											<td>31.09.19 14:42:21</td>
											<td>+998915080258</td>
											<td>1500.00</td>
											<td >
												<div id="wait">В Ожидании</div>
												<i class="fas fa-times cancel" title="Отменить Выплату"></i>
											</td>
										</tr>
										<tr>
											<td>6482055</td>
											<td>30.09.19 13:12:41</td>
											<td>+998915080258</td>
											<td>1500.00</td>
											<td >
												<div id="wait">В Ожидании</div>
												<i class="fas fa-times cancel" title="Отменить Выплату"></i>
											</td>
										</tr>
										<tr>
											<td>6482055</td>
											<td>28.09.19 12:42:21</td>
											<td>+998915080258</td>
											<td>1500.00</td>
											<td >
												<div id="done">Выполнено</div>
											</td>
										</tr>
										<tr>
											<td>6482055</td>
											<td>28.09.19 12:42:21</td>
											<td>+998915080258</td>
											<td>1500.00</td>
											<td >
												<div id="done">Выполнено</div>
											</td>
										</tr>
										<tr>
											<td>6482055</td>
											<td>28.09.19 12:42:21</td>
											<td>+998915080258</td>
											<td>1500.00</td>
											<td >
												<div id="done">Выполнено</div>
											</td>
										</tr> -->
									</tbody>
								</table>
							</div>
						</div>
					</div>
				</div>
			</div>

		<?
	}

 ?>