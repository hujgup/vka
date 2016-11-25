<?php
	require_once("../errHandle.php");

	if (isset($_POST["folder"])) {
		$path = "../../../".urldecode($_POST["folder"]);
		if (file_exists($path)) {
			$i = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($path));
			foreach ($i as $value) {
				if ($value !== "." && $value !== "..") {
					$info = pathinfo($value);
					if ($info["extension"] === "cfg") {
						echo file_get_contents($value)."\n";
					}
				}
			}
		} else {
			header("HTTP/1.0 400 Bad Request");
			echo "Value of POST key \"folder\" is not a valid folder (was \"".$_POST["folder"]."\").";
		}
	} else {
		header("HTTP/1.0 400 Bad Request");
		echo "Required POST key \"folder\" not defined.";
	}
?>