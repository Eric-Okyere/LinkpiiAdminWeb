import PropTypes from "prop-types";
import { FiSearch } from "react-icons/fi";

const EmptyState = ({ title = "Nothing here yet", subtitle, icon }) => (
  <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink-200 bg-white px-6 py-16 text-center">
    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-50 to-accent-50 text-brand-600">
      {icon || <FiSearch className="text-2xl" />}
    </div>
    <h3 className="font-display text-lg font-semibold text-ink-800">{title}</h3>
    {subtitle && <p className="mt-1 max-w-sm text-sm text-ink-500">{subtitle}</p>}
  </div>
);

EmptyState.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  icon: PropTypes.node,
};

export default EmptyState;
