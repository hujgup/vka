<?php
	require_once("load.php");

	if (isset($_POST["folder"])) {
		$absPath = urldecode($_POST["folder"]);
		if (!load_cfg($absPath)) {
			header("HTTP/1.0 400 Bad Request");
			echo "Value of POST key \"folder\" is not a valid folder (was \"".$_POST["folder"]."\").";
		}
	} else {
		header("HTTP/1.0 400 Bad Request");
		echo "Required POST key \"folder\" not defined.";
	}
?>