	<?php 
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
									<img id="user_avatar" src="<? echo $_SESSION['logged_user']->photo_big?>" alt="user.png" height="50">
								</div>

								<div class="info-zone ">
									<h6 id="user_name"><b>👽</b><?php echo $_SESSION['logged_user']->first_name; ?></h6>
									<h5 id="user_balance">💰<?echo $USER_INFO->user_balance; ?> руб.</h5>
								</div>


								<div class="pay-button-zone ">
									<button>Пополнить</button>
									<button>Вывести</button>
								</div>

							</div>

							<div class="nav-bar-menu">
								<ul>
									<li><a href="#" class="active">Начать</a></li>
									<li><a href="#">Мои Рефералы</a></li>
									<li><a href="#">Подписки</a></li>
									<li><a href="/logout.php">Выход</a></li>
								</ul>
							</div>
						</div>
						

						<div class="work-zone col-md-9 col-sm-12">	
													
							<div class="lvl_list col-md-8 col-sm-12">
								<div class="row justify-content-md-center justify-content-sm-center">
									<div class="block col-md-12 col-sm-12">
										<h3>Уровни</h3>
										<div class="list col-md-12 col-sm-12">
											<ul>
											<? 
											foreach($LEVELS as $level){

												if($USER_INFO->current_lvl < $level['LEVEL']){ ?>
													<li>
														<div class="element">
															<img src="./images/lvls/<?php echo $level['LEVEL'] ?>.png" height="70">
															<small><? echo $level['SUM']?> руб.</small>
														</div>
													</li>

											  <?}else if($USER_INFO->current_lvl == $level['LEVEL']){ ?>

													<li>
														<div class="element">
															<img src="./images/lvls/current_<?php echo $level['LEVEL'] ?>.png" height="70">
															<small><? echo $level['SUM']?> руб.</small>
														</div>
													</li>
												<?}else{?>
													<li>
														<div class="element">
															<img src="./images/lvls/blocked_<?php echo $level['LEVEL'] ?>.png" height="70">
															<small><? echo $level['SUM']?> руб.</small>
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
									<div class="block col-md-11 col-sm-12">
										<h1>Информация</h1>
										<div class="info">
											<ul>

												<li>Уровень комнаты: <small id="room_level"><?php echo $LEVEL_INFO['LEVEL'] ?></small></li>
												<li style="color: #FF5D2B;">Тип уровня: <small id="level_type"><?php echo $LEVEL_INFO['TYPE'] ?></small></li>
												<? if($LEVEL_INFO['ACTION'] == 0){ ?>
												    <li style="color: yellow;">Действие: <small id="level_action">Отдаете</small></li>
													<li style="color: red;">Отдаете: <small id="throw_sum"><?php echo $LEVEL_INFO['SUM'] ?></small></li>
													<li style="color: #37C441;">Получаете: <small id="get_sum">0 руб.</small></li>
												<?}else{ ?>
													<li style="color: yellow;">Действие: <small id="level_action">Получаете</small></li>
													<li style="color: red;">Отдаете: <small id="throw_sum">0 руб.</small></li>
													<li style="color: #37C441;">Получаете: <small id="get_sum"><?php echo $LEVEL_INFO['SUM'] ?></small></li>

											   <? } ?>
											</ul>
										</div>

										<button class="begin">Начать</button>
									</div>
								</div>
							</div>

							<div class="loading_block col-md-12 col-sm-12">
								<h1>ЗАГРУЗКА ...</h1>
								<p>Дождитесь окончания Загрузки, сервис пытается найти свободную комнату для вас!</p>
							</div>
						</div>
					
				