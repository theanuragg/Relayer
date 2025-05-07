export default function Legend() {
    return (
      <div className="border rounded-lg shadow-lg bg-white p-4 mb-4">
        <h3 className="font-semibold mb-3">Legend</h3>
        
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-[#ff6384] mr-2"></div>
          <span>Main Wallet</span>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-[#36a2eb] mr-2"></div>
          <span>Transaction Partner</span>
        </div>
        
        <div className="flex items-center mb-2">
          <div className="flex items-center">
            <hr className="w-6 border-t-2 border-gray-400" />
            <div className="w-0 h-0 border-t-4 border-l-4 border-b-4 border-transparent border-l-gray-400"></div>
          </div>
          <span className="ml-2">Transaction (thickness = amount)</span>
        </div>
        
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full border-2 border-orange-500 mr-2"></div>
          <span>Selected Element</span>
        </div>
      </div>
    );
  }