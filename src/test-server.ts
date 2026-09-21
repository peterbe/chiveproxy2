const args = process.argv.slice(2);
const url = args.length ? args[0] : "http://localhost:3000";

async function main() {
  console.log("Starting test server with URL:", url);
  const response = await fetch(url);
  console.log("Response status:", response.status);
  const body = await response.text();
  console.log("Response body:", body);
  console.log("");

  const rewriter = new HTMLRewriter().on("link[rel][href]", {
    async element(el) {
      const href = el.getAttribute("href");
      if (!href) throw new Error("Missing href attribute");
      const hrefUrl = new URL(href, url).href;
      const r = await fetch(hrefUrl);
      if (r.status !== 200) {
        console.error(`Failed to fetch ${hrefUrl} status:`, r.status);
      } else {
        console.log("✅", hrefUrl);
      }
    },
  });

  await rewriter.transform(new Response(body)).text();
}
await main();
