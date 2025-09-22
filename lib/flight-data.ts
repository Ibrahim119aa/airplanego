import type { FlightOffer } from "@/types/flight"

// Sample flight data based on the provided API structure
export const sampleFlightOffer: FlightOffer = {
  id: "off_0000AyOnl1dkOXUnf09tx4",
  total_amount: "248.24",
  total_currency: "EUR",
  base_amount: "210.37",
  base_currency: "EUR",
  tax_amount: "37.87",
  tax_currency: "EUR",
  total_emissions_kg: "441",
  created_at: "2025-09-20T13:39:27.920937Z",
  expires_at: "2025-09-20T14:09:27.920939Z",
  slices: [
    {
      id: "sli_0000AyOnl1dkOXUnf09tx3",
      origin: {
        id: "arp_lhr_gb",
        iata_code: "LHR",
        icao_code: "EGLL",
        name: "Heathrow Airport",
        city_name: "London",
        iata_city_code: "LON",
        iata_country_code: "GB",
        latitude: 51.470311,
        longitude: -0.458118,
        time_zone: "Europe/London",
        type: "airport",
        city: {
          id: "cit_lon_gb",
          name: "London",
          iata_code: "LON",
          iata_city_code: "LON",
          iata_country_code: "GB",
          type: "city",
        },
      },
      destination: {
        id: "arp_jfk_us",
        iata_code: "JFK",
        icao_code: "KJFK",
        name: "John F. Kennedy International Airport",
        city_name: "New York",
        iata_city_code: "NYC",
        iata_country_code: "US",
        latitude: 40.640556,
        longitude: -73.778519,
        time_zone: "America/New_York",
        type: "airport",
        city: {
          id: "cit_nyc_us",
          name: "New York",
          iata_code: "NYC",
          iata_city_code: "NYC",
          iata_country_code: "US",
          type: "city",
        },
      },
      departure_date: "2025-10-01T00:00:00",
      arrival_date: "2025-10-01T02:58:00",
      duration: "PT7H58M",
      fare_brand_name: "Basic",
      segments: [
        {
          id: "seg_0000AyOnl1dkOXUnf09tx2",
          origin: {
            id: "arp_lhr_gb",
            iata_code: "LHR",
            icao_code: "EGLL",
            name: "Heathrow Airport",
            city_name: "London",
            iata_city_code: "LON",
            iata_country_code: "GB",
            latitude: 51.470311,
            longitude: -0.458118,
            time_zone: "Europe/London",
            type: "airport",
            city: {
              id: "cit_lon_gb",
              name: "London",
              iata_code: "LON",
              iata_city_code: "LON",
              iata_country_code: "GB",
              type: "city",
            },
          },
          destination: {
            id: "arp_jfk_us",
            iata_code: "JFK",
            icao_code: "KJFK",
            name: "John F. Kennedy International Airport",
            city_name: "New York",
            iata_city_code: "NYC",
            iata_country_code: "US",
            latitude: 40.640556,
            longitude: -73.778519,
            time_zone: "America/New_York",
            type: "airport",
            city: {
              id: "cit_nyc_us",
              name: "New York",
              iata_code: "NYC",
              iata_city_code: "NYC",
              iata_country_code: "US",
              type: "city",
            },
          },
          departing_at: "2025-10-01T00:00:00",
          arriving_at: "2025-10-01T02:58:00",
          duration: "PT7H58M",
          distance: "5539.8359982030115",
          aircraft: null,
          operating_carrier: {
            id: "arl_00009VME7D6ivUu8dn35WK",
            iata_code: "ZZ",
            name: "Duffel Airways",
            logo_symbol_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/ZZ.svg",
            conditions_of_carriage_url: "https://duffelairways.com/dummy-url/conditions-of-carriage",
          },
          marketing_carrier: {
            id: "arl_00009VME7D6ivUu8dn35WK",
            iata_code: "ZZ",
            name: "Duffel Airways",
            logo_symbol_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/ZZ.svg",
            conditions_of_carriage_url: "https://duffelairways.com/dummy-url/conditions-of-carriage",
          },
          operating_carrier_flight_number: "4992",
          marketing_carrier_flight_number: "4992",
          origin_terminal: "2",
          destination_terminal: "1",
          stops: [],
          passengers: [
            {
              passenger_id: "pas_0000AyOnl1OrHtaOupC0kE",
              cabin_class: "economy",
              cabin_class_marketing_name: "Economy",
              fare_basis_code: "Y20LGTN2",
              cabin: {
                name: "economy",
                marketing_name: "Economy",
                amenities: {
                  wifi: {
                    available: true,
                    cost: "paid",
                  },
                  power: {
                    available: true,
                  },
                  seat: {
                    pitch: "30",
                    legroom: "n/a",
                    type: null,
                  },
                },
              },
              baggages: [
                {
                  type: "checked",
                  quantity: 1,
                },
                {
                  type: "carry_on",
                  quantity: 1,
                },
              ],
            },
          ],
        },
      ],
      conditions: {
        advance_seat_selection: null,
        priority_boarding: null,
        priority_check_in: null,
        change_before_departure: {
          allowed: false,
          penalty_amount: null,
          penalty_currency: null,
        },
      },
    },
  ],
  passengers: [
    {
      id: "pas_0000AyOnl1OrHtaOupC0kE",
      type: "adult",
      given_name: null,
      family_name: null,
      age: null,
      loyalty_programme_accounts: [],
    },
  ],
  conditions: {
    refund_before_departure: {
      allowed: true,
      penalty_amount: "40.00",
      penalty_currency: "GBP",
    },
    change_before_departure: {
      allowed: false,
      penalty_amount: null,
      penalty_currency: null,
    },
  },
  owner: {
    id: "arl_00009VME7D6ivUu8dn35WK",
    iata_code: "ZZ",
    name: "Duffel Airways",
    logo_symbol_url: "https://assets.duffel.com/img/airlines/for-light-background/full-color-logo/ZZ.svg",
    conditions_of_carriage_url: "https://duffelairways.com/dummy-url/conditions-of-carriage",
  },
  payment_requirements: {
    requires_instant_payment: false,
    price_guarantee_expires_at: "2025-09-22T13:39:27Z",
    payment_required_by: "2025-09-23T13:39:27Z",
  },
}

// Utility functions for working with flight data
export const formatDuration = (duration: string): string => {
  const match = duration.match(/PT(\d+H)?(\d+M)?/)
  if (!match) return duration

  const hours = match[1] ? Number.parseInt(match[1]) : 0
  const minutes = match[2] ? Number.parseInt(match[2]) : 0

  if (hours && minutes) {
    return `${hours}h ${minutes}m`
  } else if (hours) {
    return `${hours}h`
  } else if (minutes) {
    return `${minutes}m`
  }
  return duration
}

export const formatDateTime = (dateTime: string): { date: string; time: string } => {
  const date = new Date(dateTime)
  return {
    date: date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }),
  }
}

export const calculateTotalPrice = (baseAmount: string, taxAmount: string, currency = "EUR"): string => {
  const base = Number.parseFloat(baseAmount)
  const tax = Number.parseFloat(taxAmount)
  return (base + tax).toFixed(2)
}
