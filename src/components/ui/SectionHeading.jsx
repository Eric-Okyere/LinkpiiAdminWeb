import PropTypes from "prop-types";

const SectionHeading = ({ eyebrow, title, subtitle, action, className = "" }) => (
  <div className={`mb-4 flex items-end justify-between gap-4 ${className}`}>
    <div className="flex gap-3">
      <span className="mt-1.5 h-6 w-1 shrink-0 rounded-full bg-accent-500" aria-hidden="true" />
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-brand-600">
            {eyebrow}
          </p>
        )}
        <h2 className="font-display text-xl font-bold text-ink-900 sm:text-2xl">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 max-w-xl text-sm text-ink-500">{subtitle}</p>
        )}
      </div>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);

SectionHeading.propTypes = {
  eyebrow: PropTypes.string,
  title: PropTypes.node.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  className: PropTypes.string,
};

export default SectionHeading;
