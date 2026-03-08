import axios from "axios"

const API = "http://localhost:5000/api/payment"

export const createOrder = async (amount: number) => {

  const response = await axios.post(
    `${API}/create-order`,
    { amount }
  )

  return response.data
}

export const verifyPayment = async (data: any) => {

  const response = await axios.post(
    `${API}/verify`,
    data
  )

  return response.data
}