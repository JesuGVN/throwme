<?php require_once('./includes/header.php'); // Шапка 

	$withdraws = R::getAll('SELECT * FROM withdraws WHERE STATUS = "DONE" ORDER BY ID DESC LIMIT 50');
?>

<!-- Тут пиши свой HTML -->
<div class="widthdraws" >
		<div class="bg-widthdraws"> 
					<table align="center">
						<caption class="caption-side"><h3 style="text-align: center;">Последние выплаты</h3></caption>
						<thead>
							<th>ID Игрока</th>
							<th>Сумма</th>
							<th>Система</th>
							<th>Кошелек</th>
							<th>Дата Выплаты</th>
						</thead>
						<?php  foreach($withdraws as $withdraw){ ?>
						<tbody>
							<td><?php echo $withdraw['USER_VK']; ?></td>
							<td><?php echo $withdraw['SUM']; ?></td>
							<td title="<?php echo $withdraw['PAY_SYSTEM'] ?>"><img height="30" src="images/paySystem/<?php echo $withdraw['PAY_SYSTEM'] ?>.png" alt="<?php echo $withdraw['PAY_SYSTEM'] ?>"></td>
							<td><?php echo '*****'.substr($withdraw['NUMBER'], -4, strlen($withdraw['NUMBER']) ); ?></td>
							<td><?php echo $withdraw['DATE'];?></td>
						</tbody>
						<?php } ?>
					</table>
			</div>
	</div>

<?php require_once('./includes/footer.php'); // Подвал ?>
