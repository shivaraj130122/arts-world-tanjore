import { Link } from "react-router-dom";
import Button from "../components/ui/Button";

const NotFound = () => {
  return (
    <div className="container-app flex min-h-[70vh] flex-col items-center justify-center text-center">
      <p className="font-heading text-7xl font-bold text-secondary">404</p>
      <h1 className="mt-3 font-heading text-2xl font-bold text-primary">
        Page Not Found
      </h1>
      <p className="mt-2 max-w-md text-sm text-text/60">
        The page you&apos;re looking for doesn&apos;t exist or may have been
        moved.
      </p>
      <Link to="/" className="mt-6">
        <Button size="lg">Back to Home</Button>
      </Link>
    </div>
  );
};

export default NotFound;
