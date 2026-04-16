import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAccount } from "@/app/actions";

export default function EditForm({organizer}:{[key:string]:any}) {
  const router = useRouter();
  const { register, handleSubmit, formState: { dirtyFields } } = useForm({
    defaultValues: { ...organizer }
  });
  const [ loading, setLoading] = useState(false);

  const handleSave = async (data: any) => {
    if (organizer && organizer.email) {
      setLoading(true);
      const fd = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (!(key in dirtyFields)) return;

        if (value !== undefined && value !== null && value !== "") {
          fd.append(key, value.toString());
        }
      });

      if (!Object.keys(dirtyFields).length) {
        router.push("/account/organizer");
        return;
      }

      const outcome = await updateAccount("organizer", organizer.email, fd);
      setLoading(false);

      if (outcome.success) {
        router.push("/account/organizer");
      } else {
        console.error("Error occurred.", outcome.error);
      }
    }
  };

  return (
    <main className="signin-page">

      <form onSubmit={handleSubmit((d) => handleSave(d))} className="signin-container">
        <h1 className="signin-title">EDIT ACCOUNT</h1>
        <p className="required-note">
          Update your profile, contact details, preferences, and privacy settings
        </p>

        <div className="input-group">
          <label className="input-label" htmlFor="name">Full Name</label>
          <input {...register("name")} id="name" className="input-box" />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="company">Phone Number</label>
          <input {...register("company")} id="company" className="input-box" type="text" />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="role">
            Organizer Type
          </label>
          <select
            {...register("role")}
            id="role"
            className="input-box"
          >
            <option value="Artist / Organizer">Artist / Organizer</option>
            <option value="Event Company">Event Company</option>
            <option value="Venue Partner">Venue Partner</option>
            <option value="Promoter">Promoter</option>
            <option value="Management Team">Management Team</option>
          </select>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="phone">Phone Number</label>
          <input {...register("phone")} id="phone" className="input-box" type="number" min={1000000000} />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="genre">genre</label>
          <input {...register("genre")} id="genre" className="input-box" />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="website">Website</label>
          <input {...register("website")} id="website" className="input-box" />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="instagram">Instagram</label>
          <input {...register("instagram")} id="instagram" className="input-box" />
        </div>
        
        <button className="account-primary-btn">{loading ? "Loading..." : "Save Changes"}</button>
      </form>
    </main>
  );
}