<?php

namespace App\Services;

use Illuminate\Support\Facades\File;

/**
 * Termékképek optimalizálása: legfeljebb 1200 px széles, WebP formátum.
 * Egy 20 MB-os PNG így jellemzően pár száz kilobájt lesz, és az oldal sokkal gyorsabban tölt.
 */
class ImageOptimizer
{
    public const MAX_WIDTH = 1200;

    public const QUALITY = 80;

    /**
     * Átalakítja a képet, és visszaadja az új fájlnevet (.webp).
     * Ha a szerveren nincs GD, vagy a fájl nem olvasható kép (pl. SVG), az eredeti marad.
     */
    public function optimize(string $directory, string $fileName): string
    {
        $path = $directory.'/'.$fileName;

        if (! function_exists('imagewebp') || ! is_file($path)) {
            return $fileName;
        }

        $image = @imagecreatefromstring((string) file_get_contents($path));
        if ($image === false) {
            return $fileName;
        }

        $width = imagesx($image);
        $height = imagesy($image);

        if ($width > self::MAX_WIDTH) {
            $newHeight = (int) round($height * self::MAX_WIDTH / $width);
            $resized = imagecreatetruecolor(self::MAX_WIDTH, $newHeight);
            imagealphablending($resized, false);
            imagesavealpha($resized, true);
            imagecopyresampled($resized, $image, 0, 0, 0, 0, self::MAX_WIDTH, $newHeight, $width, $height);
            imagedestroy($image);
            $image = $resized;
        } else {
            // A WebP-hez „truecolor” kép kell (a palettás PNG-t át kell alakítani)
            imagepalettetotruecolor($image);
            imagealphablending($image, false);
            imagesavealpha($image, true);
        }

        $newName = pathinfo($fileName, PATHINFO_FILENAME).'.webp';
        imagewebp($image, $directory.'/'.$newName, self::QUALITY);
        imagedestroy($image);

        if ($newName !== $fileName) {
            File::delete($path);
        }

        return $newName;
    }
}
