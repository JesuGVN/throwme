<?php require_once('./includes/header.php'); // Шапка

if(isset($_SESSION['logged_user'])){
	require_once('./includes/game.php'); // Рабочая Зона
	require_once('./includes/last-game-bar.php'); // Последние действия

	if($_POST['socket']){
		$User = R::findOne('users', 'vk_id = ?', array($_SESSION['logged_user']->vk_id));

		if($User->socket_id == 'none'){
			$User->socket_id = (string)$_POST['socket'];
			R::store($User);	
		}

	}

}else{
	require_once('./includes/notauth.php'); // Не авторизованные
}

require_once('./includes/footer.php'); // Подвал сайта



 ?>
	
