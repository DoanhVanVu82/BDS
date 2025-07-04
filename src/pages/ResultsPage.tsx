import LandDetails from "@/components/LandDetails";
import PriceAnalysis from "@/components/PriceAnalysis";
import { useLocation } from "react-router-dom";

const ResultsPage = () => {
  const location = useLocation();
  const formData = location.state?.formData;
  return (
    <div className="container mx-auto px-4 py-8">          
      <div className="grid lg:grid-cols-2 gap-8">
        <LandDetails land={formData} />
        <PriceAnalysis land={formData} />
      </div>
    </div>
  );
};

export default ResultsPage; 