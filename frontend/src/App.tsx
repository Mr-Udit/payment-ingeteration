import { useState } from "react"
import { createOrder, verifyPayment } from "./api"
import type { RazorpayResponse } from "./types"

const loadScript = (src: string) => {

  return new Promise<boolean>((resolve) => {

    const script = document.createElement("script")

    script.src = src

    script.onload = () => resolve(true)

    script.onerror = () => resolve(false)

    document.body.appendChild(script)

  })
}

function App() {
  const [Response, setResponse] = useState<RazorpayResponse | null>(null)
  const startPayment = async (amount:number) => {

    const loaded = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    )

    if (!loaded) {
      alert("Razorpay SDK failed")
      return
    }

    const order = await createOrder(amount)

    const options = {

      key: import.meta.env.VITE_RAZORPAY_KEY,

      amount: order.amount,

      currency: "INR",

      name: "Demo Store",

      description: "Test Payment",

      order_id: order.id,

      handler: async function (
        response: RazorpayResponse
      ) {

        const result = await verifyPayment(response)
        if (result.success) {
          setResponse(response)
          alert("Payment successful")
        } else {
          alert("Payment verification failed")
        }

      },

      prefill: {

        name: "Test User",

        email: "test@example.com"

      },

      theme: {

        color: "#3399cc"

      }

    }

    const paymentObject =
      new window.Razorpay(options)

    paymentObject.open()

  }

  return (

    <div style={{ padding: 40 }}>

      <h2>Razorpay Payment</h2>

      <button onClick={() => startPayment(1000)}>
        Pay 1000
      </button>
    <h1>
      {Response && (
        <div>
          <p>Payment ID: {Response.razorpay_payment_id}</p>
          <p>Order ID: {Response.razorpay_order_id}</p>
          <p>Signature: {Response.razorpay_signature}</p>
        </div>
      )}
    </h1>
    </div>

  )
}

export default App