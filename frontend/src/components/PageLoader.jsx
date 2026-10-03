import Spinner from "./Spinner.jsx";

const PageLoader = ({ text = "Chargement..." }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-xl shadow-sm p-8">
        <Spinner size="lg" text={text} />
      </div>
    </div>
  );
};

export default PageLoader;