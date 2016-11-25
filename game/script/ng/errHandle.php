<?php
	function errHandle() {
		$lastError = error_get_last();
		if ($lastError && $lastError["type"] === E_ERROR) {
			header("HTTP/1.0 500 Internal Server Error");
		}
	}
	register_shutdown_function("errHandle");
?>