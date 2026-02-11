const Loader = () => {
  return (
    <div className="animate-pulse space-y-6 max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-10">
        <div className="h-8 bg-gray-200 rounded w-48"></div>
        <div className="h-10 bg-gray-200 rounded w-32"></div>
      </div>
      
      {[1, 2, 3].map((item) => (
        <div key={item} className="bg-white border rounded-lg p-6 flex items-start gap-5">
          <div className="w-14 h-14 bg-gray-200 rounded-md flex-shrink-0"></div>
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-200 rounded w-1/3"></div>
            <div className="flex gap-4">
              <div className="h-3 bg-gray-100 rounded w-24"></div>
              <div className="h-3 bg-gray-100 rounded w-32"></div>
            </div>
            <div className="flex gap-3 pt-2">
              <div className="h-8 bg-gray-100 rounded w-20"></div>
              <div className="h-8 bg-gray-50 rounded w-20"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;