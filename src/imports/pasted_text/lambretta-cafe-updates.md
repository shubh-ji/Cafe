The current Lambreta Café website has several issues that need to be fixed. Please apply ALL of the following changes carefully:

---

🚨 PROBLEM 1 — THE WHOLE SITE FEELS LIKE AN ARCHITECTURE PORTFOLIO, NOT A CAFÉ
Fix: Shift the entire tone and copy to be warm, food-first, and inviting. Replace any language like "vernacular fusion", "design ethos", "material palette", "passive cooling", "Kota stone inspiration" from hero and main sections. These concepts belong ONLY in a small "Our Story" or "About" accordion — collapsed by default — not as hero content. The hero should feel like walking into a cozy café, not reading an architecture brief.

Hero headline should be something like:
"Raipur's most soulful café" or "Good food. Great vibes. Civil Lines."
Subheading: "Handcrafted drinks, honest food, and a space that feels like home."

---

🚨 PROBLEM 2 — HERO BACKGROUND IMAGE LOADS TOO SLOWLY (ruins first impression)
Fix this immediately with two changes:
1. Add a solid warm CSS background color (#C9906A or #E8D5B7) as an instant fallback that shows BEFORE the image loads — never show a blank/white screen
2. Remove any heavy parallax scroll effect on the hero background — replace with a simple CSS fade-in on load (opacity: 0 → 1 over 0.6s). Parallax is causing the lag. Use: background-attachment: scroll (NOT fixed) for performance.
3. Add loading="eager" and fetchpriority="high" to the hero image tag so the browser prioritizes it.

---

🚨 PROBLEM 3 — THE THREE MATERIAL CARDS (Mud & Lime, Kota Stone, Wicker)
Keep the 3D mouse-tilt animation on each card — that effect is great, keep it exactly as-is.
BUT make these changes:
1. Rename / re-theme the three cards to be café-centric, not architecture-centric:
   - Card 1: "Mud & Lime Walls" → rename to "Earthy Ambience" — tagline: "A space that breathes and calms"
   - Card 2: "Kota Stone Floors" → rename to "Rooted in Raipur" — tagline: "Crafted from the land beneath our feet"  
   - Card 3: "Wicker Furniture" → rename to "Handcrafted Comfort" — tagline: "Every chair tells a story"
2. Make the three cards auto-scroll horizontally in a smooth infinite marquee loop (CSS animation, no JS library). Speed: around 30s for one full loop. On hover over any card, pause the scroll. On mobile, disable tilt and keep the marquee.

---

🚨 PROBLEM 4 — DELETE THE SCROLLING IMAGE STRIP
Remove the horizontal auto-scrolling photo strip/marquee of café images that appears below the cards section. Delete it entirely. Images will be shown elsewhere.

---

🚨 PROBLEM 5 — DELETE "THREE TEXTURE ONE SOUL" SECTION
Remove this entire section completely. It reads like an architect's portfolio page. The card content and materials story is already handled by the three tilt cards above.

---

🚨 PROBLEM 6 — REMOVE / MINIMIZE THE PASSIVE COOLING DASHBOARD
The "Passive Cooling Dashboard" with temperature stats and graphs — remove it entirely from the landing page. The café's focus is FOOD and EXPERIENCE, not sustainability stats. If you want to keep a nod to eco-design, reduce it to ONE small line of text in the footer: "🌿 Naturally cooled using traditional mud & lime plaster." Nothing more.

---

🚨 PROBLEM 7 — REMOVE THE "LIVE VIBE" SECTION
Delete the Live Vibe / live ambience section entirely. It shows dynamic content (current crowd level, music, etc.) that no one can realistically update in real time. It looks broken and fake. Replace this space with the "Find Us" section described below.

---

🚨 PROBLEM 8 — ADD A "FIND US" SECTION (Last section before footer)
Add a clean, well-designed "Find Us" section as the second-to-last section on the page. It must include:
1. A Google Maps embed (iframe) showing: Civil Lines, Raipur, Chhattisgarh — use this embed URL:
   https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3719.2!2d81.6296!3d21.2514!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjHCsDE1JzA1LjAiTiA4McKwMzcnNDYuNiJF!5e0!3m2!1sen!2sin!4v1
2. Next to the map, show:
   - Address: Civil Lines, Raipur, Chhattisgarh — 492001
   - Hours: Mon – Sun, 9:00 AM – 10:00 PM
   - Phone: +91 XXXXXXXXXX (placeholder)
   - A "Get Directions" button that opens Google Maps in a new tab
3. The section heading: "Come find us" (not "Find Us" — keep it warm and human)
4. Style: warm terracotta border accent, clean sans-serif, earthy background (#F7F0E6)

---

🚨 PROBLEM 9 — FIX THE MENU PAGE (it looks "off" and too architecture-focused)
The menu page needs a complete tone and visual overhaul:
1. Remove any references to design materials, vernacular themes, or architecture language from the menu page
2. Add a warm food-focused header: "What's cooking today" with a short subline: "Fresh, honest, made with care"
3. Each menu category should have a small food emoji icon next to the category name (☕ Hot Beverages, 🧊 Cold Beverages, 🍟 Snacks & Bites, 🍽️ Signature Dishes)
4. Menu item cards should feel warmer — use a parchment/cream background (#FAF5ED) not white or dark
5. Add a subtle hover effect on each menu item: a soft terracotta left-border highlight (border-left: 3px solid #C9906A) on hover
6. The price should be styled in terracotta color (#C9906A), bold, right-aligned
7. If there are any architecture-style section dividers or material texture backgrounds on the menu page — remove them, replace with clean whitespace

---

🚨 PROBLEM 10 — GENERAL CLEANUP ACROSS WHOLE SITE
1. Any section that talks about "the design process", "the client brief", "the design team", "photography credits" — DELETE entirely. That's for an architecture showcase, not a café website.
2. The navbar: make sure it says "Lambreta Café" on the left with a simple coffee cup or leaf SVG icon — no architecture firm branding.
3. Footer: keep it simple — café name, address, hours, Instagram icon, and the one eco line mentioned above. Nothing else.
4. All scroll-triggered animations must respect prefers-reduced-motion.
5. Ensure the site is fully mobile responsive — the marquee cards should stack vertically on screens below 480px.

---

✅ KEEP AS-IS (do not change these):
- The 3D mouse-tilt effect on the three material cards — it's excellent
- The overall earthy color palette (terracotta, sand, sage, charcoal)
- The staggered text reveal animation on the hero headline
- The expandable accordion menu on the menu page
- The fixed navbar with smooth section switching

Apply all changes above. The result should feel like a warm, delicious, approachable café website — not an architecture portfolio.