<?php
	require_once("../errHandle.php");

	$arr = [];
	$path = "../../../style/app";
	$i = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path));
	foreach ($i as $value) {
		if ($value !== "." && $value !== "..") {
			$info = pathinfo($value);
			if ($info["extension"] === "css") {
				$arr[] = $info["basename"]."?t=".time();
			}
		}
	}
	echo json_encode($arr);
?>