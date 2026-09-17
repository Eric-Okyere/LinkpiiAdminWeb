import PropTypes from "prop-types";

const LoadMoreButton = ({ onClick, label = "Load more" }) => (
  <div className="mt-8 flex justify-center">
    <button
      type="button"
      onClick={onClick}
      className="rounded-xl border-2 border-brand-600 px-6 py-2.5 text-sm font-semibold text-brand-700 shadow-soft transition-colors hover:bg-brand-600 hover:text-white"
    >
      {label}
    </button>
  </div>
);

LoadMoreButton.propTypes = {
  onClick: PropTypes.func.isRequired,
  label: PropTypes.string,
};

export default LoadMoreButton;
