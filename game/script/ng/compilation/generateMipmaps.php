<?php
	require_once("../errHandle.php");

	define("USER_PATH",__DIR__."/../../../gfx/app/");
	define("MIPMAP_PATH",__DIR__."/../../../gfx/ng/mipmaps/");

	abstract class Table {
		const ENTRY_SPLIT = "\r\n";
		const COMPONENT_SPLIT = "|";		
		private static $PATH = NULL;
		private $_changed = NULL;
		private $_map = NULL;
		protected abstract function transformValue(&$value);
		protected function build($contents) {
			$this->_map = [];
			if ($contents !== "") {
				$contents = explode(self::ENTRY_SPLIT,$contents);
				foreach ($contents as $entry) {
					list($key,$value) = explode(self::COMPONENT_SPLIT,$entry);
					$this->set($key,$value);
				}

			}
			$this->_changed = FALSE;
		}
		public function isDefined($key) {
			return array_key_exists($key,$this->_map);
		}
		public function get($key) {
			return $this->isDefined($key) ? $this->_map[$key] : NULL;
		}
		public function set($key,$value) {
			$this->transformValue($value);
			$this->_map[$key] = $value;
			$this->_changed = TRUE;
		}
		public function unsetEntry($key) {
			unset($this->_map[$key]);
			$this->_changed = TRUE;
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
		public function hasChanged() {
			return $this->_changed;
		}
		public function export() {
			$transformed = array_map(function($key,$value) {
				return $key.self::COMPONENT_SPLIT.$value;
			},array_keys($this->_map),$this->_map);
			return implode(self::ENTRY_SPLIT,$transformed);
		}
		public function export_to_file($path) {
			file_put_contents($path,$this->export());
		}
	}
	class TimeTable extends Table {
		const FILENAME = "times.txt";
		public function __construct($str) {
			parent::build($str);
		}
		public static function fromFile($path = NULL) {
			$path = $path !== NULL ? $path : self::getStdFile();
			return new TimeTable(file_get_contents($path));
		}
		public static function getStdFile() {
			return MIPMAP_PATH.self::FILENAME;
		}
		protected function transformValue(&$value) {
			$value = intval($value);
		}
	}
	class InterpTable extends Table {
		const FILENAME = "interp.txt";
		public function __construct($str) {
			parent::build($str);
		}
		public static function fromFile($path = NULL) {
			$path = $path !== NULL ? $path : self::getStdFile();
			return new InterpTable(file_get_contents($path));
		}
		public static function getStdFile() {
			return USER_PATH.self::FILENAME;
		}
		protected function transformValue(&$value) {
			$value = $value === "1";
/*
			$value = "IMG_".$value;
			if (!defined($value)) {
				throw new Exception("\"".$value."\" is not a defined constant.");
			}
			$value = constant($value);
*/
		}
	}

	function starts_with($str,$substr) {
		return substr($str,0,strlen($substr)) === $substr;
	}
	function path_consist(&$path) {
		$path = str_replace("\\","/",$path);
	}
	function get_relative_path($from,$to) {
		// Credit to http://stackoverflow.com/a/2638272
		path_consist($from);
		path_consist($to);
		$from = explode("/",$from);
		$to = explode("/",$to);
		$res = $to;
		$fromCount = count($from);
		foreach ($from as $depth => $dir) {
			if ($dir === $to[$depth]) {
				array_shift($res);
			} else {
				$remaining = $fromCount - $depth;
				if ($remaining > 1) {
					$padLength = -(count($res) + remaining - 1);
					$res = array_pad($res,$padLength,"..");
				}
			}
		}
		return implode("/",$res);
	}

	class FileInfo {
		public $fullPath = NULL;
		public $relativePath = NULL;
		public $basename = NULL;
		public $filename = NULL;
		public $extension = NULL;
		public $isDir = NULL;
		public $isDot = NULL;
		public function __construct($fullPathToFile,$relativeRoot) {
			$info = pathinfo($fullPathToFile);
			$this->fullPath = $info["dirname"]."/";
			path_consist($this->fullPath);
			$this->relativePath = get_relative_path($relativeRoot,$this->fullPath);
			$this->basename = $info["basename"];
			$this->filename = $info["filename"];
			$this->isDir = $this->basename === $this->filename;
			if ($this->isDir) {
				$this->extension = "";
			} else {
				$this->extension = $info["extension"];
			}
			$this->isDot = $this->basename === "." || $this->basename === "..";
		}
	}

	function interp_method_to_string($mthd) {
		switch ($mthd) {
			case IMG_BELL:
				$mthd = "BELL";
				break;
			case IMG_BESSEL:
				$mthd = "BESSEL";
				break;
			case IMG_BICUBIC:
				$mthd = "BICUBIC";
				break;
			case IMG_BICUBIC_FIXED:
				$mthd = "BICUBIC_FIXED";
				break;
			case IMG_BILINEAR_FIXED:
				$mthd = "BILINEAR_FIXED";
				break;
			case IMG_BLACKMAN:
				$mthd = "BLACKMAN";
				break;
			case IMG_BOX:
				$mthd = "BOX";
				break;
			case IMG_BSPLINE:
				$mthd = "BSPLINE";
				break;
			case IMG_CATMULLROM:
				$mthd = "CATMULLROM";
				break;
			case IMG_GAUSSIAN:
				$mthd = "GAUSSIAN";
				break;
			case IMG_GENERALIZED_CUBIC:
				$mthd = "GENERALIZED_CUBIC";
				break;
			case IMG_HERMITE:
				$mthd = "HERMITE";
				break;
			case IMG_HAMMING:
				$mthd = "HAMMING";
				break;
			case IMG_HANNING:
				$mthd = "HANNING";
				break;
			case IMG_MITCHELL:
				$mthd = "MITCHELL";
				break;
			case IMG_POWER:
				$mthd = "POWER";
				break;
			case IMG_QUADRATIC:
				$mthd = "QUADRATIC";
				break;
			case IMG_SINC:
				$mthd = "SINC";
				break;
			case IMG_NEAREST_NEIGHBOUR:
				$mthd = "NEAREST_NEIGHBOUR";
				break;
			case IMG_WEIGHTED4:
				$mthd = "WEIGHTED4";
				break;
			case IMG_TRIANGLE:
				$mthd = "TRIANGLE";
				break;
		}
		return $mthd;
	}

	$mipmaps = [];
	function create_mipmap($fileInfo,&$interps) {
		global $mipmaps;

		$filename = $fileInfo->relativePath.$fileInfo->basename;
		$userPath = USER_PATH.$filename;
		$mipmapPath = MIPMAP_PATH.$filename;
		$ext = $fileInfo->extension;
		$sourceImg = NULL;
		if ($ext === "png") {
			$sourceImg = imagecreatefrompng($userPath);
		} else {
			throw new Exception("File '".$userPath."': unsupported file format '".$ext."'. Source file must be a .png file.");
		}

		$useResampling = $interps->isDefined($filename) ? $interps->get($filename) : FALSE;
		imagealphablending($sourceImg,FALSE);
		imagesavealpha($sourceImg,TRUE); // Use full-range transparancy (instead of true/false)

		$sourceWidth = imagesx($sourceImg);
		$sourceHeight = imagesy($sourceImg);
		$mipmapWidth = $sourceWidth + $sourceWidth/2;
		$mipmapHeight = $sourceHeight;

		$mipmapImg = imagecreatetruecolor($mipmapWidth,$mipmapHeight);
		imagealphablending($mipmapImg,FALSE);
		imagesavealpha($mipmapImg,TRUE);
		// Transparent background
		$bgCol = imagecolorallocatealpha($mipmapImg,0,0,0,127);
		imagefilledrectangle($mipmapImg,0,0,$mipmapWidth - 1,$mipmapHeight - 1,$bgCol);
		$interpolationMethod = IMG_SINC;
		if ($useResampling) {
			imagesetinterpolation($sourceImg,$interpolationMethod);
			imagesetinterpolation($mipmapImg,$interpolationMethod);
			imagecopyresampled($mipmapImg,$sourceImg,0,0,0,0,$sourceWidth,$sourceHeight,$sourceWidth,$sourceHeight);
		} else {
			imagecopyresized($mipmapImg,$sourceImg,0,0,0,0,$sourceWidth,$sourceHeight,$sourceWidth,$sourceHeight);
		}

		$targetX = $mipmapWidth - $mipmapWidth/3;
		$targetY = 0;
		$targetWidth = $sourceWidth/2;
		$targetHeight = $sourceHeight/2;
		$currentMipmap = NULL;
		while ($targetWidth >= 1 && $targetHeight >= 1) {
			$currentMipmap = imagecreatetruecolor($targetWidth,$targetHeight);
			imagealphablending($currentMipmap,FALSE);
			imagesavealpha($currentMipmap,TRUE);
			imagecolorallocate($mipmapImg,0,255,0);
			if ($useResampling) {
				imagesetinterpolation($currentMipmap,$interpolationMethod);
				imagecopyresampled($currentMipmap,$sourceImg,0,0,0,0,$targetWidth,$targetHeight,$sourceWidth,$sourceHeight);
			} else {
				imagecopyresized($currentMipmap,$sourceImg,0,0,0,0,$targetWidth,$targetHeight,$sourceWidth,$sourceHeight);
			}
			imagecopy($mipmapImg,$currentMipmap,$targetX,$targetY,0,0,$targetWidth,$targetHeight);

			$targetY += $targetHeight;
			$targetWidth /= 2;
			$targetHeight /= 2;
			imagedestroy($currentMipmap);
		}

		$mipmaps[$filename] = $mipmapImg;
		imagedestroy($sourceImg);
	}
	function flush_mipmaps(&$times) {
		global $mipmaps;

		foreach ($mipmaps as $name => $image) {
			$path = MIPMAP_PATH.$name;
			$dir = dirname($path);
			if (!file_exists($dir)) {
				mkdir($dir,0777,TRUE);
			}
			imagepng($image,$path,9);
			imagedestroy($image);
			$times->set($name,filemtime($path));
		}
		$mipmaps = [];
	}

	$times = TimeTable::fromFile();
	$interps = InterpTable::fromFile();
	$interpModTime = filemtime(InterpTable::getStdFile());
	$seenMipmaps = [];
	// For each file in mipmaps folder:
	$i = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(MIPMAP_PATH));
	foreach ($i as $fileInfo) {
		$fileInfo = new FileInfo($fileInfo,MIPMAP_PATH);
		if (!$fileInfo->isDot && !$fileInfo->isDir) {
			$filename = $fileInfo->relativePath.$fileInfo->basename;
			if ($filename !== TimeTable::FILENAME) {
				$seenMipmaps[] = $filename;
				if ($times->isDefined($filename)) {
					if (file_exists(USER_PATH.$filename)) {
						$modTime = filemtime(USER_PATH.$filename);
						$mipmapModTime = filemtime(MIPMAP_PATH.$filename);
						if ($times->get($filename) < $modTime || ($interpModTime >= $mipmapModTime && $interps->isDefined($filename))) {
							// File or interpolation was changed
							create_mipmap($fileInfo,$interps);
						}
					} else {
						// File was deleted
						unlink(MIPMAP_PATH.$filename);
						$times->unsetEntry($filename);
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
	$i = new RecursiveIteratorIterator(new RecursiveDirectoryIterator(USER_PATH));
	foreach ($i as $fileInfo) {
		$fileInfo = new FileInfo($fileInfo,USER_PATH);
		if (!$fileInfo->isDot && !$fileInfo->isDir) {
			$filename = $fileInfo->relativePath.$fileInfo->basename;
			if ($filename !== TimeTable::FILENAME) {
				if ($filename !== InterpTable::FILENAME) {
					// If image was not found by looping through mipmap files, and is not the interp file
					if (!in_array($filename,$seenMipmaps)) {
						create_mipmap($fileInfo,$interps);
					}
				}
			} else {
				// Filename is reserved, cannot continue
				throw new Exception("Illegal user-specified filename '".$filename."' - that name is reserved by the system.");
			}
		}
	}
	flush_mipmaps($times);
	if ($times->hasChanged()) {
		var_dump(TimeTable::getStdFile());
		$times->export_to_file(TimeTable::getStdFile());
	}
?>