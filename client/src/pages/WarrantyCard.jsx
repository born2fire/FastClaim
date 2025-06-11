import dayjs from "dayjs";

export default function WarrantyCard({ item, brand, purchaseDate, expiryDate }) {
  const today = dayjs();
  const expiry = dayjs(expiryDate);
  const daysLeft = expiry.diff(today, "day");

  let bgColor = "bg-green-100";
  if (daysLeft < 30 && daysLeft >= 0) bgColor = "bg-yellow-100";
  else if (daysLeft < 0) bgColor = "bg-red-100";

  return (
    <div className={`p-4 rounded shadow ${bgColor}`}>
      <h3 className="text-lg font-semibold">{item}</h3>
      <p className="text-sm text-gray-700">Brand: {brand}</p>
      <p className="text-sm">Purchase: {purchaseDate}</p>
      <p className="text-sm">Expiry: {expiryDate}</p>
      <p className="text-sm font-medium mt-2">
        Status: {daysLeft < 0 ? "Expired" : daysLeft < 30 ? "Expiring Soon" : "Active"}
      </p>
    </div>
  );
}
