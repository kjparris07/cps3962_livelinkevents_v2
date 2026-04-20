'use client'

import { useForm } from "react-hook-form";
import { createArtist } from "@/app/actions";

export function NewArtist({onSend}:any) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    console.log(data);
    const fd = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        fd.append(key, value.toString());
      }
    });
    const artist = await createArtist(fd);
    if (!artist.success) {
        console.error("Error creating new artist.", artist.error);
    } 
    onSend(artist);
  };

  return (
    <div>
        <h3>New Artist</h3>
          <div className="input-group">
            <label className="input-label" htmlFor="artist-name">Artist Name</label>
            <input
              id="artist-name"
              className={`input-box ${errors.name ? "input-error" : ""}`}
              type="text"
              placeholder="Artist Name"
              {...register("name", { required: true, maxLength: 75 })}
            />
            {errors.name && <span className="error-msg">Name is required (max 75 chars)</span>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="artist-genre">Genre</label>
            <input
              id="artist-genre"
              className={`input-box ${errors.genre ? "input-error" : ""}`}
              type="text"
              placeholder="e.g. Hip-Hop, Jazz, Electronic"
              {...register("genre", { required: true, maxLength: 75 })}
            />
            {errors.genre && <span className="error-msg">Genre is required</span>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="artist-image">Image URL</label>
            <input
              id="artist-image"
              className={`input-box ${errors.image ? "input-error" : ""}`}
              type="text"
              placeholder="https://..."
              {...register("image", { required: true })}
            />
            {errors.image && <span className="error-msg">Image URL is required</span>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="artist-bio">Bio <span className="optional">(optional)</span></label>
            <textarea
              id="artist-bio"
              className="input-box textarea"
              placeholder="Short bio (max 300 characters)"
              maxLength={300}
              {...register("bio")}
            />
          </div>

          <div className="modal-actions">
            <button type="submit" className="btn-primary" onClick={handleSubmit(onSubmit)} disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : "Save Artist"}
            </button>
          </div>
    </div>
  );
}