<?php 
	require '../config.php';
	if(isset($_SESSION['logged_user'])){

		$vk_id = (int)$_SESSION['logged_user']['vk_id'];

		$userInfo = R::findOne('users', 'vk_id = ?', array($vk_id));
		$referals = R::getAll('SELECT * FROM users WHERE user_ref = ?', array($userInfo['id']));

		$mainRepl = 0;

		if(count($referals) > 0){
			?>
			<div class="inviteInfo refBlock col-md-12 col-sm-12">
				<div class="block_container">
					<h2>Приглашайте друзей и зарабатывайте</h2>
					<p>Получайте <b>10% сразу на баланс</b> с каждого пополнения реферала.</p>

					<h4>Ваша ссылка</h4>

					<div class="linkBlock">
						<b><i class="fa fas fa-link"></i></b>
						<small>https://throwme.ru?ref=<?php echo $userInfo['id']; ?></small>

						<button title="Нажмите чтобы скопировать"><i class="fa far fa-copy"></i></button>
					</div>
				</div>
				<div class="block_container">
					
						
						<table align="center" class="col-md-12 col-sm-12">
							<thead>
								
								<tr>
									<th>ID</th>
									<th>Дата</th>
									<th>Имя</th>
									<th>Прибыль</th>
								</tr>
							</thead>
							<tbody>
								<?php 
								foreach($referals as $ref){
									$mainRepl = $mainRepl + ($ref['user_replenishment'] / 100) * 10;
								 ?>
								
								<tr>
									<td><?php echo $ref['vk_id']; ?></td>
									<td><?php echo $ref['reg_date']; ?></td>
									<td><?php echo $ref['first_name']; ?></td>
									<td><?php echo ($ref['user_replenishment'] / 100) * 10; ?></td>
								</tr>
							<?php } ?>

							</tbody>
							
						</table>

						<div class="count_pagination">
							<label>Всего рефералов: <b><?php echo count($referals) ?></b></label>
							<label>Всего Прибыли: <b><?php echo $mainRepl ?> руб.</b></label>
							<div class="paginator">
								<small>Назад</small>
								<ul>
									<li>
										<div data-paginator="1">
											1
										</div>
									</li>
									<li>
										<div data-paginator="2">
											2
										</div>
									</li><li>
										<div data-paginator="2">
											3
										</div>
									</li><li>
										<div data-paginator="2">
											4
										</div>
									</li>
								</ul>
								<small>Вперед</small>
							</div>
						</div>
					
				</div>
				
			</div>

			<?
		}else{
			?>
			<div class="inviteInfo refBlock col-md-12 col-sm-12">
				<div class="block_container">
					<h2>Приглашайте друзей и зарабатывайте</h2>
					<p>Получайте <b>10% сразу на баланс</b> с каждого пополнения реферала.</p>

					<h4>Ваша ссылка</h4>

					<div class="linkBlock">
						<b><i class="fa fas fa-link"></i></b>
						<small id="copy_ref">https://throwme.ru?ref=<?php echo $userInfo['id']; ?></small>


						<button class="copy"><i class="fa far fa-copy" title="Нажмите чтобы скопировать."></i></button>
					</div>
				</div>
				<div class="block_container">
					
						
						<table align="center" class="col-md-12 col-sm-12">
							<thead>
								
								<tr>
									<th>ID</th>
									<th>Дата</th>
									<th>Имя</th>
									<th>Прибыль</th>
								</tr>
							</thead>

							
						</table>
						<small>У вас нету рефералов.</small>
					
				</div>
				
			</div>
			<?
		}
	}

 ?>