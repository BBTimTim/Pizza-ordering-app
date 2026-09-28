<?php

namespace App\Console\Commands;

use App\Models\Product;
use App\Services\ImageOptimizer;
use Illuminate\Console\Command;

class OptimizeImages extends Command
{
    protected $signature = 'images:optimize';

    protected $description = 'A meglévő termékképek átméretezése és WebP-be alakítása (az adatbázist is frissíti)';

    public function handle(ImageOptimizer $optimizer): int
    {
        if (! function_exists('imagewebp')) {
            $this->error('A PHP GD bővítménye WebP támogatással nem elérhető.');

            return self::FAILURE;
        }

        $directory = public_path('uploads/products');

        Product::whereNotNull('image')->where('image', 'not like', '%.webp')->each(function (Product $product) use ($optimizer, $directory) {
            $path = $directory.'/'.$product->image;
            if (! is_file($path)) {
                $this->warn("Hiányzó fájl: {$product->image}");

                return;
            }

            $before = filesize($path);
            $newName = $optimizer->optimize($directory, $product->image);
            $after = is_file($directory.'/'.$newName) ? filesize($directory.'/'.$newName) : $before;

            $product->update(['image' => $newName]);
            $this->line(sprintf('%-28s %8.1f MB → %6.0f KB  (%s)', $product->name, $before / 1048576, $after / 1024, $newName));
        });

        $this->info('Kész.');

        return self::SUCCESS;
    }
}
