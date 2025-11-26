import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const planName = searchParams.get("plan");
  const amount = searchParams.get("amount");
  const userEmail = searchParams.get("email");

  return (
    <div className="p-10 text-center">
      <h1 className="text-3xl font-bold text-green-600">Payment Successful!</h1>

      {planName && amount && (
        <p className="mt-4">
          Thank you <strong>{userEmail}</strong> for subscribing to <strong>{planName}</strong>!
          <br />
          Amount Paid: <strong>${amount}</strong>
        </p>
      )}

      <button
        onClick={() => navigate("/dashboard")}
        className="mt-6 bg-blue-600 text-white px-5 py-3 rounded-lg"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
