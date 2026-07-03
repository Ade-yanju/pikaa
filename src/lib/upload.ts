import "server-only";

// Uploads a chat image to Cloudinary (primary) and falls back to ImgBB.
// Returns the hosted URL, or throws if neither is configured/succeeds.

type UploadResult = { url: string; provider: "cloudinary" | "imgbb" };

async function toCloudinary(file: File): Promise<string | null> {
  const cloud = process.env.CLOUDINARY_CLOUD_NAME;
  const preset = process.env.CLOUDINARY_UPLOAD_PRESET;
  if (!cloud || !preset) return null;

  const form = new FormData();
  form.append("file", file);
  form.append("upload_preset", preset);

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloud}/image/upload`,
    { method: "POST", body: form },
  );
  if (!res.ok) {
    console.error("Cloudinary upload failed:", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { secure_url?: string };
  return data.secure_url ?? null;
}

async function toImgBB(file: File): Promise<string | null> {
  const key = process.env.IMGBB_API_KEY;
  if (!key) return null;

  // ImgBB expects base64 in a multipart "image" field.
  const base64 = Buffer.from(await file.arrayBuffer()).toString("base64");
  const form = new FormData();
  form.append("image", base64);

  const res = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
    method: "POST",
    body: form,
  });
  if (!res.ok) {
    console.error("ImgBB upload failed:", res.status, await res.text());
    return null;
  }
  const data = (await res.json()) as { data?: { url?: string } };
  return data.data?.url ?? null;
}

export async function uploadImage(file: File): Promise<UploadResult> {
  const viaCloudinary = await toCloudinary(file);
  if (viaCloudinary) return { url: viaCloudinary, provider: "cloudinary" };

  const viaImgBB = await toImgBB(file);
  if (viaImgBB) return { url: viaImgBB, provider: "imgbb" };

  throw new Error(
    "Image upload failed — configure CLOUDINARY_* or IMGBB_API_KEY.",
  );
}
