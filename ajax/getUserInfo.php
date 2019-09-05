<?php 
require '../config.php';

if($_POST['getID'] && $_SESSION['logged_user']){
	echo $_SESSION['logged_user']->vk_id;
}
 ?>
