<?php include('config.php'); ?>
<!-- 
- - - - - - - - - - - - - - - - - - - - - - - - - - - 
-   Дата начала разработки: 29.07.19 | 13-55        -
- - - - - - - - - - - - - - - - - - - - - - - - - - - 
-->


<!DOCTYPE html>
<html>
<head>
	<title>ThrowMe - Скинься чтобы разбогатеть</title>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width">
	<meta name="description" content="Мы финансовая пирамида которая помогает разбогатеть каждому желающему, если у тебя в кармане заволялись лишние 10 рублей и ты хочешь больше денег то не проходи мимо, ты не пожалеешь.">

	<!-- Подключаем библиотеку bootstrap v4 -->
	<link rel="stylesheet" type="text/css" href="./assets/bootstrap/css/bootstrap.css">
	<!-- Подключаем основной файл стилей -->
	<link rel="stylesheet" type="text/css" href="./styles/style.css">

	<!-- Подключаем jQuery -->
	<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
	<script src="https://cdnjs.cloudflare.com/ajax/libs/socket.io/2.2.0/socket.io.js"></script>


	<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.7.0/css/all.css" integrity="sha384-lZN37f5QGtY3VHgisS14W3ExzMWZxybE1SJSEsQp9S+oqd12jhcu+A56Ebc1zFSJ" crossorigin="anonymous">

	<!-- Основной JS сценарий -->
	<script src="./js/script.js"></script>

</head>
<body>
	<div class="page-wrapper">
		<div class="container-fluid">
			<div class="row justify-content-md-center justify-content-sm-center justify-content-xs-center">
				<div class="show-menu">
					<img src="./images/tree-menu.png" alt="menu.png" height="25">
				</div>
				<div class="navigation-bar col-md-12 col-sm-12 col-12 col-xs-12">
					<!-- Навигация -->
					<div class="logo-block col-md-3 col-sm-12 col-xs-12">
						<a href="/">
							<img src="./logo.png" alt="site-logo" height="50">
						</a>
					</div>
					<div class="nav">
						<ul>
							<li><a href="/">Главная</a></li>
							<li><a href="#">Мы Вконтакте</a></li>
							<li><a href="/withdraws.php">История Выплат</a></li>
							<li><a href="#">Новости</a></li>
							<li><a href="#">FAQ</a></li>
						</ul>
					</div>
				</div>

				<div class="clear-fix col-md-12 col-sm-12 col-xs-12"></div>