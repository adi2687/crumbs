import os
from PIL import Image
import subprocess

IMAGE_EXTS = ['.jpg', '.jpeg', '.png']
VIDEO_EXTS = ['.mp4', '.mov', '.avi', '.mkv']

INPUT_DIR = 'media'
OUTPUT_DIR = 'compressed'
MAX_IMAGE_WIDTH = 1280
MAX_IMAGE_HEIGHT = 1280
MAX_VIDEO_WIDTH = 1280
MAX_VIDEO_HEIGHT = 720

os.makedirs(OUTPUT_DIR, exist_ok=True)

def format_size(bytes):
    for unit in ['B', 'KB', 'MB', 'GB']:
        if bytes < 1024:
            return f"{bytes:.2f} {unit}"
        bytes /= 1024
    return f"{bytes:.2f} TB"

def resize_if_needed(img: Image.Image):
    width, height = img.size
    if width > MAX_IMAGE_WIDTH or height > MAX_IMAGE_HEIGHT:
        img.thumbnail((MAX_IMAGE_WIDTH, MAX_IMAGE_HEIGHT))
    return img

def compress_image(img_path, output_path, format="webp", quality=80,totoal_size=0):
    try:
        original_size = os.path.getsize(img_path)

        img = Image.open(img_path)
        img = resize_if_needed(img)
        img.save(output_path, format=format, quality=quality, optimize=True)

        new_size = os.path.getsize(output_path)
        saved = original_size - new_size
        percent = (saved / original_size) * 100
        totoal_size += saved
        print(f"[✓] Compressed image: {img_path} → {output_path}")
        print(f"    [💾] Saved: {format_size(saved)} ({percent:.2f}%)")
        print(f"    [📦] New Size: {format_size(new_size)} (was {format_size(original_size)})")

    except Exception as e:
        print(f"[x] Error compressing {img_path}: {e}")

def get_video_resolution(video_path):
    cmd = [
        'ffprobe', '-v', 'error', '-select_streams', 'v:0',
        '-show_entries', 'stream=width,height',
        '-of', 'csv=s=x:p=0', video_path
    ]
    result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL)
    res = result.stdout.decode().strip()
    if 'x' in res:
        width, height = map(int, res.split('x'))
        return width, height
    return None, None

def compress_video(video_path, output_path, crf=28):
    try:
        original_size = os.path.getsize(video_path)

        width, height = get_video_resolution(video_path)

        scale_filter = ""
        if width and height:
            if width > MAX_VIDEO_WIDTH or height > MAX_VIDEO_HEIGHT:
                scale_filter = f"-vf scale='min({MAX_VIDEO_WIDTH},iw)':'min({MAX_VIDEO_HEIGHT},ih)':force_original_aspect_ratio=decrease"

        cmd = [
            "ffmpeg", "-y", "-i", video_path,
            *scale_filter.split(),
            "-vcodec", "libx265", "-crf", str(crf),
            "-acodec", "aac", output_path
        ]
        subprocess.run(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

        new_size = os.path.getsize(output_path)
        saved = original_size - new_size
        percent = (saved / original_size) * 100

        print(f"[✓] Compressed video: {video_path} → {output_path}")
        print(f"    [💾] Saved: {format_size(saved)} ({percent:.2f}%)")
        print(f"    [📦] New Size: {format_size(new_size)} (was {format_size(original_size)})")

    except Exception as e:
        print(f"[x] Error compressing {video_path}: {e}")

# Main loop
for filename in os.listdir(INPUT_DIR):
    name, ext = os.path.splitext(filename)
    file_path = os.path.join(INPUT_DIR, filename)

    if ext.lower() in IMAGE_EXTS:
        output_file = os.path.join(OUTPUT_DIR, f"{name}.webp")
        compress_image(file_path, output_file)

    elif ext.lower() in VIDEO_EXTS:
        output_file = os.path.join(OUTPUT_DIR, f"{name}_compressed.mp4")
        compress_video(file_path, output_file)
