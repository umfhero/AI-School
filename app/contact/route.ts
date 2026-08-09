function contactAddress() {
  return [117, 109, 99, 102, 97, 105, 122, 64, 103, 109, 97, 105, 108, 46, 99, 111, 109]
    .map((character) => String.fromCharCode(character))
    .join("");
}

export function GET() {
  const compose = new URL("https://mail.google.com/mail/");
  compose.searchParams.set("view", "cm");
  compose.searchParams.set("fs", "1");
  compose.searchParams.set("to", contactAddress());
  compose.searchParams.set("su", "AI school enquiry");
  return new Response(null, {
    status: 302,
    headers: {
      Location: compose.toString(),
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });
}
