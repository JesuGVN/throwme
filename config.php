<?


require('libs/RedBeanPHP/rb.php');
session_start();

R::setup( 'mysql:host=localhost;dbname=throwme','root', '' ); //for both mysql or mariaDB



 $VK_APP_INFO = array(
 	id => 6740737,
 	secret_key => '2xI3yelkmLhout3UvvPP',
 	service_key => 'bc939f14bc939f14bc939f1493bcf54415bbc93bc939f14e74e26951f80a23d15a654fc',
 	redirect_url => 'http://192.168.0.200/vk.php'
 );

 define('VK_AUTH_URL', 'https://oauth.vk.com/authorize?client_id='.$VK_APP_INFO['id'].'&redirect_uri='.$VK_APP_INFO['redirect_url'].'&scope=friends,offline,groups,photos&response_type=code');




 ?>