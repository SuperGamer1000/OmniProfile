from PIL import Image

def remove_background(img_path):
    img = Image.open(img_path).convert("RGBA")
    data = img.getdata()
    
    new_data = []
    for item in data:
        lum = int(0.299 * item[0] + 0.587 * item[1] + 0.114 * item[2])
        new_data.append((0, 0, 0, 255 - lum))
        
    img.putdata(new_data)
    img.save(img_path, "PNG")

if __name__ == "__main__":
    remove_background("brain-line-art.png")
