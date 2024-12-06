from PIL import Image

# Open the PNG image
img = Image.open('Z:/1Dog/(1)/Pawspace/screenshots/Screenshot 2024-11-30 223005.png')

# Convert and save as JPEG
img.convert('RGB').save('Z:/1Dog/(1)/Pawspace/screenshots/Screenshot 2024-11-30 223005.jpg', 'JPEG')
