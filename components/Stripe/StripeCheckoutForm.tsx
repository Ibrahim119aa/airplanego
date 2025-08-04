"use client"

import type React from "react"
import { Lock } from "lucide-react"
import { useState } from "react"
import { loadStripe, type StripeElementsOptions } from "@stripe/stripe-js"
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CreditCard, Loader2 } from "lucide-react"

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the Stripe object on every render.
// This is a placeholder for your actual Stripe publishable key.
// In a real application, you would load this from environment variables.
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_TYooMQauvdEDq5EWNkCqC5s3")

interface StripePaymentFormProps {
  amount: number
  currency: string
  onPaymentSuccess: () => void
  onPaymentError: (message: string) => void
}

const CheckoutForm = ({ amount, currency, onPaymentSuccess, onPaymentError }: StripePaymentFormProps) => {
  const stripe = useStripe()
  const elements = useElements()

  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      // Stripe.js has not yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return
    }

    setIsLoading(true)

    // In a real application, you would create a PaymentIntent on your server
    // and pass its client secret here. For this example, we'll simulate success/failure.
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        // Make sure to change this to your payment completion page
        return_url: `${window.location.origin}/payment-success`, // Placeholder
      },
      redirect: "if_required", // Prevent redirect for this example
    })

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setMessage(error.message || "An unexpected error occurred.")
        onPaymentError(error.message || "An unexpected error occurred.")
      } else {
        setMessage("An unexpected error occurred.")
        onPaymentError("An unexpected error occurred.")
      }
    } else {
      // Payment succeeded (or is pending/requires action)
      setMessage("Payment successful!")
      onPaymentSuccess()
    }

    setIsLoading(false)
  }

  return (
    <form id="payment-form" onSubmit={handleSubmit}>
      <PaymentElement id="payment-element" options={{ layout: "tabs" }} />
      <Button disabled={isLoading || !stripe || !elements} className="mt-6 w-full bg-primary hover:bg-primary/90">
        {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CreditCard className="mr-2 h-4 w-4" />}
        Pay ${amount.toFixed(2)} {currency.toUpperCase()}
      </Button>
      {/* Show any error or success messages */}
      {message && (
        <Alert className="mt-4" variant={message.includes("successful") ? "default" : "destructive"}>
          <AlertTitle>{message.includes("successful") ? "Success!" : "Error!"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </form>
  )
}

export default function StripePaymentForm({
  amount,
  currency,
  onPaymentSuccess,
  onPaymentError,
}: StripePaymentFormProps) {
  const options: StripeElementsOptions = {
    mode: "payment",
    amount: Math.round(amount * 100), // Amount in cents
    currency: currency.toLowerCase(),
    appearance: {
      theme: "stripe",
      variables: {
        colorPrimary: "#1479C9", // Use the primary color
      },
    },
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Secure Payment</CardTitle>
      </CardHeader>
      <CardContent>
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm
            amount={amount}
            currency={currency}
            onPaymentSuccess={onPaymentSuccess}
            onPaymentError={onPaymentError}
          />
        </Elements>
      </CardContent>
      <CardFooter className="text-xs text-gray-500">
        <Lock className="mr-1 h-3 w-3" />
        Your payment is securely processed by Stripe.
      </CardFooter>
    </Card>
  )
}
