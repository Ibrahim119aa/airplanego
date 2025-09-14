import { NextResponse } from "next/server";
import { Duffel } from "@duffel/api";

// Define slice type (Duffel doesn’t export it)
type OfferRequestSlice = {
  origin: string;        // IATA code (e.g. "LHR")
  destination: string;   // IATA code (e.g. "JFK")
  departure_date: string; // YYYY-MM-DD
};

const duffel = new Duffel({
  token: process.env.API_TOKEN as string,
});


export async function POST(req: Request) {
  try {
 const body = await req.json();
 console.log("this is body");
 console.log(body);
    const {
      fromLocationCode,
      toLocationCode,
      startDate,
      cabinClass,
      passengers
    } = body;

    // ✅ Basic validation
    if (!fromLocationCode || !toLocationCode || !startDate || !cabinClass ) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const slices: OfferRequestSlice[] = [
      {
        origin: fromLocationCode.toUpperCase(),
        destination: toLocationCode.toUpperCase(),
        departure_date: startDate.split("T")[0], // ensure YYYY-MM-DD
      },
    ];
    console.log("this is slice");
    console.log(slices);
    const offerRequest = await duffel.offerRequests.create({
      slices,
      passengers: [
        {
          type: "adult",
        },
      ],
      cabin_class:cabinClass, // can be dynamic if needed
    });



    const offers = await duffel.offers.list({
      offer_request_id: offerRequest.data.id,
    });

    return NextResponse.json(offers.data);
  } catch (error: any) {
    console.error("Duffel API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
