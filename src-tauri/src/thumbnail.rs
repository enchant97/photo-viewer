#[cfg(feature = "thumbnail_native")]
mod thumbnail_native {
    use image::io::Reader as ImageReader;
    use image::ImageFormat;
    use std::io::Cursor;
    use std::path::PathBuf;

    /// Return JPEG thumbnail using image (rust native)
    pub fn create_img_thumbnail(file_path: PathBuf, new_size: u32) -> Vec<u8> {
        let img = ImageReader::open(file_path).unwrap().decode().unwrap();
        let img = img.thumbnail(new_size, new_size);
        let mut bytes: Vec<u8> = Vec::new();
        img.write_to(&mut Cursor::new(&mut bytes), ImageFormat::Jpeg)
            .unwrap();
        bytes
    }
}

#[cfg(feature = "thumbnail_magick")]
mod thumbnail_magick {
    use magick_rust::{magick_wand_genesis, MagickWand};
    use std::path::PathBuf;
    use std::sync::Once;

    static MAGIC_START: Once = Once::new();

    /// Return JPEG thumbnail using imagemagick
    pub fn create_img_thumbnail(file_path: PathBuf, new_size: u32) -> Vec<u8> {
        MAGIC_START.call_once(|| {
            magick_wand_genesis();
        });

        let new_size = new_size as usize;

        let wand = MagickWand::new();
        wand.read_image(file_path.as_os_str().to_str().unwrap())
            .unwrap();
        wand.thumbnail_image(new_size, new_size);
        let blob = wand.write_image_blob("jpeg").unwrap();
        blob
    }
}

use std::path::PathBuf;

/// Returns a JPEG thumbnail from given image path,
#[allow(unused_variables)]
pub fn create_img_thumbnail(file_path: PathBuf, new_size: u32) -> Vec<u8> {
    #[cfg(all(feature = "thumbnail_native", feature = "thumbnail_magick"))]
    compile_error!("cannot enable multiple thumbnail features");
    #[cfg(feature = "thumbnail_native")]
    return thumbnail_native::create_img_thumbnail(file_path, new_size);
    #[cfg(feature = "thumbnail_magick")]
    return thumbnail_magick::create_img_thumbnail(file_path, new_size);
}
