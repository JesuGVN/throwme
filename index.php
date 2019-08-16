<?php require_once('./includes/header.php'); // Шапка

if(isset($_SESSION['logged_user'])){
	require_once('./includes/game.php'); // Рабочая Зона
	require_once('./includes/last-game-bar.php'); // Последние действия
}else{
	require_once('./includes/notauth.php'); // Не авторизованные
}

require_once('./includes/footer.php'); // Подвал сайта


 ?>
	
