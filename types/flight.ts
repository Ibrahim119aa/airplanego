// Flight booking system types based on API data structure
export interface FlightOffer {
  id: string
  total_amount: string
  total_currency: string
  base_amount: string
  base_currency: string
  tax_amount: string
  tax_currency: string
  total_emissions_kg: string
  created_at: string
  expires_at: string
  slices: FlightSlice[]
  passengers: FlightPassenger[]
  conditions: FlightConditions
  owner: Airline
  payment_requirements: PaymentRequirements
}

export interface FlightSlice {
  id: string
  origin: Airport
  destination: Airport
  departure_date: string
  arrival_date: string
  duration: string
  segments: FlightSegment[]
  fare_brand_name: string
  conditions: SliceConditions
}

export interface FlightSegment {
  id: string
  origin: Airport
  destination: Airport
  departing_at: string
  arriving_at: string
  duration: string
  distance: string
  aircraft: Aircraft | null
  operating_carrier: Airline
  marketing_carrier: Airline
  operating_carrier_flight_number: string
  marketing_carrier_flight_number: string
  origin_terminal?: string
  destination_terminal?: string
  stops: Stop[]
  passengers: SegmentPassenger[]
}

export interface Airport {
  id: string
  iata_code: string
  icao_code: string
  name: string
  city_name: string
  iata_city_code: string
  iata_country_code: string
  latitude: number
  longitude: number
  time_zone: string
  type: string
  city: City
}

export interface City {
  id: string
  name: string
  iata_code: string
  iata_city_code: string
  iata_country_code: string
  type: string
}

export interface Airline {
  id: string
  iata_code: string
  name: string
  logo_symbol_url: string
  logo_lockup_url?: string
  conditions_of_carriage_url: string
}

export interface Aircraft {
  id: string
  name: string
  iata_code: string
}

export interface Stop {
  id: string
  airport: Airport
  arriving_at: string
  departing_at: string
  duration: string
}

export interface FlightPassenger {
  id: string
  type: "adult" | "child" | "infant"
  given_name?: string
  family_name?: string
  age?: number
  loyalty_programme_accounts: any[]
}

export interface SegmentPassenger {
  passenger_id: string
  cabin_class: string
  cabin_class_marketing_name: string
  fare_basis_code: string
  cabin: Cabin
  baggages: Baggage[]
}

export interface Cabin {
  name: string
  marketing_name: string
  amenities: CabinAmenities
}

export interface CabinAmenities {
  wifi?: {
    available: boolean
    cost: string
  }
  power?: {
    available: boolean
  }
  seat?: {
    pitch: string
    legroom: string
    type?: string
  }
}

export interface Baggage {
  type: "carry_on" | "checked" | "personal_item"
  quantity: number
}

export interface FlightConditions {
  refund_before_departure?: {
    allowed: boolean
    penalty_amount?: string
    penalty_currency?: string
  }
  change_before_departure?: {
    allowed: boolean
    penalty_amount?: string
    penalty_currency?: string
  }
}

export interface SliceConditions {
  advance_seat_selection?: any
  priority_boarding?: any
  priority_check_in?: any
  change_before_departure?: {
    allowed: boolean
    penalty_amount?: string
    penalty_currency?: string
  }
}

export interface PaymentRequirements {
  requires_instant_payment: boolean
  price_guarantee_expires_at: string
  payment_required_by: string
}

// Booking form types
export interface BookingPassenger {
  id: string
  type: "adult" | "child" | "infant"
  givenNames: string
  surnames: string
  nationality: string
  gender: string
  dateOfBirth: {
    day: string
    month: string
    year: string
  }
  passportNumber: string
  passportExpiration: {
    day: string
    month: string
    year: string
  }
  noExpiration: boolean
  travelInsurance: "plus" | "basic" | "none"
}

export interface BaggageSelection {
  cabinBaggage: "personal-item" | "cabin-bag"
  checkedBaggage12kg: number
  checkedBaggage20kg: number
  noCheckedBaggage: boolean
}

export interface SeatSelection {
  flightId: string
  seatId: string | null
  autoAssigned: boolean
  price: number
}

export interface BookingData {
  flightOffer: FlightOffer
  passengers: BookingPassenger[]
  baggage: BaggageSelection
  seats: SeatSelection[]
  contactDetails: {
    email: string
    phone: string
    countryCode: string
    smsUpdates: boolean
  }
  billingDetails?: {
    type: "personal" | "company"
    givenNames?: string
    surnames?: string
    companyName?: string
    vatId?: string
    country: string
    streetAddress: string
    city: string
    postalCode: string
  }
}
