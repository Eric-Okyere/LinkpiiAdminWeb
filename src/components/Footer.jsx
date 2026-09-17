import { Link } from "react-router-dom";
import { FiMail, FiPhoneCall } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

const exploreLinks = [
  { href: "/", label: "Adverts" },
  { href: "/buy?tab=0", label: "Buy" },
  { href: "/tabs?tab=0", label: "KIA" },
  { href: "/rent?tab=0", label: "Rent" },
];

const companyLinks = [
  { href: "/about", label: "About Linkpii" },
  { href: "/callcenter", label: "Call Center" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms of Use" },
];

// A real footer — shown on every page (see App.jsx), below the fold on
// mobile and always visible once you scroll to the bottom on desktop.
const Footer = () => (
  <footer className="mt-16 bg-ink-950 text-brand-100">
    <div className="mx-auto max-w-[1600px] px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="font-display text-xl font-extrabold text-white">
            Link<span className="text-accent-400">pii</span>
          </span>
          <p className="mt-3 max-w-xs text-sm text-brand-200">
            Ghana&apos;s online marketplace to buy, sell, rent and advertise —
            products, shops, housing, equipment, services and agric produce,
            all in one place.
          </p>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-300">
            Explore
          </h3>
          <ul className="mt-3 space-y-2">
            {exploreLinks.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="text-sm text-brand-100 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-300">
            Company
          </h3>
          <ul className="mt-3 space-y-2">
            {companyLinks.map((item) => (
              <li key={item.href}>
                <Link to={item.href} className="text-sm text-brand-100 hover:text-white">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-brand-300">
            Get in touch
          </h3>
          <ul className="mt-3 space-y-2.5">
            <li>
              <a
                href="mailto:linkpiiapp@gmail.com"
                className="flex items-center gap-2 text-sm text-brand-100 hover:text-white"
              >
                <FiMail className="shrink-0 text-brand-300" />
                linkpiiapp@gmail.com
              </a>
            </li>
            <li>
              <a
                href="tel:+233209317581"
                className="flex items-center gap-2 text-sm text-brand-100 hover:text-white"
              >
                <FiPhoneCall className="shrink-0 text-brand-300" />
                +233 20 931 7581
              </a>
            </li>
            <li>
              <a
                href="https://wa.me/233209317581"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-brand-100 hover:text-white"
              >
                <FaWhatsapp className="shrink-0 text-brand-300" />
                Chat on WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-brand-300 sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Linkpii. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <Link to="/privacy-policy" className="hover:text-white">
            Privacy
          </Link>
          <Link to="/terms" className="hover:text-white">
            Terms
          </Link>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
