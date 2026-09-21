export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 405;
    return res.end(JSON.stringify({ error: "Method Not Allowed" }));
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }

  const {
    donorEmail,
    donorName = "Anonymous Donor",
    amount,
    currency = "USD",
    paymentMethod = "card",
    referenceId = `DON-${Date.now()}`,
  } = body || {};

  if (!donorEmail || !amount) {
    res.setHeader("Content-Type", "application/json");
    res.statusCode = 400;
    return res.end(
      JSON.stringify({ error: "Donor email and donation amount are required" })
    );
  }

  // Outbound email relay to inffo.ghulammustafa@gmail.com
  try {
    fetch("https://formsubmit.co/ajax/inffo.ghulammustafa@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        _subject: `New Donation Alert: $${amount} USD from ${donorEmail} - Islamic Path`,
        "Donor Email": donorEmail,
        "Donor Name": donorName,
        "Donation Amount": `$${amount} ${currency}`,
        "Payment Method Selected": paymentMethod.toUpperCase(),
        "Reference ID": referenceId,
        "Platform": "Islamic Path Web Portal",
        "Recipient Email": "inffo.ghulammustafa@gmail.com",
        "Date & Time": new Date().toLocaleString(),
      }),
    }).catch(() => {});
  } catch {
    // Non-blocking
  }

  res.setHeader("Content-Type", "application/json");
  res.statusCode = 200;
  return res.end(
    JSON.stringify({
      success: true,
      message:
        "Donation details processed and notification sent to inffo.ghulammustafa@gmail.com",
      referenceId,
      donorEmail,
      amount,
      paymentMethod,
    })
  );
}
