"use client";

import React, { useState, useRef, useCallback } from "react";
import { createProduct } from "@/lib/admin/actions";
import { upload } from "@vercel/blob/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ColorOption {
  id: string;
  label: string;
  value: string;
}

interface PreviewImage {
  id: string;
  file: File;
  url: string;
}

const MAX_IMAGES = 10;

const Page: React.FC = () => {
  const router = useRouter();

  const [podrzaneBoje, setPodrzaneBoje] = useState<string[]>([]);
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const colors: ColorOption[] = [
    { id: "white", label: "Bijela", value: "BIJELA" },
    { id: "black", label: "Crna", value: "CRNA" },
    { id: "wooden", label: "Uzorak drveta", value: "DRVO" },
  ];

  const handleCheckboxChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const { value, checked } = e.target;
    if (checked) {
      setPodrzaneBoje((prev) => [...prev, value]);
    } else {
      setPodrzaneBoje((prev) => prev.filter((color) => color !== value));
    }
  };

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files);
      const remaining = MAX_IMAGES - images.length;
      if (remaining <= 0) return;

      const toAdd = fileArray
        .filter((f) => f.type.startsWith("image/"))
        .slice(0, remaining)
        .map((file) => ({
          id: `${file.name}-${file.lastModified}-${Math.random()}`,
          file,
          url: URL.createObjectURL(file),
        }));

      setImages((prev) => [...prev, ...toAdd]);
    },
    [images],
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(e.target.files);
      e.target.value = "";
    }
  };

  const removeImage = (id: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.id === id);
      if (removed) URL.revokeObjectURL(removed.url);
      return prev.filter((img) => img.id !== id);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) addFiles(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formElement = e.currentTarget;
    const formData = new FormData(formElement);

    setLoading(true);
    setError("");

    const submitPromise = async () => {
      const uploadedUrls: string[] = [];

      for (const img of images) {
        const uniqueFilename = `${Date.now()}-${img.file.name}`;
        const newBlob = await upload(uniqueFilename, img.file, {
          access: "public",
          handleUploadUrl: "/api/upload",
        });
        uploadedUrls.push(newBlob.url);
      }

      formData.delete("files");
      formData.append("imageUrls", JSON.stringify(uploadedUrls));

      const result = await createProduct(formData);
      if (result?.error) throw new Error(result.error);

      return result;
    };

    toast.promise(submitPromise(), {
      loading: "Učitavanje slika i dodavanje proizvoda...",
      success: () => {
        router.push("/admin/products");
        return "Proizvod uspješno dodan!";
      },
      error: (err) => {
        setLoading(false);
        return err.message || "Greška prilikom dodavanja proizvoda.";
      },
    });
  };

  const canAddMore = images.length < MAX_IMAGES;

  return (
    <section className="flex flex-col gap-8 p-4 sm:p-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-zinc-900">Dodaj Proizvod</h1>
        <p className="text-sm text-amber-600 mt-0.5">
          Popunite sve informacije o novom proizvodu.
        </p>
      </div>
      {error && (
        <div
          className={
            "bg-red-100 border border-red-300 text-[0.9rem] w-full text-red-900 p-3 rounded-sm"
          }
        >
          <p>{error}</p>
        </div>
      )}
      <div>
        <form
          onSubmit={handleSubmit}
          className="animate-fade-down flex flex-col gap-4"
        >
          <input
            type="hidden"
            name={"boje"}
            value={JSON.stringify(podrzaneBoje)}
          />

          <div className="flex flex-col">
            <label
              htmlFor="ime-proizvoda"
              className="font-mono uppercase text-[0.9rem] text-[--primary]"
            >
              Ime proizvoda:
            </label>
            <input
              type="text"
              id="ime"
              name="ime"
              className="border border-black/10 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black/20"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="desc-proizvoda"
              className="font-mono uppercase text-[0.9rem] text-[--primary]"
            >
              Opis proizvoda:
            </label>
            <textarea
              rows={4}
              id="desc-proizvoda"
              name="opis"
              className="border border-black/10 px-4 py-2 focus:outline-none focus:ring-1 focus:ring-black/20"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="category-proizvoda"
              className="font-mono uppercase text-[0.9rem] text-[--primary]"
            >
              Kategorija:
            </label>
            <select
              className="border border-black/10 px-4 py-2 bg-white"
              name="category"
              id="category-proizvoda"
            >
              <option value="STOLOVI">Stolovi</option>
              <option value="POLICE">Police</option>
              <option value="STOLICE">Stolice</option>
              <option value="KOMODE">Komode</option>
              <option value="VRATA">Vrata</option>
            </select>
          </div>

          <div className="flex flex-col">
            <fieldset className="border border-black/10 px-4 py-2">
              <legend className="text-sm font-semibold px-2">
                Odaberite podržane boje:
              </legend>
              <div className="flex flex-col gap-1 mt-2">
                {colors.map((color) => (
                  <div key={color.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id={color.id}
                      value={color.value}
                      checked={podrzaneBoje.includes(color.value)}
                      onChange={handleCheckboxChange}
                      className="cursor-pointer h-4 w-4"
                    />
                    <label
                      htmlFor={color.id}
                      className="cursor-pointer select-none"
                    >
                      {color.label}
                    </label>
                  </div>
                ))}
              </div>
            </fieldset>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="type-wood-proizvoda"
              className="font-mono uppercase text-[0.9rem] text-[--primary]"
            >
              Vrsta drveta:
            </label>
            <select
              className="border border-black/10 px-4 py-2 bg-white"
              name="woodType"
              id="type-wood-proizvoda"
            >
              <option value="HRAST">Hrast</option>
              <option value="BUKVA">Bukva</option>
              <option value="ORAH">Orah</option>
              <option value="JASEN">Jasen</option>
              <option value="TRESNJA">Trešnja</option>
              <option value="BOR">Bor</option>
              <option value="JELA">Jela</option>
              <option value="MEDIJAPAN">Medijapan</option>
              <option value="IVERICA">Iverica</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="dims-proizvoda"
              className="font-mono uppercase text-[0.9rem] text-[--primary]"
            >
              Dimenzije proizvoda:
            </label>
            <input
              type="text"
              id="dims-proizvoda"
              name="dimenzije"
              placeholder="npr. 120x80x75 cm"
              className="border border-black/10 px-4 py-2"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="cijena-proizvoda"
              className="font-mono uppercase text-[0.9rem] text-[--primary]"
            >
              Cijena proizvoda (KM):
            </label>
            <input
              type="number"
              id="cijena-proizvoda"
              name="cijena"
              className="border border-black/10 px-4 py-2"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-mono uppercase text-[0.9rem] text-[--primary]">
                Slike proizvoda:
              </span>
              <span
                className={`font-mono text-xs tabular-nums ${images.length >= MAX_IMAGES ? "text-red-500" : "text-black/40"}`}
              >
                {images.length} / {MAX_IMAGES}
              </span>
            </div>

            {canAddMore && (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
                                    relative flex flex-col items-center justify-center gap-2
                                    border-2 border-dashed px-6 py-8 cursor-pointer
                                    transition-colors duration-150 select-none
                                    ${
                                      isDragging
                                        ? "border-black bg-black/5"
                                        : "border-black/20 hover:border-black/40 hover:bg-black/[0.02]"
                                    }
                                `}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`w-8 h-8 transition-colors ${isDragging ? "text-black" : "text-black/30"}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                  />
                </svg>

                <div className="text-center">
                  <p className="text-sm font-medium text-black/70">
                    Prevucite slike ovdje ili{" "}
                    <span className="underline underline-offset-2">
                      odaberite
                    </span>
                  </p>
                  <p className="text-xs text-black/40 mt-0.5">
                    PNG, JPG, WEBP · Maksimalno {MAX_IMAGES} slika
                  </p>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </div>
            )}

            {images.length > 0 && (
              <div className="grid grid-cols-5 gap-2 mt-1">
                {images.map((img, index) => (
                  <div key={img.id} className="relative group aspect-square">
                    <img
                      src={img.url}
                      alt={`Slika ${index + 1}`}
                      className="w-full h-full object-cover border border-black/10"
                    />

                    <div
                      className="
                                            absolute inset-0 bg-black/0 group-hover:bg-black/50
                                            transition-all duration-150
                                            flex items-center justify-center
                                        "
                    >
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        aria-label="Ukloni sliku"
                        className="
                                                    opacity-0 group-hover:opacity-100
                                                    transition-opacity duration-150
                                                    bg-white text-black
                                                    w-7 h-7 flex items-center justify-center
                                                    hover:bg-red-500 hover:text-white
                                                    transition-colors
                                                "
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>

                    <span
                      className="
                                            absolute top-1 left-1
                                            bg-black/60 text-white
                                            font-mono text-[10px] leading-none
                                            px-1.5 py-0.5
                                            group-hover:opacity-0 transition-opacity duration-150
                                        "
                    >
                      {index + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {!canAddMore && (
              <p className="text-xs text-red-500 font-mono mt-1">
                Dostignut maksimalni broj slika ({MAX_IMAGES}).
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`mt-4 bg-black text-white py-3 font-bold uppercase hover:bg-zinc-800 transition-colors ${loading && " bg-black/10 hover:bg-black/10 border-black"}`}
            disabled={loading}
          >
            Sačuvaj proizvod
          </button>
        </form>
      </div>
    </section>
  );
};

export default Page;
