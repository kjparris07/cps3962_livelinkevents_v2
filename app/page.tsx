'use client'

import { useState } from 'react';
import { useForm, SubmitHandler } from "react-hook-form";
import { searchArtists, searchStates, searchDates } from '@/app/actions';
import { Results } from './globalComponents/Results';

type ArtistFormData = {
  artist: string;
};

type StateFormData = {
  state: string
};

type DateFormData = {
  date: string;
};

export default function Home() {
  const { register, handleSubmit } = useForm<any>();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const onArtistSubmit: SubmitHandler<ArtistFormData> = async (data) => {
    setLoading(true);
    const fd = new FormData();
    fd.append("artist", data.artist);
    
    const events = await searchArtists(fd);
    setResults(events);
    setLoading(false);
  };

  const onStateSubmit: SubmitHandler<StateFormData> = async (data) => {
    setLoading(true);
    const fd = new FormData();
    fd.append("state", data.state);
    
    const events = await searchStates(fd);
    setResults(events);
    setLoading(false);
  };

  const onDateSubmit: SubmitHandler<DateFormData> = async (data) => {
    setLoading(true);
    const fd = new FormData();
    fd.append("date", data.date);
    
    const events = await searchDates(fd);
    setResults(events);
    setLoading(false);
  };

  return (
    <div className="homepage">
      <div className="page">
        <div className="hero-text">
          YOUR NEXT CONCERT EXPERIENCE <br /> STARTS HERE...
        </div>
        <div className="search-box">
          <div className="search-title">Search by:</div>

          <div className="search-fields">

            <form onSubmit={handleSubmit(onStateSubmit)}>
              <div className="field">
                <div className="field-label">Location</div>
                <select
                  {...register("state")}
                  className="field-input"
                  defaultValue="Select a state"
                >
                  <option value="na">Select a state</option>
                  <option value="AL">Alabama</option>
                  <option value="AK">Alaska</option>
                  <option value="AZ">Arizona</option>
                  <option value="AR">Arkansas</option>
                  <option value="CA">California</option>
                  <option value="CO">Colorado</option>
                  <option value="CT">Connecticut</option>
                  <option value="DE">Delaware</option>
                  <option value="DC">District of Columbia</option>
                  <option value="FL">Florida</option>
                  <option value="GA">Georgia</option>
                  <option value="HI">Hawaii</option>
                  <option value="ID">Idaho</option>
                  <option value="IL">Illinois</option>
                  <option value="IN">Indiana</option>
                  <option value="IA">Iowa</option>
                  <option value="KS">Kansas</option>
                  <option value="KY">Kentucky</option>
                  <option value="LA">Louisiana</option>
                  <option value="ME">Maine</option>
                  <option value="MD">Maryland</option>
                  <option value="MA">Massachusetts</option>
                  <option value="MI">Michigan</option>
                  <option value="MN">Minnesota</option>
                  <option value="MS">Mississippi</option>
                  <option value="MO">Missouri</option>
                  <option value="MT">Montana</option>
                  <option value="NE">Nebraska</option>
                  <option value="NV">Nevada</option>
                  <option value="NH">New Hampshire</option>
                  <option value="NJ">New Jersey</option>
                  <option value="NM">New Mexico</option>
                  <option value="NY">New York</option>
                  <option value="NC">North Carolina</option>
                  <option value="ND">North Dakota</option>
                  <option value="OH">Ohio</option>
                  <option value="OK">Oklahoma</option>
                  <option value="OR">Oregon</option>
                  <option value="PA">Pennsylvania</option>
                  <option value="RI">Rhode Island</option>
                  <option value="SC">South Carolina</option>
                  <option value="SD">South Dakota</option>
                  <option value="TN">Tennessee</option>
                  <option value="TX">Texas</option>
                  <option value="UT">Utah</option>
                  <option value="VT">Vermont</option>
                  <option value="VA">Virginia</option>
                  <option value="WA">Washington</option>
                  <option value="WV">West Virginia</option>
                  <option value="WI">Wisconsin</option>
                  <option value="WY">Wyoming</option>
                </select>
                <button type="submit" className="search button" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            <form onSubmit={handleSubmit(onDateSubmit)}>
              <div className="field">
                <div className="field-label">Date</div>
                <input 
                  {...register("date")} 
                  className="field-input"
                  type="date"
                  id="today"
                />
                <button type="submit" className="search button" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            <form onSubmit={handleSubmit(onArtistSubmit)}>
              <div className="field">
                <div className="field-label">Artist</div>
                <input 
                  {...register("artist")} 
                  className="field-input"
                  type="text"
                  placeholder="Search by artist name" 
                />
                <button type="submit" className="search button" disabled={loading}>
                  {loading ? 'Searching...' : 'Search'}
                </button>
              </div>
            </form>

            <div>
              <a href="/events">
                <button className="search button">
                  See All Events
                </button>
              </a>
            </div>

          </div>
        </div>

        <div id="results">
          <Results 
            results={results}
          />
        </div>

        <div className="cta">
          <a href="/membership">
            <button className="cta-btn">
              Become a member today and don’t miss on discounts!
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}