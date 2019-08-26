<?


require('libs/RedBeanPHP/rb.php');
session_start();

R::setup( 'mysql:host=localhost;dbname=throwme','root', '' ); //for both mysql or mariaDB



 $VK_APP_INFO = array(
 	id => 7095575,
 	secret_key => 'O7vTHYkzFcM9QpS5lMGq',
 	service_key => '341eaf71341eaf71341eaf711b3472ea663341e341eaf71694c79db2e85489371fc2796',
 	redirect_url => 'http://192.168.0.200/vk.php'
 );

 define('VK_AUTH_URL', 'https://oauth.vk.com/authorize?client_id='.$VK_APP_INFO['id'].'&redirect_uri='.$VK_APP_INFO['redirect_url'].'&scope=friends,offline,groups,photos&response_type=code');




 ?>