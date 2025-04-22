from PIL import Image
import os

# ⚙️ Ρυθμίσεις
sprite_path = "earth_sprite_sheet.png"  # άλλαξε το με το όνομα του αρχείου σου
frame_size = 256
frames_per_row = 6
total_frames = 36
output_dir = "earth_frames"

# 📂 Δημιουργία φακέλου εξόδου
os.makedirs(output_dir, exist_ok=True)

# 📤 Φόρτωση sprite sheet
sprite_sheet = Image.open(sprite_path)

# ✂️ Κόψιμο σε καρέ
for i in range(total_frames):
    row = i // frames_per_row
    col = i % frames_per_row
    left = col * frame_size
    top = row * frame_size
    right = left + frame_size
    bottom = top + frame_size
    frame = sprite_sheet.crop((left, top, right, bottom))
    frame.save(os.path.join(output_dir, f"earth_{i:03d}.png"))

print(f"✅ Έτοιμα τα καρέ στον φάκελο: {output_dir}")
