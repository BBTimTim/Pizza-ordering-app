<?php

namespace Tests\Unit;

use App\Services\ImageOptimizer;
use Tests\TestCase;

class ImageOptimizerTest extends TestCase
{
    public function test_large_images_are_resized_and_converted_to_webp(): void
    {
        if (! function_exists('imagewebp')) {
            $this->markTestSkipped('A PHP GD bővítménye (WebP) nem elérhető.');
        }

        $directory = sys_get_temp_dir().'/image-optimizer-test';
        @mkdir($directory);
        $image = imagecreatetruecolor(2400, 1200);
        imagepng($image, $directory.'/pizza.png');
        imagedestroy($image);

        $newName = (new ImageOptimizer)->optimize($directory, 'pizza.png');

        $this->assertSame('pizza.webp', $newName);
        $this->assertFileDoesNotExist($directory.'/pizza.png');
        [$width, $height] = getimagesize($directory.'/pizza.webp');
        $this->assertSame([1200, 600], [$width, $height]);

        unlink($directory.'/pizza.webp');
    }

    public function test_non_image_files_are_left_untouched(): void
    {
        $directory = sys_get_temp_dir();
        file_put_contents($directory.'/logo.svg', '<svg xmlns="http://www.w3.org/2000/svg"/>');

        $this->assertSame('logo.svg', (new ImageOptimizer)->optimize($directory, 'logo.svg'));
        $this->assertFileExists($directory.'/logo.svg');

        unlink($directory.'/logo.svg');
    }
}
