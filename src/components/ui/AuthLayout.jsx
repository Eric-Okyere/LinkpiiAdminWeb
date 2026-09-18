import PropTypes from "prop-types";
import Logo from "../../assets/screen.png";

// Shared split-screen shell for the auth screens (Login, Signup, Forgot
// Password): a brand panel on the left (hidden on small screens) and the
// actual form content on the right. Replaces each screen's own full-bleed
// dark background so the three flows read as one consistent experience.
const AuthLayout = ({ eyebrow, title, subtitle, children }) => (
  <div className="flex min-h-screen bg-ink-50">
    <div className="relative hidden w-[42%] flex-col justify-between overflow-hidden bg-ink-950 px-10 py-12 text-white lg:flex">
      <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-brand-600/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl" />

      <div className="relative flex items-center gap-3">
        <img
          src={Logo}
          width={44}
          height={44}
          className="h-11 w-11 rounded-xl object-cover ring-2 ring-white/20"
          alt="Linkpii logo"
        />
        <span className="font-display text-xl font-extrabold">
          Link<span className="text-accent-400">pii</span>
        </span>
      </div>

      <div className="relative">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-widest text-brand-300">
            {eyebrow}
          </p>
        )}
        <h2 className="mt-2 max-w-sm font-display text-3xl font-extrabold leading-tight">
          {title}
        </h2>
        {subtitle && <p className="mt-3 max-w-sm text-sm text-brand-100">{subtitle}</p>}
      </div>

      <p className="relative text-xs text-brand-300">
        &copy; {new Date().getFullYear()} Linkpii. Ghana&apos;s online marketplace.
      </p>
    </div>

    <div className="flex w-full flex-1 flex-col items-center justify-center px-4 py-12 sm:px-8">
      <div className="mb-8 flex items-center gap-2.5 lg:hidden">
        <img
          src={Logo}
          width={40}
          height={40}
          className="h-10 w-10 rounded-xl object-cover ring-2 ring-brand-100"
          alt="Linkpii logo"
        />
        <span className="font-display text-lg font-extrabold text-ink-900">
          Link<span className="text-brand-600">pii</span>
        </span>
      </div>

      <div className="w-full max-w-md">{children}</div>
    </div>
  </div>
);

AuthLayout.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.string,
  children: PropTypes.node,
};

export default AuthLayout;
