import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900/90 border border-white/10 p-3 rounded-lg shadow-xl backdrop-blur-md text-xs sm:text-sm z-50">
        <p className="text-gray-400 mb-1 font-mono">{label}</p>
        <p className="text-cyan-400 font-bold flex justify-between gap-3">
          <span>New Content:</span> 
          <span>{payload[0].value}</span>
        </p>
        <p className="text-purple-400 font-bold flex justify-between gap-3">
          <span>Reviews:</span> 
          <span>{payload[1].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

const ActivityChart = ({ data }) => {
  return (
    // FIX: Use a fixed height (h-72 = 18rem/288px) and min-w-0 to prevent flex collapse
    <div className="w-full h-72 min-h-[288px] mt-4 relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorContent" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorReviews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#6b7280" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            dy={10}
            interval="preserveStartEnd"
          />
          <YAxis 
            stroke="#6b7280" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{stroke: 'rgba(255,255,255,0.1)', strokeWidth: 2}} />
          <Area 
            type="monotone" 
            dataKey="content" 
            stroke="#06b6d4" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorContent)" 
            isAnimationActive={false} // Disable animation on mobile to prevent "width -1" glitches
          />
          <Area 
            type="monotone" 
            dataKey="reviews" 
            stroke="#a855f7" 
            strokeWidth={2}
            fillOpacity={1} 
            fill="url(#colorReviews)" 
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;