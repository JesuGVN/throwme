	<?php 

		$USER_INFO = R::findOne('users', 'vk_id = ?', array($_SESSION['logged_user']->vk_id));

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
						
						<div class="lvl_list col-md-6 col-sm-12">
							<div class="row justify-content-md-center justify-content-sm-center">
								<div class="block col-md-12 col-sm-12">
									<h3>Выберите Уровень</h3>
									<div class="list col-md-12 col-sm-12">
										<ul>
											<li>
												<div class="element">
													<img src="./images/lvls/1.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
											<li>
												<div class="element">
													<img src="./images/lvls/2.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
											<li>
												<div class="element">
													<img src="./images/lvls/3.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
											<li>
												<div class="element">
													<img src="./images/lvls/4.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
											<li>
												<div class="element">
													<img src="./images/lvls/5.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
											<li>
												<div class="element">
													<img src="./images/lvls/6.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
											<li>
												<div class="element">
													<img src="./images/lvls/7.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
											<li>
												<div class="element">
													<img src="./images/lvls/8.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
											<li>
												<div class="element">
													<img src="./images/lvls/9.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
											<li>
												<div class="element">
													<img src="./images/lvls/10.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
											<li>
												<div class="element">
													<img src="./images/lvls/11.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
											<li>
												<div class="element">
													<img src="./images/lvls/12.png" height="70">
													<button>Выбрать</button>
												</div>
											</li>
										</ul>
									</div>
								</div>
							</div>
						</div>

						<div class="lvl_info col-md-3 col-sm-12">
							<div class="row justify-content-md-center justify-content-sm-center">
								<div class="block col-md-11 col-sm-12">
									<h1>Информация</h1>
									<div class="info">
										<ul>
											<li>Уровень комнаты <small>1</small></li>
											<li style="color: #FF5D2B;">Тип уровня: <small>FREE</small></li>
											<li style="color: yellow;">Действие: <small>Отдаете</small></li>
											<li style="color: red;">Отдаете: <small>10 руб..</small></li>
											<li style="color: #37C441;">Получаете: <small>0 руб.</small></li>
										</ul>
									</div>

									<button class="begin">Начать</button>
								</div>
							</div>
						</div>
					
				