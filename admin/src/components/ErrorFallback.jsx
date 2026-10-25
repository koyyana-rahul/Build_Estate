import { AlertCircle } from "lucide-react";
import Proptypes from "prop-types";

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f5f0]">
      <div className="text-center">
        <AlertCircle className="w-12 h-12 text-[#c2413b] mx-auto mb-4" />
        <h3 className="text-lg font-medium text-[#253247] mb-2">
          Something went wrong
        </h3>
        <p className="text-[#687386] mb-4">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="px-4 py-2 bg-[#142c4e] text-white rounded-lg hover:bg-[#0f2340] 
            transition-colors duration-200"
        >
          Try again
        </button>
      </div>
    </div>
  );
};

ErrorFallback.propTypes = {
    error: Proptypes.object.isRequired,
    resetErrorBoundary: Proptypes.func.isRequired
    };
    

export default ErrorFallback;