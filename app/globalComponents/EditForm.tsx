import { CustomerDBInfo } from "./CustomerDBInfo";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateAccount } from "@/app/actions";

export default function EditForm({customer}:{[key:string]:any}) {
  const router = useRouter();
  const { register, handleSubmit, watch, setValue, formState: { dirtyFields } } = useForm({
    defaultValues: { ...customer }
  });
  const [ loading, setLoading] = useState(false);

  const handleSave = async (data: any) => {
    if (customer && customer.email) {
      setLoading(true);
      const fd = new FormData();
      const booleanFields = ["emails", "alerts", "private", "events"];

      Object.entries(data).forEach(([key, value]) => {
        if (!(key in dirtyFields)) return;

        if (booleanFields.includes(key)) {
          fd.append(key, value ? "true" : "false");
        } else if (value !== undefined && value !== null && value !== "") {
          fd.append(key, value.toString());
        }
      });

      if (!Object.keys(dirtyFields).length) {
        router.push("/account/customer");
        return;
      }

      const outcome = await updateAccount(customer.email, fd);
      setLoading(false);

      if (outcome?.success) {
        router.push("/account/customer");
      } else {
        console.error("Error occurred.", outcome?.error);
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
          <label className="input-label" htmlFor="fName">First Name</label>
          <input {...register("fName")} id="fName" className="input-box" />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="lName">Last Name</label>
          <input {...register("lName")} id="lName" className="input-box" />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="phone">Phone Number</label>
          <input {...register("phone")} id="phone" className="input-box" type="number" min={1000000000} />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="faveGenre">Favorite Genre</label>
          <input {...register("faveGenre")} id="faveGenre" className="input-box" />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="faveArtist">Favorite Artist</label>
          <input {...register("faveArtist")} id="faveArtist" className="input-box" />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="homeState">Home State</label>
          <input {...register("homeState")} id="homeState" maxLength={2} className="input-box" />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="marketing">Receive Marketing Emails</label>
          <input 
          {...register("emails")} 
          id="emails" 
          className="input-box" 
          type="checkbox" 
          checked={!!watch("emails")} 
          onChange={(e) => setValue("emails", e.target.checked, { shouldDirty: true })}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="alerts">Receive Alerts</label>
          <input 
          {...register("alerts")} 
          id="alerts" 
          className="input-box" 
          type="checkbox" 
          checked={!!watch("alerts")} 
          onChange={(e) => setValue("alerts", e.target.checked, { shouldDirty: true })}
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="private">Private Account</label>
          <input 
          {...register("private")} 
          id="private" 
          className="input-box" 
          type="checkbox" 
          checked={!!watch("private")} 
          onChange={(e) => setValue("private", e.target.checked, { shouldDirty: true })}
          />
        </div>
        
        <button className="account-primary-btn">{loading ? "Loading..." : "Save Changes"}</button>
      </form>
    </main>
  );
}