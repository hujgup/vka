<?php
	require_once("load.php");

	if (isset($_POST["lang"])) {
		$absPath = "localization/".urldecode($_POST["lang"]);
		load_cfg($absPath);
	} else {
		header("HTTP/1.0 400 Bad Request");
		echo "lang not defined.";
	}
?>