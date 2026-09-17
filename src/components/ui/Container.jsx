import PropTypes from "prop-types";

// Consistent max-width/gutter wrapper used across the redesigned screens so
// content lines up under the fixed navbar instead of every screen inventing
// its own padding. Wider than the old max-w-7xl (1280px) so listing grids
// actually use the space on a real desktop monitor instead of sitting in a
// narrow, mobile-width column with large empty margins on either side.
const Container = ({ children, className = "" }) => (
  <div className={`w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
    {children}
  </div>
);

Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

export default Container;
