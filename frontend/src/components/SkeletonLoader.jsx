function SkeletonLoader() {
  return (
    <div className="animate-pulse">

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="bg-gray-300 h-28 rounded-xl"
          />
        ))}

      </div>

      <div className="bg-gray-300 h-96 rounded-xl" />

    </div>
  );
}

export default SkeletonLoader;