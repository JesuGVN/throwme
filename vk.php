<?php 

  // var_dump($_GET);

require_once('config.php');

  if(!$_GET['code']){
  	// Если кода не существует
  	exit('error code ...');
  }else{

	  $token = json_decode(file_get_contents('https://oauth.vk.com/access_token?client_id='.$VK_APP_INFO['id'].'&redirect_uri='.$VK_APP_INFO['redirect_url'].'&client_secret='.$VK_APP_INFO['secret_key'].'&code='.$_GET['code']), true);

	  if(!$token){
	  	exit('error token ...');
	  }else{
	  	
	    $data = json_decode(file_get_contents('https://api.vk.com/method/users.get?user_id='.$token['user_id'].'&access_token='.$token['access_token'].'&fields=uid,first_name,last_name,photo_big,sex,about&v=5.52'), true);

		  if(!$data){
		  	exit('error data ...');
		  }else{
		  	$data = $data['response'][0];

		  	$findUser = R::findOne('users', 'vk_id = ?', array($data['id']));

		  	if(!empty($findUser)){
		  		// Авторизация


		  		$findUser->first_name = (string)$data['first_name'];
		  		$findUser->last_name  = (string)$data['last_name'];
		  		$findUser->photo_big  = (string)$data['photo_big'];
		  		$findUser->token      = (string)$token['access_token'];

		  		R::store($findUser);

		  		$_SESSION['logged_user'] = $findUser;
		  		header('Location: '.'/');
		  	}else{
		  		// Регистрация

			  	$user = R::dispense('users');

			  	$userObj = array(
			  		vk_id 	   => (int)$data['id'],
			  		first_name => (string)$data['first_name'],
			  		last_name  => (string)$data['last_name'],
			  		sex 	   => (int)$data['sex'],
			  		photo_big  => (string)$data['photo_big']
			  	);

			  	$user->vk_id 	   	= 	(int)$data['id'];
			  	$user->first_name  	= 	(string)$data['first_name'];
			  	$user->last_name   	= 	(string)$data['last_name'];
			  	$user->sex 		   	= 	(int)$data['sex'];
			  	$user->photo_big   	= 	(string)$data['photo_big'];
			  	$user->token       	= 	(string)$token['access_token'];

			  	$user->user_balance =  	(float)0;
			  	$user->user_role 	= 	(string)'user';

			  	R::store($user);


			  	$_SESSION['logged_user'] = (array)$userObj;
			  	header('Location: '.'/');


		  	}





		  }
	  }
  }


  // var_dump($token);



 ?>
