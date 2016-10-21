<?php
	if (isset($_POST["lang"])) {
		$path = "../../../localization/".urldecode($_POST["lang"]);
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
		echo "lang not defined.";
	}
?>