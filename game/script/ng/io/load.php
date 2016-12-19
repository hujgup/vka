<?php
	require_once("../errHandle.php");

	function read_cfg($path,$ppd) {
		return $ppd." {\r\n".file_get_contents($path)."\r\n}\r\n";
	}
	function load_cfg($absPath) {
		$relPath = "../../../";
		$path = $relPath.$absPath;
		$res = file_exists($path);
		if ($res) {
			$i = new RecursiveIteratorIterator(new RecursiveCallbackFilterIterator(new RecursiveDirectoryIterator($path),function($current,$key,$iterator) {
				$filename = $current->getFilename()[0];
				$res = $filename !== "." && $filename !== "..";
				$path2 = $current->getPathname();
				if ($res && is_file($path2)) {
					$res = pathinfo($path2,PATHINFO_EXTENSION) === "cfg";
				}
				return $res;
			}));
			foreach ($i as $info) {
				$path = str_replace("\\","/",$info->getPathname());
				echo read_cfg($path,str_replace($relPath,"",$path));
			}
		}
		return $res;
	}
?>