'use server'
import { query } from '@/lib/db';
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
    const email =  formData.get('email') as string;
    const password = formData.get('password') as string;

    try {
        const accounts = await query(
            `SELECT password
            FROM users
            WHERE email=$1;`, [`${email}`]
        );

        if (accounts.rows.length == 0) {
            return { success: false, error: "No account found." };
        }

        if (accounts.rows.length > 1) {
            return { success: false, error: "Multiple accounts found." };
        }
        
        const isValid = await verifyPassword(password, accounts.rows[0].password);
        if (isValid) {
            try {
                const customers = await query(
                    `SELECT email
                    FROM customers
                    WHERE email=$1`, [`${email}`]
                );

                if (customers.rows.length == 0) {
                    try {
                        const organizers = await query(
                            `SELECT email
                            FROM organizers
                            WHERE email=$1`, [`${email}`]
                        );
                        if (organizers.rows.length == 0) {
                            return { success: false, error: "Account found without type."};
                        }

                        if (organizers.rows.length > 1) {
                            return { success: false, error: "Multiple organizer accounts found."};
                        }
                        return { success: true, account_type: "organizer"};
                    } catch (error) {
                        return { success: false, error: "Account found, error checking account type."};
                    }
                }

                if (customers.rows.length > 1) {
                    return { success: false, error: "Multiple customer accounts found."};
                }
                return { success: true, account_type: "customer"};
            } catch (error) {
                return { success: false, error: "Account found, error checking account type."}
            }
        } else {
            return { success: false, error: "Invalid credentials." };
        }
    } catch (error) {
        console.error(error);
        return { success: false, error: "Error checking database." };
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
                
                await query(
                    `INSERT INTO customers
                    VALUES ($1, $2, $3, $4, now(), $5)`,
                    [`${email}`, `${fName}`, `${lName}`, `${dob}`, user_id]
                );
            } else {
                const phone = formData.get('phone') as string;
                const name = formData.get('name') as string;
                const company = formData.get('company') as string;

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

export async function deleteAccount(email:string) {
    console.log(`DELETE ACCOUNT ${email}`);
    console.log("Not implemented yet.");
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
            return { success: true, info: JSON.stringify(result.rows[0])};
        } catch (error) {
            return { success: false, error: "Error fetching organizer info."};
        }
    } else {
        return { success: false, error: "Invalid account type."};
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
                o.organization AS organized_by
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

