// Shared className builder for the react-tabs `Tab` elements across the
// Buy / Rent / KIA tab-view screens, so all three tab bars look and behave
// the same way instead of each screen inventing its own pill styling.
export const tabItemClass = (active) =>
  `flex-1 flex flex-col items-center justify-center gap-1 py-2.5 rounded-2xl text-center cursor-pointer transition-colors select-none ${
    active
      ? "bg-brand-600 text-white shadow-soft"
      : "text-ink-500 hover:text-brand-700 hover:bg-brand-50"
  }`;

export const tabListClass =
  "flex items-center gap-1.5 bg-white p-1.5 rounded-2xl shadow-soft border border-ink-100";
