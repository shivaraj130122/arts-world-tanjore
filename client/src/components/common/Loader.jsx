const Loader = ({ label = "Loading..." }) => {
  return (
    <div className="flex min-h-[40vh] w-full flex-col items-center justify-center gap-3">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-secondary/30 border-t-primary" />
      <p className="text-sm text-text/70">{label}</p>
    </div>
  );
};

export default Loader;
