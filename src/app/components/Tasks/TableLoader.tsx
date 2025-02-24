"use client";
const TableLoader = () => {
  return (
    <div className="space-y-4">
      {[...Array(10)].map((_, index) => (
        <div key={index} className="flex space-x-4 animate-pulse">
          <div
            className="w-1/5 h-6 bg-gray-300 rounded"
            style={{
              background:
                "linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          ></div>
          <div
            className="w-1/3 h-6 bg-gray-300 rounded"
            style={{
              background:
                "linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          ></div>
          <div
            className="w-1/2 h-6 bg-gray-300 rounded"
            style={{
              background:
                "linear-gradient(to right, #f6f7f8 0%, #edeef1 20%, #f6f7f8 40%, #f6f7f8 100%)",
              backgroundSize: "200% 100%",
              animation: "shimmer 1.5s infinite",
            }}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default TableLoader;
