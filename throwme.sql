-- phpMyAdmin SQL Dump
-- version 4.5.4.1deb2ubuntu2.1
-- http://www.phpmyadmin.net
--
-- Хост: localhost
-- Время создания: Ноя 02 2019 г., 22:26
-- Версия сервера: 5.7.27-0ubuntu0.16.04.1
-- Версия PHP: 7.0.33-0ubuntu0.16.04.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `throwme`
--

-- --------------------------------------------------------

--
-- Структура таблицы `admin`
--

CREATE TABLE `admin` (
  `ID` int(255) NOT NULL,
  `USER_ID` int(255) NOT NULL,
  `TG_ID` int(255) NOT NULL,
  `VK_ID` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `admin`
--

INSERT INTO `admin` (`ID`, `USER_ID`, `TG_ID`, `VK_ID`) VALUES
(1, 9, 336765139, 266705355),
(2, 23, 239823355, 344540716);

-- --------------------------------------------------------

--
-- Структура таблицы `buyResetLevel`
--

CREATE TABLE `buyResetLevel` (
  `ID` int(255) NOT NULL,
  `USER_ID` int(255) NOT NULL,
  `USER_VK` int(255) NOT NULL,
  `SUM` float NOT NULL,
  `DATE` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `buyResetLevel`
--

INSERT INTO `buyResetLevel` (`ID`, `USER_ID`, `USER_VK`, `SUM`, `DATE`) VALUES
(7, 66, 266705355, 3, '25/10/2019'),
(8, 65, 344540716, 6, '25/10/2019');

-- --------------------------------------------------------

--
-- Структура таблицы `gameHistory`
--

CREATE TABLE `gameHistory` (
  `ID` int(255) NOT NULL,
  `GAME_ID` int(255) NOT NULL,
  `OWNER_ID` int(255) NOT NULL,
  `BALANCE` float NOT NULL,
  `LEVEL` int(11) NOT NULL,
  `DATE` varchar(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `gameHistory`
--

INSERT INTO `gameHistory` (`ID`, `GAME_ID`, `OWNER_ID`, `BALANCE`, `LEVEL`, `DATE`) VALUES
(1, 42, 344540716, 30, 1, ''),
(2, 43, 490748424, 30, 1, ''),
(3, 44, 344540716, 30, 1, ''),
(4, 45, 344540716, 30, 1, ''),
(5, 46, 344540716, 30, 1, ''),
(6, 47, 344540716, 30, 1, ''),
(7, 48, 344540716, 30, 1, ''),
(8, 49, 344540716, 30, 1, ''),
(9, 50, 344540716, 30, 1, ''),
(10, 51, 344540716, 30, 1, ''),
(11, 52, 344540716, 30, 1, ''),
(12, 53, 344540716, 30, 1, ''),
(13, 54, 266705355, 30, 1, ''),
(14, 55, 266705355, 30, 1, ''),
(15, 61, 344540716, 30, 1, ''),
(16, 62, 344540716, 30, 1, ''),
(17, 66, 344540716, 30, 1, '25/10/2019'),
(18, 67, 344540716, 30, 1, '25/10/2019'),
(19, 68, 344540716, 30, 1, '25/10/2019'),
(20, 69, 344540716, 30, 1, '25/10/2019'),
(21, 70, 344540716, 30, 1, '25/10/2019'),
(22, 71, 266705355, 30, 1, '25/10/2019'),
(23, 72, 344540716, 60, 3, '25/10/2019');

-- --------------------------------------------------------

--
-- Структура таблицы `levels`
--

CREATE TABLE `levels` (
  `ID` int(255) NOT NULL,
  `LEVEL` int(255) NOT NULL,
  `ACTION` int(255) NOT NULL DEFAULT '0',
  `SUM` float NOT NULL,
  `TYPE` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `levels`
--

INSERT INTO `levels` (`ID`, `LEVEL`, `ACTION`, `SUM`, `TYPE`) VALUES
(1, 1, 0, 10, 'SMALL'),
(2, 2, 1, 30, 'SMALL'),
(3, 3, 0, 20, 'SMALL'),
(4, 4, 1, 60, 'SMALL'),
(5, 5, 0, 50, 'SMALL'),
(6, 6, 1, 150, 'SMALL'),
(7, 7, 0, 100, 'PRO'),
(8, 8, 1, 300, 'PRO'),
(9, 9, 0, 200, 'PRO'),
(10, 10, 1, 600, 'PRO'),
(11, 11, 0, 500, 'PRO'),
(12, 12, 1, 1500, 'PRO');

-- --------------------------------------------------------

--
-- Структура таблицы `rooms`
--

CREATE TABLE `rooms` (
  `ID` int(255) NOT NULL,
  `ROOM_LEVEL` int(255) NOT NULL,
  `SUM` float NOT NULL,
  `OWNER_ID` int(11) NOT NULL,
  `BALANCE` float NOT NULL DEFAULT '0',
  `USERS_COUNT` int(11) NOT NULL DEFAULT '0',
  `STATUS` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `rooms`
--

INSERT INTO `rooms` (`ID`, `ROOM_LEVEL`, `SUM`, `OWNER_ID`, `BALANCE`, `USERS_COUNT`, `STATUS`) VALUES
(73, 3, 60, 266705355, 0, 0, 0);

-- --------------------------------------------------------

--
-- Структура таблицы `userGameHistory`
--

CREATE TABLE `userGameHistory` (
  `ID` int(255) NOT NULL,
  `USER_ID` int(255) NOT NULL,
  `USER_VK` varchar(255) NOT NULL,
  `GAME_ID` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `userGameHistory`
--

INSERT INTO `userGameHistory` (`ID`, `USER_ID`, `USER_VK`, `GAME_ID`) VALUES
(38, 4, '490748424', 61),
(39, 4, '490748424', 62),
(40, 5, '391303699', 62),
(41, 9, '266705355', 62),
(42, 5, '391303699', 68),
(43, 6, '161057466', 68),
(44, 66, '266705355', 68),
(45, 5, '391303699', 69),
(46, 6, '161057466', 69),
(47, 66, '266705355', 69),
(48, 5, '391303699', 70),
(49, 6, '161057466', 70),
(50, 66, '266705355', 70),
(51, 5, '391303699', 71),
(52, 6, '161057466', 71),
(53, 65, '344540716', 71),
(54, 5, '391303699', 72),
(55, 6, '161057466', 72),
(56, 66, '266705355', 72);

-- --------------------------------------------------------

--
-- Структура таблицы `users`
--

CREATE TABLE `users` (
  `id` int(11) UNSIGNED NOT NULL,
  `vk_id` int(11) UNSIGNED DEFAULT NULL,
  `first_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `last_name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sex` int(11) UNSIGNED DEFAULT NULL,
  `photo_big` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `socket_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'none',
  `user_balance` double DEFAULT NULL,
  `user_replenishment` float NOT NULL DEFAULT '0',
  `user_role` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `current_lvl` int(255) NOT NULL DEFAULT '1',
  `current_room` int(255) NOT NULL DEFAULT '0',
  `own_room` int(255) NOT NULL DEFAULT '0',
  `gave` int(11) NOT NULL DEFAULT '0',
  `reg_date` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_online` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT 'offline',
  `user_ref` int(11) UNSIGNED DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Дамп данных таблицы `users`
--

INSERT INTO `users` (`id`, `vk_id`, `first_name`, `last_name`, `sex`, `photo_big`, `token`, `socket_id`, `user_balance`, `user_replenishment`, `user_role`, `current_lvl`, `current_room`, `own_room`, `gave`, `reg_date`, `is_online`, `user_ref`) VALUES
(5, 391303699, 'Viorel', 'Parfeni', 2, 'https://sun9-7.userapi.com/c637330/v637330699/1cf5d/xYalsRxD_xI.jpg?ava=1', '960ecc2affaecd0107d7854ac69d17973642e827c755831cbde59c687dfa85bdb31aa2b88ccc034fe2be7', 'none', 0, 0, 'user', 7, 0, 0, 0, '', 'offline', NULL),
(6, 161057466, 'Елена', 'Федотова', 1, 'https://sun9-28.userapi.com/c831109/v831109399/5a225/V5bi9yrziAs.jpg?ava=1', 'f46017223de43dd5e48c900cb446afbc75b665d7f543b02fa987e0da9bfd043de12e5d2975676ed0053c2', 'none', 0, 0, 'user', 7, 0, 0, 0, '', 'offline', NULL),
(7, 53585125, 'Нина', 'Артемьева', 1, 'https://sun9-6.userapi.com/c857520/v857520454/581dc/X987GTT-Ayk.jpg?ava=1', '35cbc709d7eeae48312739fd363a541cb7384704cc7750d30d0b7e02fa9c11e9c61a79951dffa1436ec9c', 'none', 0, 0, 'user', 1, 0, 0, 0, '', 'offline', NULL),
(10, 139366354, 'Николай', 'Блохин', 2, 'https://sun9-54.userapi.com/c852024/v852024191/1afc98/YQ3btm6VHz4.jpg?ava=1', '022e91fe8b398082ef6e673e438bbf384d25ca5e0fb6aabb5f7cd1a15dc237ed8afd7e8050046c432cbf6', 'none', 0, 0, 'user', 2, 0, 0, 0, '', 'offline', NULL),
(11, 527226693, 'Кристина', 'Круминь', 1, 'https://sun9-48.userapi.com/c851532/v851532407/95a83/6VqBzPyiUNk.jpg?ava=1', '98307bbd0bcd2662415286d784fa837bad8983043ded5745b5f86bb85c9af19e274a5017fdc2d3c6a22e6', 'none', 0, 0, 'user', 1, 0, 0, 0, '', 'offline', NULL),
(24, 510833580, 'Григорий', 'Ануфриев', 2, 'https://sun1-22.userapi.com/c855016/v855016132/c4de9/hjZVVM-pz40.jpg?ava=1', '9fc722635d4b9555c078ae8df3e9067576b33e7cfdbe48615f2949feea2c2bb047652686c2600cea6c9db', 'none', 0, 0, 'user', 1, 0, 0, 0, '', 'offline', NULL),
(25, 165177041, 'Костя', 'Головин', 2, 'https://sun9-50.userapi.com/c846420/v846420387/13a6cb/Jx27uH0yR00.jpg?ava=1', '3190623e2b92c23aaac0671b420e7c0a1049cf04bfb6f5c5e27d9519b9471aa9a18ac73abaa4de6447198', 'none', 0, 0, 'user', 2, 0, 0, 0, '', 'offline', NULL),
(65, 344540716, 'Эдуард', 'Шумков', 2, 'https://sun9-1.userapi.com/c850428/v850428476/1980c3/ZV_cLe6u-4A.jpg?ava=1', 'cab59672a7866e801da34a1d8e16d095e8e0d9485f45f6da352f3dea197b8e1a2ec4033cb4272c3213124', 'none', 0, 10, 'user', 1, 0, 0, 0, '17/10/2019', 'offline', 1),
(66, 266705355, 'Тимка', 'Мирзаев', 2, 'https://sun9-23.userapi.com/c830109/v830109203/63c4c/9ljwMPvKA7g.jpg?ava=1', 'f78b1f3ebef83aa34baa226fc7086eb01024326682bfa6a143f4dad8d2f2d8f7b9f0bf5be8e359e207a53', 'none', 0, 10, 'user', 4, 0, 73, 0, '17/10/2019', 'offline', 1),
(67, 490748424, 'Кексик', 'Кексиков', 2, 'https://sun9-55.userapi.com/c847121/v847121555/b3b78/s8TEFsl2vy8.jpg?ava=1', '10e36fa5f145ed846cedf40c0eb87d5a2a40459359d3aaf3c7bbb7c40d294380d6a1f5a7081b4cb987f7a', '765ZDK8i-iOKfYZDAAAB', 0, 0, 'user', 1, 0, 0, 0, '18/10/2019', 'online', 0);

-- --------------------------------------------------------

--
-- Структура таблицы `withdraws`
--

CREATE TABLE `withdraws` (
  `ID` int(255) NOT NULL,
  `USER_ID` int(255) NOT NULL,
  `USER_VK` int(255) NOT NULL,
  `USER_NAME` varchar(255) NOT NULL,
  `SUM` float NOT NULL,
  `PAY_SYSTEM` varchar(255) NOT NULL,
  `NUMBER` varchar(255) NOT NULL,
  `STATUS` varchar(255) NOT NULL DEFAULT 'WAIT',
  `DATE` varchar(255) NOT NULL,
  `DATE_TIME` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Дамп данных таблицы `withdraws`
--

INSERT INTO `withdraws` (`ID`, `USER_ID`, `USER_VK`, `USER_NAME`, `SUM`, `PAY_SYSTEM`, `NUMBER`, `STATUS`, `DATE`, `DATE_TIME`) VALUES
(1, 65, 344540716, 'Эдуард', 50, 'Qiwi', '+998915080258', 'WAIT', '29/10/2019', 'undefined:undefined:undefined'),
(2, 65, 344540716, 'Эдуард', 100, 'Qiwi', '+998915080258', 'WAIT', '29/10/2019', 'undefined:undefined:undefined'),
(3, 65, 344540716, 'Эдуард', 100, 'Qiwi', '+998915080258', 'WAIT', '29/10/2019', '3:6:2'),
(4, 65, 344540716, 'Эдуард', 100, 'Qiwi', '+998915080258', 'WAIT', '29/10/2019', '3:8:43'),
(5, 65, 344540716, 'Эдуард', 101, 'Qiwi', '+998915080258', 'WAIT', '29/10/2019', '3:9:6'),
(6, 65, 344540716, 'Эдуард', 100, 'Qiwi', '+998915080258', 'WAIT', '29/10/2019', '3:17:59 AM'),
(7, 65, 344540716, 'Эдуард', 1000, 'Qiwi', '+998915080258', 'WAIT', '29/10/2019', '3:18:19 AM');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `buyResetLevel`
--
ALTER TABLE `buyResetLevel`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `gameHistory`
--
ALTER TABLE `gameHistory`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `levels`
--
ALTER TABLE `levels`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `userGameHistory`
--
ALTER TABLE `userGameHistory`
  ADD PRIMARY KEY (`ID`);

--
-- Индексы таблицы `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `index_foreignkey_users_vk` (`vk_id`);

--
-- Индексы таблицы `withdraws`
--
ALTER TABLE `withdraws`
  ADD PRIMARY KEY (`ID`);

--
-- AUTO_INCREMENT для сохранённых таблиц
--

--
-- AUTO_INCREMENT для таблицы `admin`
--
ALTER TABLE `admin`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;
--
-- AUTO_INCREMENT для таблицы `buyResetLevel`
--
ALTER TABLE `buyResetLevel`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;
--
-- AUTO_INCREMENT для таблицы `gameHistory`
--
ALTER TABLE `gameHistory`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;
--
-- AUTO_INCREMENT для таблицы `levels`
--
ALTER TABLE `levels`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;
--
-- AUTO_INCREMENT для таблицы `rooms`
--
ALTER TABLE `rooms`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=74;
--
-- AUTO_INCREMENT для таблицы `userGameHistory`
--
ALTER TABLE `userGameHistory`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;
--
-- AUTO_INCREMENT для таблицы `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;
--
-- AUTO_INCREMENT для таблицы `withdraws`
--
ALTER TABLE `withdraws`
  MODIFY `ID` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
