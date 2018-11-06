SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";

CREATE TABLE `experiense_lvl_list` (
  `lvl_id` mediumint(3) UNSIGNED NOT NULL,
  `lvl_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `experiense_lvl_list` (`lvl_id`, `lvl_name`) VALUES(1, 'biginner');
INSERT INTO `experiense_lvl_list` (`lvl_id`, `lvl_name`) VALUES(2, 'intermediate');
INSERT INTO `experiense_lvl_list` (`lvl_id`, `lvl_name`) VALUES(3, 'senior');
INSERT INTO `experiense_lvl_list` (`lvl_id`, `lvl_name`) VALUES(4, 'expert');

CREATE TABLE `experties_list` (
  `experties_id` mediumint(3) UNSIGNED NOT NULL,
  `experties_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `experties_list` (`experties_id`, `experties_name`) VALUES(1, 'node js');
INSERT INTO `experties_list` (`experties_id`, `experties_name`) VALUES(2, 'angular js');
INSERT INTO `experties_list` (`experties_id`, `experties_name`) VALUES(3, 'react js');
INSERT INTO `experties_list` (`experties_id`, `experties_name`) VALUES(4, 'vue js');

CREATE TABLE `user_details` (
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `user_email_id` varchar(255) NOT NULL,
  `user_password` varchar(255) CHARACTER SET latin1 COLLATE latin1_bin DEFAULT NULL,
  `user_phone_no` bigint(10) UNSIGNED DEFAULT NULL,
  `user_first_name` varchar(255) NOT NULL,
  `user_last_name` varchar(255) NOT NULL,
  `user_company_name` varchar(255) NOT NULL,
  `user_technical_experties` mediumint(3) UNSIGNED NOT NULL,
  `user_years_of_exp` mediumint(3) UNSIGNED NOT NULL,
  `user_experience_level` mediumint(3) UNSIGNED NOT NULL,
  `user_is_admin` tinyint(1) UNSIGNED NOT NULL COMMENT '0 -> Normal user, 1-> Admin'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `user_details` (`user_id`, `user_email_id`, `user_password`, `user_phone_no`, `user_first_name`, `user_last_name`, `user_company_name`, `user_technical_experties`, `user_years_of_exp`, `user_experience_level`, `user_is_admin`) VALUES(1, 'smnkumarpaul@gmail.com', 'pass', 983042080, 'suman kumar', 'paul', 'phoenix robotix pvt ltd.', 1, 1, 2, 1);

CREATE TABLE `user_session` (
  `session_id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `session_login_time` bigint(10) NOT NULL,
  `session_logout_time` bigint(10) DEFAULT NULL,
  `session_login_from` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `experiense_lvl_list`
  ADD PRIMARY KEY (`lvl_id`);

ALTER TABLE `experties_list`
  ADD PRIMARY KEY (`experties_id`);

ALTER TABLE `user_details`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `user_email_id` (`user_email_id`),
  ADD KEY `technical_experties` (`user_technical_experties`),
  ADD KEY `experience_level` (`user_experience_level`);

ALTER TABLE `user_session`
  ADD PRIMARY KEY (`session_id`),
  ADD KEY `user_id` (`user_id`);




ALTER TABLE `experiense_lvl_list`
  MODIFY `lvl_id` mediumint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `experties_list`
  MODIFY `experties_id` mediumint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
ALTER TABLE `user_details`
  MODIFY `user_id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
ALTER TABLE `user_details`
  ADD CONSTRAINT `experience_level` FOREIGN KEY (`user_experience_level`) REFERENCES `experiense_lvl_list` (`lvl_id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `technical_experties` FOREIGN KEY (`user_technical_experties`) REFERENCES `experties_list` (`experties_id`) ON UPDATE CASCADE;
ALTER TABLE `user_session`
  ADD CONSTRAINT `user_session_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user_details` (`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;
