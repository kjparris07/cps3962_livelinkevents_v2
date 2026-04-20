'use client'
import { useForm } from "react-hook-form";
import { createVenue } from "@/app/actions";

export function NewVenue({onSend, orgId}:any) {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data: any) => {
    const fd = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        fd.append(key, value.toString());
      }
    });
    const venue = await createVenue(orgId, fd);
    if (!venue.success) {
        console.error("Error creating new venue.", venue.error);
        onSend(venue);
    } else {
        onSend(venue);
    }
  };

  return (
    <div>
          <h3>New Venue</h3>
          <div className="input-group">
            <label className="input-label" htmlFor="venue-name">Venue Name</label>
            <input
              id="venue-name"
              className={`input-box ${errors.name ? "input-error" : ""}`}
              type="text"
              placeholder="Venue Name"
              {...register("name", { required: true, maxLength: 125 })}
            />
            {errors.name && <span className="error-msg">Name is required</span>}
          </div>

          <div className="input-group">
            <label className="input-label" htmlFor="venue-street">Street Address</label>
            <input
              id="venue-street"
              className={`input-box ${errors.street ? "input-error" : ""}`}
              type="text"
              placeholder="123 Main St"
              {...register("street", { required: true, maxLength: 100 })}
            />
            {errors.street && <span className="error-msg">Street is required</span>}
          </div>

          <div className="input-row">
            <div className="input-group flex-2">
              <label className="input-label" htmlFor="venue-city">City</label>
              <input
                id="venue-city"
                className={`input-box ${errors.city ? "input-error" : ""}`}
                type="text"
                placeholder="City"
                {...register("city", { required: true, maxLength: 50 })}
              />
              {errors.city && <span className="error-msg">Required</span>}
            </div>
            <div className="input-group flex-1">
              <label className="input-label" htmlFor="venue-state">State</label>
              <input
                id="venue-state"
                className={`input-box ${errors.state ? "input-error" : ""}`}
                type="text"
                placeholder="NJ"
                maxLength={2}
                {...register("state", { required: true, maxLength: 2, minLength: 2 })}
              />
              {errors.state && <span className="error-msg">2 chars</span>}
            </div>
            <div className="input-group flex-1">
              <label className="input-label" htmlFor="venue-zipcode">ZIP</label>
              <input
                id="venue-zipcode"
                className={`input-box ${errors.zipcode ? "input-error" : ""}`}
                type="text"
                placeholder="07060"
                maxLength={5}
                {...register("zipcode", { required: true, maxLength: 5, minLength: 5 })}
              />
              {errors.zipcode && <span className="error-msg">5 digits</span>}
            </div>
          </div>

          <div className="input-row">
            <div className="input-group flex-1">
              <label className="input-label" htmlFor="venue-capacity">Capacity</label>
              <input
                id="venue-capacity"
                className={`input-box ${errors.capacity ? "input-error" : ""}`}
                type="number"
                placeholder="500"
                {...register("capacity", { required: true, min: 1, valueAsNumber: true })}
              />
              {errors.capacity && <span className="error-msg">Required</span>}
            </div>
            <div className="input-group flex-2">
              <label className="input-label" htmlFor="venue-map">Map URL <span className="optional">(optional)</span></label>
              <input
                id="venue-map"
                className="input-box"
                type="text"
                placeholder="https://..."
                {...register("map")}
              />
            </div>
          </div>
          <button type="submit" onClick={handleSubmit(onSubmit)} className="btn-primary" disabled={isSubmitting}>
            {isSubmitting ? "Saving…" : "Save Venue"}
          </button>
    </div>
  );
}