import heic2any from "heic2any";
import EXIF from "exif-js";

function getOrientation(file) {
  return new Promise((resolve) => {
    EXIF.getData(file, function () {
      const orientation = EXIF.getTag(this, "Orientation");
      resolve(orientation || 1);
    });
  });
}

function drawImageWithOrientation(ctx, img, orientation, width, height) {
  switch (orientation) {
    case 2: ctx.transform(-1, 0, 0, 1, width, 0); break; // horizontal flip
    case 3: ctx.transform(-1, 0, 0, -1, width, height); break; // 180°
    case 4: ctx.transform(1, 0, 0, -1, 0, height); break; // vertical flip
    case 5: ctx.transform(0, 1, 1, 0, 0, 0); break; // transpose
    case 6: ctx.transform(0, 1, -1, 0, height, 0); break; // 90° CW
    case 7: ctx.transform(0, -1, -1, 0, height, width); break; // transverse
    case 8: ctx.transform(0, -1, 1, 0, 0, width); break; // 90° CCW
    default: break; // normal
  }
  ctx.drawImage(img, 0, 0, width, height);
}

/**
 * Конвертирует файл изображения в webp (если возможно), учитывая EXIF-ориентацию.
 * Возвращает Blob webp-изображения.
 */

async function blobToImage(blob) {
  return await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = URL.createObjectURL(blob);
  });
}

function resizeAndConvertToWebp(img, orientation) {
  return new Promise((resolve, reject) => {
    let width = img.width;
    let height = img.height;

    if ([5, 6, 7, 8].includes(orientation)) {
      [width, height] = [height, width];
    }

    const maxSize = 1200;
    if (width > maxSize || height > maxSize) {
      const scale = Math.min(maxSize / width, maxSize / height);
      width = Math.round(width * scale);
      height = Math.round(height * scale);
    }

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    drawImageWithOrientation(ctx, img, orientation, width, height);

    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Не удалось сконвертировать в webp"));
      },
      "image/webp",
      0.8
    );
  });
}

export async function convertToWebp(file) {
  // HEIC/HEIF
  console.log("TYPE:", file.type);
  console.log("NAME:", file.name);

  if (
    file.type === "image/heic" ||
    file.type === "image/heif" ||
    file.name.endsWith(".heic") ||
    file.name.endsWith(".HEIC")
  ) {
    try {
      const webpBlob = await heic2any({
        blob: file,
        toType: "image/webp",
        quality: 0.8,
      });

      const imageBitmap = await blobToImage(webpBlob);
      const orientation = await getOrientation(file); // исходный HEIC всё ещё содержит EXIF
      const resizedBlob = await resizeAndConvertToWebp(imageBitmap, orientation);

      return resizedBlob;
    } catch (e) {
      alert("Не удалось конвертировать HEIC/HEIF. Попробуйте другое фото.");
      throw e;
    }
  }

  // Остальные форматы (jpeg, png и т.д.) с учётом EXIF-ориентации
  return await new Promise((resolve, reject) => {
    getOrientation(file).then((orientation) => {
      const reader = new FileReader();
      reader.onload = function (event) {
        const img = new window.Image();
        img.onload = function () {
          let width = img.width;
          let height = img.height;
          // Для поворота на 90/270 градусов меняем местами ширину и высоту
          if ([5, 6, 7, 8].includes(orientation)) {
            [width, height] = [height, width];
          }

          const maxSize = 1200; // Максимальный размер по ширине или высоте
          if (width > maxSize || height > maxSize) {
            const scale = Math.min(maxSize / width, maxSize / height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }

          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          // drawImageWithOrientation(ctx, img, orientation, img.width, img.height);
          drawImageWithOrientation(ctx, img, orientation, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error("Не удалось конвертировать в webp"));
            },
            "image/webp",
            0.8
          );
        };
        img.onerror = reject;
        img.src = event.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  });
} 