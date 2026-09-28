const AdminDashboardPage = () => {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Overview of your Haksan Naturals store.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            —
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            —
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Pending Orders
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            —
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <p className="text-sm text-gray-500">
            Revenue
          </p>

          <p className="mt-2 text-3xl font-bold text-gray-900">
            —
          </p>
        </div>
      </div>
    </div>
  );
};

export { AdminDashboardPage };