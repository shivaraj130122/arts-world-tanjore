const Collections = () => {
  return (
    <div className="container-app section-y">
      <h1 className="font-heading text-3xl font-bold text-primary">Collections</h1>
      <p className="mt-2 max-w-xl text-sm text-text/60">
        Curated collections of Tanjore paintings and gifts, grouped by theme
        and occasion. Content coming soon.
      </p>
      <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="aspect-video rounded-2xl border border-primary/10 bg-white shadow-sm"
          />
        ))}
      </div>
    </div>
  );
};

export default Collections;
