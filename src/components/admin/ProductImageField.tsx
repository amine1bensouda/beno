"use client";

import { useRef, useState } from "react";
import { uploadProductImage } from "@/actions/admin";

type ProductImageFieldProps = {
  name?: string;
  defaultValue?: string;
  availableImages: string[];
};

export function ProductImageField({
  name = "image",
  defaultValue = "",
  availableImages,
}: ProductImageFieldProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [image, setImage] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setUploadError("");

    const formData = new FormData();
    formData.append("file", file);

    const result = await uploadProductImage(formData);

    setUploading(false);
    e.target.value = "";

    if (!result.success) {
      setUploadError(result.error || "Échec de l'upload.");
      return;
    }

    setImage(result.url);
  }

  return (
    <div className="space-y-4">
      <input type="hidden" name={name} value={image} required />

      <div>
        <span className="mb-2 block text-sm font-semibold text-slate-700">Photo du produit *</span>

        {image ? (
          <div className="mb-3 flex items-start gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt="Aperçu"
              className="h-32 w-32 rounded-xl border border-slate-200 bg-slate-50 object-cover"
            />
            <div className="min-w-0 flex-1">
              <p className="break-all text-xs text-slate-500">{image}</p>
              <button
                type="button"
                onClick={() => setImage("")}
                className="mt-2 text-xs font-semibold text-red-600 hover:underline"
              >
                Retirer l&apos;image
              </button>
            </div>
          </div>
        ) : (
          <p className="mb-3 rounded-lg border border-dashed border-slate-200 bg-slate-50 px-4 py-6 text-center text-sm text-slate-400">
            Aucune image sélectionnée
          </p>
        )}

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="rounded-lg bg-beno-blue px-4 py-2 text-sm font-semibold text-white hover:bg-beno-navy disabled:opacity-60"
          >
            {uploading ? "Envoi en cours..." : "Téléverser une photo"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <p className="mt-2 text-xs text-slate-400">
          JPG, PNG, WebP ou GIF — max. 5 Mo. En production, configurez Supabase Storage.
        </p>

        {uploadError && (
          <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">{uploadError}</p>
        )}
      </div>

      {availableImages.length > 0 && (
        <div>
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Choisir une image existante
          </span>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-6">
            {availableImages.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setImage(src)}
                className={`overflow-hidden rounded-lg border-2 transition ${
                  image === src
                    ? "border-beno-blue ring-2 ring-beno-blue/30"
                    : "border-slate-200 hover:border-slate-300"
                }`}
                title={src}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="aspect-square w-full object-cover bg-slate-100" />
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="block">
        <span className="mb-1 block text-xs font-semibold text-slate-500">
          Ou saisir un chemin / URL manuellement
        </span>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="/products/mon-produit.png"
          className="w-full rounded-lg border border-slate-200 px-4 py-2 text-sm"
        />
      </label>
    </div>
  );
}
