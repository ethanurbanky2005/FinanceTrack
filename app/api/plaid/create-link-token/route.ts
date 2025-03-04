import { NextResponse } from "next/server"
import { Configuration, PlaidApi, PlaidEnvironments } from "plaid"

const configuration = new Configuration({
  basePath: PlaidEnvironments[process.env.PLAID_ENV || "sandbox"],
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET,
    },
  },
})

const plaidClient = new PlaidApi(configuration)

export async function POST() {
  try {
    const tokenResponse = await plaidClient.linkTokenCreate({
      user: { client_user_id: "unique-user-id" }, // You should use the actual user ID here
      client_name: "FinanceTrack",
      products: ["transactions"],
      country_codes: ["US"],
      language: "en",
    })

    return NextResponse.json({ link_token: tokenResponse.data.link_token })
  } catch (error) {
    console.error("Error creating link token:", error)
    return NextResponse.json(
      { error: "Failed to create link token" },
      { status: 500 }
    )
  }
} 