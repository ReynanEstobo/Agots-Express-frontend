import { ArrowDown, ArrowUp } from "lucide-react";

export const StatsCard = ({
  title,
  value,
  change,
  changeType,
  icon: Icon,
  iconColor,
}) => {
  const ArrowIcon =
    changeType === "positive"
      ? ArrowUp
      : changeType === "negative"
      ? ArrowDown
      : null;

  const changeColor =
    changeType === "positive"
      ? "text-green-600"
      : changeType === "negative"
      ? "text-red-600"
      : "text-gray-600";

  const gradientMap = {
    "bg-yellow-400": "bg-gradient-to-br from-yellow-400 to-yellow-300",
    "bg-blue-400": "bg-gradient-to-br from-blue-400 to-blue-300",
    "bg-green-500": "bg-gradient-to-br from-green-500 to-green-400",
    "bg-orange-400": "bg-gradient-to-br from-orange-400 to-orange-300",
  };

  const gradientClass =
    gradientMap[iconColor] || "bg-gradient-to-br from-gray-400 to-gray-300";

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition p-5 relative flex items-start gap-4">
      <div
        className={`w-16 h-16 flex items-center justify-center rounded-lg ${gradientClass} absolute -top-6 left-5 shadow-lg`}
      >
        {Icon && <Icon size={28} className="text-white" />}
      </div>
      <div className="flex-1 pl-20">
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold mt-1">{value}</p>
        {change && (
          <div className="flex items-center gap-1 mt-2 text-sm">
            {ArrowIcon && <ArrowIcon size={14} className={`${changeColor}`} />}
            <span className={changeColor}>{change}</span>
          </div>
        )}
      </div>
    </div>
  );
};
