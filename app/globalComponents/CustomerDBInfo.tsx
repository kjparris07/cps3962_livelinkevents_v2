export type CustomerDBInfo = {
    first_name: string;
    last_name: string;
    dob: Date;
    date_registered: Date;
    email: string;
    state: string;
    phone: string;
    plan: string;
    favegenre: string;
    faveartist: string;
    alerts: boolean;
    emails: boolean;
    private: boolean;
    events: any[];
};