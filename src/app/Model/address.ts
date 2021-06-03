export class Address {
    _id: string;
    fullName: string;
    phone: number;
    passport: number;
    country: string;
    countryCode: string;
    state: string;  // district in old - state in new
    city: string; // state in old - district in new
    postal: number;
    addressName: string;
    type = 1; // Invoice type
    companyName: string;
    TaxNumber: number;
    TaxAddress: string;
    name: string; // Address type
}
