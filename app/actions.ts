'use server'
import { query } from '@/lib/db';
import { Ticket } from './globalComponents/Ticket';
import bcrypt from 'bcryptjs';

export async function hashPassword(password: string): Promise<string> {
    const saltRounds = 12; 
    
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
}

export async function logIn(formData: FormData) {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const accounts = await query(
            `SELECT password FROM users WHERE email=$1;`, 
            [email]
        );

        if (accounts.rows.length === 0) {
            return { success: false, error: "No account found." };
        }

        const isValid = await verifyPassword(password, accounts.rows[0].password);
        if (!isValid) {
            return { success: false, error: "Invalid credentials." };
        }

        const customerCheck = await query(
            `SELECT email FROM customers WHERE email=$1 LIMIT 1;`, 
            [email]
        );
        if (customerCheck.rows.length > 0) {
            return { success: true, account_type: "customer" };
        }

        const organizerCheck = await query(
            `SELECT email FROM organizers WHERE email=$1 LIMIT 1;`, 
            [email]
        );
        if (organizerCheck.rows.length > 0) {
            return { success: true, account_type: "organizer" };
        }

        return { success: false, error: "Account found, but role not assigned." };

    } catch (error) {
        console.error("Database Error:", error);
        return { success: false, error: "Internal server error." };
    }
}

export async function createAccount(formData: FormData) {
    const email = formData.get('email') as string;

    try {
        const accounts = await query(
            `SELECT email 
            FROM users 
            WHERE email=$1`, [`${email}`]);
        
        if (accounts.rows.length > 0) {
            return { success: false, error: "User already exists."};
        }

        try {
            const rawPassword = formData.get('password') as string;
            const accountType = formData.get('account_type') as string;

            const hashedPassword = await hashPassword(rawPassword);
            
            await query(
                `INSERT INTO users
                VALUES (default, $1, $2);`,
                [`${email}`, `${hashedPassword}`]
            );
            
            const id_result = await query(
                `SELECT id
                FROM users
                WHERE email=$1`,
                [`${email}`]
            );

            const user_id = parseInt(id_result.rows[0].id);

            if (accountType == "customer") {
                const fName = formData.get('fName') as string;
                const lName = formData.get('lName') as string;
                const dob = formData.get('dob') as string;
                const plan = formData.get('plan') as string;
                
                await query(
                    `INSERT 
                    INTO customers 
                    (email, first_name, last_name, dob, date_registered, id, plan)
                    VALUES ($1, $2, $3, $4, now(), $5, $6)
                    RETURNING plan`,
                    [`${email}`, `${fName}`, `${lName}`, `${dob}`, user_id, `basic`]
                );
                return {success: true, plan: plan};
            } else {
                const phone = formData.get('phone');
                const name = formData.get('name');
                const company = formData.get('company');

                await query(
                    `INSERT INTO organizers
                    VALUES ($1, $2, $3, $4, $5)`,
                    [`${email}`, `${phone}`, `${name}`, `${company}`, user_id]
                );
            }
            return {success: true};
        } catch (error) {
            return { success: false, error: "Error inserting user into database."};
        }
    } catch (error) {
        return { success: false, error: "Error checking database."};
    }
}

export async function updateAccount(account_type: "customer" | "organizer", email: string, formData: FormData) {
    
    try {
        let setClauses:string[] = [];
        let values = [];
        let i = 1;

        formData.forEach((value, key) => {
            setClauses.push(`${key} = $${i}`);
            values.push(value);
            i++;
        });
        const setQuery = setClauses.join(', ');
        values.push(email);

        let finalQuery = "";

        if (account_type === "customer") {
            finalQuery = `UPDATE customers SET ${setQuery} WHERE email = $${i} RETURNING *`;
        } else if (account_type === "organizer") {
            finalQuery = `UPDATE organizers SET ${setQuery} WHERE email = $${i} RETURNING *`;
        }

        const result = await query(finalQuery, values);

        if (result.rows.length > 0) {
            return { success: true };
        } else if (result.rows.length === 0){
            return { success: false, error: "Account not found. Update unsuccessful."}
        } else {
            return { success: false, error: "Unknown error. Update unsuccessful."}
        }
    } catch (error) {
        console.error("Error updating account: ", error);
        return { success: false, error: error };
    }
}

export async function setCustomer(info: any) {
    return {
        first_name: info.first_name,
        last_name: info.last_name,
        dob: new Date(JSON.stringify(info.dob).split('.')[0].substring(1)),
        date_registered: new Date(JSON.stringify(info.date_registered).split('.')[0].substring(1)),
        email: info.email,
        state: info.state,
        phone: info.phone,
        plan: info.plan == "elite" ? "Elite" : info.plan == "premium" ? "Premium" : "Basic",
        favegenre: info.favegenre,
        faveartist: info.faveartist,
        alerts: info.alerts,
        emails: info.emails,
        private: info.private,
        events: info.events
    };
}

export async function setOrganizer(info: any) {
    return {
        name: info.name,
        email: info.email,
        phone: info.phone,
        genre: info.genre,
        role: info.role,
        website: info.website,
        instagram: info.instagram,
        organization: info.organization,
        payout_method: info.payout_method,
        events: info.events
    };
}

export async function deleteAccount(email:string, account_type: "customer" | "organizer") {
    try {
        let result = null;
        if (account_type == "customer") {
            result = await query(
                `SELECT id
                FROM customers
                WHERE email=$1`, [`${email}`]
            );
        
        } else if (account_type == "organizer") {
            result = await query(
                `SELECT id
                FROM organizers
                WHERE email=$1`, [`${email}`]
            );
        } else {
            return { success: false, error: "Invalid account type." };
        }
        if (result) {
            if (result.rows.length === 0) {
                return { success: false, error: "User not found." };
            } else if (result.rows.length > 1) {
                return { success: false, error: "Multiple users found." };
            } else {
                try {
                    const id = result.rows[0].id;

                    if (account_type === "customer") {
                        await query(
                            `DELETE
                            FROM customers
                            WHERE id=$1`, [`${id}`]
                        );
                        await query(
                            `DELETE
                            FROM customer_events
                            WHERE customer_id=$1`, [`${id}`]
                        );
                    } else {
                        await query(
                            `DELETE
                            FROM organizer_events
                            WHERE organizer_id=$1`, [`${id}`]
                        );
                        await query(
                            `DELETE
                            FROM events
                            WHERE organizer_id=$1`, [`${id}`]
                        );
                        await query(
                            `DELETE
                            FROM venues
                            WHERE organizer_id=$1`, [`${id}`]
                        );
                        await query(
                            `DELETE
                            FROM organizers
                            WHERE id=$1`, [`${id}`]
                        );
                    }

                    await query(
                        `DELETE
                        FROM users
                        WHERE id=$1`, [`${id}`]
                    );

                    return { success: true };
                } catch (error) {
                    return { success: false, error: "Could not remove user from database." }
                }
            }
        } else {
            return { success: false, error: "Query unsuccessful." };
        }
        
    } catch (error) {
        console.error("Something went wrong...", error);
        return { success: false, error: error };
    }
}

export async function getAccountInfo(account_type:string, email: string) {
    if (account_type === "customer") {
        try {
            const result = await query(
                `SELECT *
                FROM customers
                WHERE email=$1`, [`${email}`]
            );

            if (result.rows.length == 0) {
                return { success: false, error: "Customer info not found."};
            }

            if (result.rows.length > 1) {
                return { success: false, error: "Multiple customers found."};
            }
            return { success: true, info: result.rows[0]};
        } catch (error) {
            console.error(error);
            return { success: false, error: "Error fetching customer info."};
        }
    } else if (account_type === "organizer") {
        try {
            const result = await query(
                `SELECT *
                FROM organizers
                WHERE email=$1`, [`${email}`]
            );
            if (result.rows.length == 0) {
                return { success: false, error: "Organizer info not found."};
            }

            if (result.rows.length > 1) {
                return { success: false, error: "Multiple organizers found."};
            }
            return { success: true, info: result.rows[0]};
        } catch (error) {
            return { success: false, error: "Error fetching organizer info."};
        }
    } else {
        return { success: false, error: "Invalid account type."};
    }
}

export async function getOrganizerId(email : string) {
    try {
        const id = (await query(
            `SELECT id
            FROM organizers
            WHERE email=$1`, [`${email}`]
        )).rows[0].id;
        return { success: true, id: id };
    } catch (error) {
        return {success: false, error: error};
    }
}

export async function purchaseTicket(email: string, event_id:string) {
    try {
        const customer = (await query(
            `SELECT id
            FROM customers
            WHERE email=$1`, [`${email}`]
        )).rows
        if (customer.length > 1) throw Error("More than one customer account found.")
        if (customer.length < 1) throw Error("No customer account found.")
        const customer_id = customer[0].id;
        
        await query(
            `INSERT INTO customer_events
            VALUES ($1, $2)`, [`${customer_id}`, `${event_id}`]
        );

        return {success: true};
    } catch (error) {
        return {success: false, error: error};
    }
}

export async function getArtists() {
    try {
        const artists = (await query(
            `SELECT *
            FROM artists`
        )).rows;
        return { success: true, artists: artists };
    } catch (error) {
        return {success: false, error: error};
    }
}

export async function getVenues(orgId:number) {
    try {
        const venues = (await query(
            `SELECT *
            FROM venues
            WHERE organizer_id=$1`, [`${orgId}`]
        )).rows;
        return { success: true, venues: venues };
    } catch (error) {
        console.error("Something went wrong", error)
        return {success: false, error: error};
    }
}

export async function createArtist(fd : FormData) {
    try {
        const name = fd.get("name");
        const genre = fd.get("genre");
        const image = fd.get("image");
        const bio = fd.get("bio");
        const artist = await query(
            `INSERT
            INTO artists
            VALUES (default, $1, $2, $3, $4)
            RETURNING *`, [ `${name}`, `${image}`, `${genre}`, `${bio}`]
        );
        return {success: true, artist: 
            {
                artist_id: artist.rows[0].artist_id,
                name: artist.rows[0].name,
                image: artist.rows[0].image,
                genre: artist.rows[0].genre,
                bio: artist.rows[0].bio,
            }
        };  
    } catch (error) {
        return { success: false, error: error };
    }
    
}

export async function createVenue(orgId:number, fd: FormData) {
    try {
        const name = fd.get("name");
        const street = fd.get("street");
        const city = fd.get("city");
        const state = fd.get("state");
        const zipcode = fd.get("zipcode");
        const capacity = fd.get("capacity");
        const map = fd.get("map");
        const venue = await query(
            `INSERT
            INTO venues
            VALUES (default, $1, $2, $3, $4, $5, $6, $7, $8)
            RETURNING *`,
            [ 
                `${name}`, `${street}`, `${city}`, `${state}`, 
                `${zipcode}`, `${orgId}`, `${capacity}`, `${map}` 
            ]
        );
        return { success: true, venue: 
            {
                venue_id: venue.rows[0].venue_id,
                name: venue.rows[0].name,
                street: venue.rows[0].street,
                city: venue.rows[0].city,
                state: venue.rows[0].state,
                zipcode: venue.rows[0].zipcode,
                organizer_id: venue.rows[0].organizer_id,
                capacity: venue.rows[0].capacity,
                map: venue.rows[0].map
            }
        };
    } catch (error) {
        return { success: false, error: error };
    }
}
   
export async function createEvent(orgId:number, fd : FormData) {
    try {
        const name = fd.get("name");
        const date = fd.get("date");
        const artist_id = fd.get("artist_id");
        const venue_id = fd.get("venue_id");
        const category = fd.get("category");
        const prices = JSON.parse(fd.get("prices") as string);
        
        const ticketArr = prices.map((t:Ticket) => {
            const tier = t.tier;
            const price = t.price.toFixed(2);
            const quantity = t.quantity;
            return `"(\\"(${tier},${price})\\", ${quantity})"`;
        });

        const event = await query(
            `INSERT
            INTO events
            VALUES (default, $1, $2, $3, $4, $5, $6, $7)
            RETURNING *`,
            [ 
                `${name}`, `${date}`, `${artist_id}`, `${venue_id}`,
                `${orgId}`, `${category}`, `{${ticketArr.join(", ")}}`
            ]
        );

        const event_id = event.rows[0].event_id

        await query(
            `INSERT
            INTO organizer_events
            VALUES ($1, $2)`, [`${orgId}`, `${event_id}`]
        );
        return { success: true, event_id: event_id };

    } catch (error) {
        return { success: false, error: error};
    }
}

export async function updateEvent(eventId:string, fd: FormData){
    let setClauses:string[] = [];
    let values:any = [];
    let i = 1;

    fd.forEach((value, key) => {
        setClauses.push(`${key} = $${i}`);
        if (key !== "prices"){
            values.push(value);
        } else {
            const prices = JSON.parse(fd.get("prices") as string);
            const ticketArr = prices.map((t:Ticket) => {
                const tier = t.tier;
                const price = t.price.toFixed(2);
                const quantity = t.quantity;
                return `"(\\"(${tier},${price})\\", ${quantity})"`;
            });
            values.push(`{${ticketArr.join(", ")}}`);
        }
        i++;
    });
    values.push(eventId);

    const setQuery = setClauses.join(', ');

    let finalQuery = `UPDATE events SET ${setQuery} WHERE event_id = $${i} RETURNING *`;

    let result = null;
    
    try {
        result = await query(finalQuery, values);
        return { success: true, event: result.rows[0] };
    } catch (error) {
        return { success: false, error: `${error}` };
    }
}

export async function deleteEvent(eventId:string){
    try {
        await query(
            `DELETE
            FROM organizer_events
            WHERE event_id=$1`, [`${eventId}`]
        );
        await query(
            `DELETE
            FROM events
            WHERE event_id=$1`, [`${eventId}`]
        );
        return {success: true};
    } catch (error) {
        return {success: false, error: error};
    }
}

export async function getCustomerEvents(email: string) {
    try {
        const customerId = (await query(
            `SELECT id
            FROM customers
            WHERE email=$1`, [`${email}`]
        )).rows[0].id;
        const result = await query(
            `SELECT 
                e.event_id AS event_id,
                e.name AS event_title,
                e.date AS event_date,
                e.category AS event_category,
                a.name AS artist_name,
                a.image AS artist_image,
                a.genre AS artist_genre,
                v.name AS venue_name,
                v.city AS venue_city,
                v.state AS venue_state,
                o.organization AS organized_by
            FROM events e
            JOIN artists a ON e.artist_id = a.artist_id
            JOIN venues v ON e.venue_id = v.venue_id
            JOIN organizers o ON e.organizer_id = o.id
            JOIN customer_events c ON e.event_id = c.event_id
            WHERE now() < e.date AND c.customer_id=$1
            ORDER BY e.date ASC;`, [`${customerId}`]
        );
        return { success: true, data: result.rows};
    } catch (error) {
        console.error('Database Error:', error);
        return { success: false, error: error};
    }
}

export async function getOrganizerEvents(email: string) {
    try {
        const organizerId = (await query(
            `SELECT id
            FROM organizers
            WHERE email=$1`, [`${email}`]
        )).rows[0].id;
        const result = await query(
            `SELECT 
                e.event_id AS event_id,
                e.name AS event_title,
                e.date AS event_date,
                e.category AS event_category,
                a.name AS artist_name,
                a.image AS artist_image,
                a.genre AS artist_genre,
                v.name AS venue_name,
                v.city AS venue_city,
                v.state AS venue_state,
                o.organization AS organized_by
            FROM events e
            JOIN artists a ON e.artist_id = a.artist_id
            JOIN venues v ON e.venue_id = v.venue_id
            JOIN organizers o ON e.organizer_id = o.id
            JOIN organizer_events g ON e.event_id = g.event_id
            WHERE now() < e.date AND g.organizer_id=$1
            ORDER BY e.date ASC;`, [`${organizerId}`]
        );
        return { success: true, data: result.rows};
    } catch (error) {
        console.error('Database Error:', error);
        return { success: false, error: error};
    }
}

export async function getEvent(event_id: string) {
    try {
        const result = await query(
            `SELECT
                e.event_id as event_id,
                e.name as event_title,
                a.name as artist_name,
                a.image as artist_image,
                e.date as event_date,
                v.city as venue_city,
                v.state as venue_state,
                e.prices as tickets
            FROM events e
            JOIN artists a on e.artist_id = a.artist_id
            JOIN venues v on e.venue_id = v.venue_id
            WHERE e.event_id=cast($1 as bigint)`, [`${event_id}`]
        );
        return { success: true, result: result.rows[0]}
    } catch (error) {
        return { success: false, error: error};
    }
}

export async function getFullEvent(event_id:string) {
    try {
        const result = await query(
            `SELECT *
            FROM events e
            WHERE e.event_id=cast($1 as bigint)`, [`${event_id}`]
        );
        return { success: true, result: result.rows[0]}
    } catch (error) {
        return { success: false, error: error};
    }
}

export async function getAllEvents() {
    try {
        const result = await query(
            `SELECT 
                e.event_id AS event_id,
                e.name AS event_title,
                e.date AS event_date,
                e.category AS event_category,
                a.name AS artist_name,
                a.image AS artist_image,
                a.genre AS artist_genre,
                v.name AS venue_name,
                v.city AS venue_city,
                v.state AS venue_state,
                o.organization AS organized_by,
                e.prices AS tickets
            FROM events e
            JOIN artists a ON e.artist_id = a.artist_id
            JOIN venues v ON e.venue_id = v.venue_id
            JOIN organizers o ON e.organizer_id = o.id
            WHERE now() < e.date
            ORDER BY e.date ASC;`
        );
        return result.rows;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export async function searchArtists(formData: FormData) {
  const searchTerm = formData.get('artist') as string;

  if (!searchTerm) return [];

  try {
    const result = await query(
        `SELECT 
            e.event_id AS event_id,
            e.name AS event_title,
            e.date AS event_date,
            e.category AS event_category,
            a.name AS artist_name,
            a.image AS artist_image,
            a.genre AS artist_genre,
            v.name AS venue_name,
            v.city AS venue_city,
            v.state AS venue_state,
            o.organization AS organized_by
        FROM events e
        JOIN artists a ON e.artist_id = a.artist_id
        JOIN venues v ON e.venue_id = v.venue_id
        JOIN organizers o ON e.organizer_id = o.id
        WHERE a.name ILIKE $1
        ORDER BY e.date ASC;`, 
        [`%${searchTerm}%`]
    );
    return result.rows;
  } catch (error) {
    console.error('Database Error:', error);
    return [];
  }
}

export async function searchStates(formData: FormData) {
    const searchTerm = formData.get('state') as string;

    if (!searchTerm) return [];
    if (searchTerm == "na") return [];
    try {
        const result = await query(
            `SELECT 
                e.event_id AS event_id,
                e.name AS event_title,
                e.date AS event_date,
                e.category AS event_category,
                a.name AS artist_name,
                a.image AS artist_image,
                a.genre AS artist_genre,
                v.name AS venue_name,
                v.city AS venue_city,
                v.state AS venue_state,
                o.organization AS organized_by
            FROM events e
            JOIN artists a ON e.artist_id = a.artist_id
            JOIN venues v ON e.venue_id = v.venue_id
            JOIN organizers o ON e.organizer_id = o.id
            WHERE v.state ILIKE $1
            ORDER BY e.date ASC;`, 
            [`%${searchTerm}%`]
        );
        return result.rows;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

export async function searchDates(formData: FormData) {
    const searchTerm = formData.get('date') as string;

    if (!searchTerm) return [];
    try {
        const result = await query(
            `SELECT 
                e.event_id AS event_id,
                e.name AS event_title,
                e.date AS event_date,
                e.category AS event_category,
                a.name AS artist_name,
                a.image AS artist_image,
                a.genre AS artist_genre,
                v.name AS venue_name,
                v.city AS venue_city,
                v.state AS venue_state,
                o.organization AS organized_by
            FROM events e
            JOIN artists a ON e.artist_id = a.artist_id
            JOIN venues v ON e.venue_id = v.venue_id
            JOIN organizers o ON e.organizer_id = o.id
            WHERE e.date=$1
            ORDER BY e.name ASC;`, 
            [`%${searchTerm}%`]
        );
        return result.rows;
    } catch (error) {
        console.error('Database Error:', error);
        return [];
    }
}

