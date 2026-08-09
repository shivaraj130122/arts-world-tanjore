import { classNames } from "../../utils/helpers";

// Consistent max-width + horizontal padding wrapper.
// Mirrors the .container-app utility in styles/index.css but as a component
// so home sections can compose it directly in JSX.
const Container = ({ children, className = "", as: Tag = "div" }) => {
  return (
    <Tag className={classNames("mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8", className)}>
      {children}
    </Tag>
  );
};

export default Container;
