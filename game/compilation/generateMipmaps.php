<?php
	define("USER_PATH","../gfx/app/");
	define("MIPMAP_PATH","../gfx/ng/mipmaps/");

	class TimeTable {
		const ENTRY_SPLIT = "\r\n";
		const COMPONENT_SPLIT = "|";
		const FILENAME = "times.txt";
		private static $PATH = NULL;
		private $_map = NULL;
		public function __construct() {
			if (self::$PATH === NULL) {
				self::$PATH = MIPMAP_PATH.self::FILENAME; // IDK either, PHP is weird
			}
			$contents = file_get_contents(self::$PATH);
			$this->_map = [];
			if ($contents !== "") {
				$contents = explode(self::ENTRY_SPLIT,$contents);
				foreach ($contents as $entry) {
					list($filename,$modTime) = explode(self::COMPONENT_SPLIT,$entry);
					$this->setModTime($filename,$modTime);
				}
			}
		}
		public function isDefined($filename) {
			return array_key_exists($filename,$this->_map);
		}
		public function getModTime($filename) {
			return $this->isDefined($filename) ? $this->_map[$filename] : NULL;
		}
		public function setModTime($filename,$modTime) {
			$this->_map[$filename] = intval($modTime);
		}
		public function unsetEntry($filename) {
			unset($this->_map[$filename]);
		}
		public function difference(&$arr) {
			$res = [];
			foreach ($this->_map as $key => $value) {
				if (!in_array($key,$arr)) {
					$res[$key] = $value;
				}
			}
			return $res;
		}
		public function export() {
			$transformed = array_map(function($key,$value) {
				return $key.self::COMPONENT_SPLIT.$value;
			},array_keys($this->_map),$this->_map);
			file_put_contents(self::$PATH,implode(self::ENTRY_SPLIT,$transformed));
		}
	}

	$mipmaps = [];
	function create_mipmap($fileInfo,&$times) {
		global $mipmaps;

		$filename = $fileInfo->getFilename();
		$userPath = USER_PATH.$filename;
		$mipmapPath = MIPMAP_PATH.$filename;
		$ext = $fileInfo->getExtension();
		$sourceImg = NULL;
		if ($ext === "png") {
			$sourceImg = imagecreatefrompng($userPath);
		} else {
			throw new Exception("File '".$filename."': unsupported file format '".$ext."'. Source file must be a .png file.");
		}
		imagesavealpha($sourceImg,TRUE);

		$sourceWidth = imagesx($sourceImg);
		$sourceHeight = imagesy($sourceImg);
		$mipmapWidth = 4*$sourceWidth/3;
		$mipmapHeight = $sourceHeight;

		$mipmapImg = imagecreatetruecolor($mipmapWidth,$mipmapHeight);
		imagesavealpha($mipmapImg,TRUE);
		imagecolorallocate($mipmapImg,0,255,0);
		$interpolationMethod = IMG_BICUBIC;
		imagesetinterpolation($mipmapImg,$interpolationMethod);
		imagecopyresampled($mipmapImg,$sourceImg,0,0,0,0,$sourceWidth,$sourceHeight,$sourceWidth,$sourceHeight);

		$targetX = $mipmapWidth/2;
		$targetY = 0;
		$targetWidth = $sourceWidth/2;
		$targetHeight = $sourceHeight/2;
		$lastMipmap = $sourceImg;
		$currentMipmap = NULL;
		while ($targetWidth >= 1 && $targetHeight >= 1) {
			$currentMipmap = imagecreatetruecolor($targetWidth,$targetHeight);
			imagesavealpha($currentMipmap,TRUE);
			imagecolorallocate($mipmapImg,0,255,0);
			imagesetinterpolation($currentMipmap,$interpolationMethod);
			$lastWidth = imagesx($lastMipmap);
			$lastHeight = imagesy($lastMipmap);
			imagecopyresampled($currentMipmap,$lastMipmap,0,0,0,0,$targetWidth,$targetHeight,$lastWidth,$lastHeight);
			imagecopy($mipmapImg,$currentMipmap,$targetX,$targetY,0,0,$targetWidth,$targetHeight);

			$targetY += $targetHeight;
			$targetWidth /= 2;
			$targetHeight /= 2;
			imagedestroy($lastMipmap);
			$lastMipmap = $currentMipmap;
		}

		$mipmaps[$filename] = $mipmapImg;
		imagedestroy($sourceImg);
		if ($currentMipmap !== NULL) {
			imagedestroy($currentMipmap);
		}
	}
	function flush_mipmaps() {
		global $mipmaps;
		foreach ($mipmaps as $name => $image) {
			imagepng($image,$name,9);
			imagedestroy($image);
		}
		$mipmaps = [];
	}

	$times = new TimeTable();
	$seenMipmaps = [];
	// For each file in mipmaps folder:
	$i = new DirectoryIterator(MIPMAP_PATH);
	foreach ($i as $fileInfo) {
		if (!$fileInfo->isDot()) {
			$filename = $fileInfo->getFilename();
			if ($filename !== TimeTable::FILENAME) {
				$seenMipmaps[] = $filename;
				if ($times->isDefined($filename)) {
					$modTime = filemtime($fileInfo->getPathname());
					// If file has changed
					if ($times->getModTime($filename) !== $modTime) {
						create_mipmap($fileInfo,$times);
					}
				} else {
					// File is in mipmaps but not time map - possible erronous manual file editing
					throw new Exception("File '".$filename."' exists in mipmaps folder but had no entry in '".TimeTable::FILENAME."'. Did you modify the file manually?");
				}
			}
		}
	}
	// Any entry in times that was not found by looping through mipmap
	// files should be deleted
	$diff = $times->difference($seenMipmaps);
	foreach ($diff as $key => $value) {
		$times->unsetEntry($key);
	}
	// For each file in user images folder:
	$i = new DirectoryIterator(USER_PATH);
	foreach ($i as $fileInfo) {
		if (!$fileInfo->isDot()) {
			$filename = $fileInfo->getFilename();
			if ($filename !== TimeTable::FILENAME) {
				// If image was not found by looping through mipmap files
				if (!in_array($filename,$seenMipmaps)) {
					create_mipmap($fileInfo,$times);
				}
			} else {
				// Filename is reserved, cannot continue
				throw new Exception("Illegal user-specified filename '".$filename."' - that name is reserved by the system.");
			}
		}
	}
	flush_mipmaps();
	$times->export();
?>