from PIL import Image
from realesrgan import RealESRGAN

model = RealESRGAN('cuda')  # or 'cpu'
model.load_weights('RealESRGAN_x4.pth')

img = Image.open('9201.webp')
sr_img = model.predict(img)
sr_img.save('restored_image.png')
