<?php
	require_once("../errHandle.php");

	$arr = [];
	$path = "../../../style/app";
	$i = new RecursiveIteratorIterator(new RecursiveCallbackFilterIterator(new RecursiveDirectoryIterator($path),function($current,$key,$iterator) {
		$filename = $current->getFilename()[0];
		return $filename !== "." && $filename !== ".." && pathinfo($current->getPathname(),PATHINFO_EXTENSION) === "css";
	}));
	foreach ($i as $info) {
		$arr[] = pathinfo($info->getPathname(),PATHINFO_BASENAME)."?t=".time();
	}
	echo json_encode($arr);
?>