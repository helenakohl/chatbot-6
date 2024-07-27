import { assistantProfile } from "../assets/assitantProfile";

export const Welcome: React.FC = () => (
  <div className="flex flex-col items-start">
    <div className="flex items-center mb-2">
      <img
        src={assistantProfile.image}
        alt="Assistant"
        className="w-14 h-14 rounded-full mr-4"
      />
      <p className="text-center">{assistantProfile.name}</p>
    </div>
    <div className="bg-gray-100 border-gray-300 border-2 rounded-lg p-2 mr-20 w-full">
    <p>
    Welcome to BMW. My name is Sarah and I am your sales assistant. Please specify your requirements or inquiries regarding our vehicle models, features, or financing options. I am here to provide you with the necessary information and assistance. How may I assist you today?
    </p>
  </div>
  </div>
);