from PIL import Image
import os

# Ρυθμίσεις
input_folder = "logo"         # Όνομα φακέλου με τις εικόνες
output_file = "sprite_sheet.png"
cols, rows = 6, 6               # Sprite διάταξη 6x6
prefix = "logo_"               # Prefix του ονόματος αρχείου
ext = ".png"                   # Επέκταση αρχείου

# Φόρτωσε τις εικόνες
images = []
i=0
for i in range(cols * rows):
    path = os.path.join(input_folder, f"{prefix}{i}{ext}")
    if os.path.exists(path):
        img = Image.open(path).convert("RGBA")
        images.append(img)
    else:
        raise FileNotFoundError(f"Λείπει η εικόνα: {path}")

# Υπολογισμός τελικών διαστάσεων
img_width, img_height = images[0].size
sprite_width = cols * img_width
sprite_height = rows * img_height

# Δημιουργία του sprite sheet
sprite_sheet = Image.new("RGBA", (sprite_width, sprite_height))

# Τοποθέτηση εικόνων
for index, img in enumerate(images):
    x = (index % cols) * img_width
    y = (index // cols) * img_height
    sprite_sheet.paste(img, (x, y))

# Αποθήκευση
sprite_sheet.save(output_file)
print(f"✅ Το sprite sheet αποθηκεύτηκε ως '{output_file}' ({sprite_width}x{sprite_height}px)")
