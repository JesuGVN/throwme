<?

require('includes/functions.php');
require('libs/RedBeanPHP/rb.php');
session_start();

R::setup( 'mysql:host=localhost;dbname=throwme_beta','root', '' ); //for both mysql or mariaDB



 $VK_APP_INFO = array(
 	id => 7193488,
 	secret_key => 'yBnJLyXggP4CPBGYjZx2',
 	service_key => 'faa1991afaa1991afaa1991a25facc5a8affaa1faa1991aa71c2400b4b3b563890134fd',
 	redirect_url => 'http://localhost/vk.php'
 );

 $MAX_LEVEL = 4;

 define('VK_AUTH_URL', 'https://oauth.vk.com/authorize?client_id='.$VK_APP_INFO['id'].'&redirect_uri='.$VK_APP_INFO['redirect_url'].'&scope=friends,offline,groups,photos&response_type=code');




?>