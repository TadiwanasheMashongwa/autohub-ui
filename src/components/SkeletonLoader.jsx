export const CardSkeleton = () => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse">
    <div className="flex justify-between mb-4">
      <div className="h-10 w-10 bg-white/10 rounded-lg"></div>
      <div className="h-4 w-16 bg-white/10 rounded"></div>
    </div>
    <div className="h-4 w-3/4 bg-white/10 rounded mb-2"></div>
    <div className="h-3 w-1/2 bg-white/10 rounded mb-4"></div>
    <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/5">
      <div className="h-6 w-16 bg-white/10 rounded"></div>
      <div className="h-8 w-24 bg-brand-accent/20 rounded-lg"></div>
    </div>
  </div>
);

export const TableRowSkeleton = () => (
  <tr className="animate-pulse border-b border-white/5">
    {[...Array(5)].map((_, i) => (
      <td key={i} className="p-4">
        <div className="h-4 bg-white/10 rounded w-full"></div>
      </td>
    ))}
  </tr>
);