export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl py-8">
      {/* Banner carousel placeholder */}
      <section className="mb-8">
        <div className="rounded-xl h-40 md:h-56 bg-gradient-to-tr from-indigo-200 via-white to-blue-200 flex items-center justify-center text-4xl font-black text-primary/60">
          Banner/Carousel Coming Soon
        </div>
      </section>
      {/* Stats placeholder */}
      <section className="mb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Will map stats cards here */}
          <div className="rounded-lg bg-white shadow-sm p-6 text-center">Stats Card</div>
          <div className="rounded-lg bg-white shadow-sm p-6 text-center">Stats Card</div>
          <div className="rounded-lg bg-white shadow-sm p-6 text-center">Stats Card</div>
          <div className="rounded-lg bg-white shadow-sm p-6 text-center">Stats Card</div>
        </div>
      </section>
      {/* Latest products placeholder */}
      <section className="mb-8">
        <h2 className="font-bold text-2xl mb-4">Latest Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Will map products here */}
          <div className="rounded-lg bg-white shadow p-4">Demo Product</div>
          <div className="rounded-lg bg-white shadow p-4">Demo Product</div>
          <div className="rounded-lg bg-white shadow p-4">Demo Product</div>
          <div className="rounded-lg bg-white shadow p-4">Demo Product</div>
        </div>
      </section>
    </div>
  );
}
