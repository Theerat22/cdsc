interface Props {
  photos: string[];
}

export default function PhotoStrip({ photos }: Props) {
  return (
    <div className="bg-white p-4 shadow-2xl w-[300px] flex flex-col gap-3 border border-zinc-200">
      {[0, 1, 2].map((index) => (
        <div key={index} className="bg-zinc-100 aspect-[3/2] flex items-center justify-center overflow-hidden">
          {photos[index] ? (
            <img src={photos[index]} alt={`Capture ${index}`} className="w-full h-full object-cover scale-x-[-1]" />
          ) : (
            <span className="text-zinc-400 text-sm">กำลังรอภาพที่ {index + 1}...</span>
          )}
        </div>
      ))}
      <div className="mt-4 flex flex-col items-center">
        <p className="text-zinc-800 italic">งานชุมนุม 2569</p>
      </div>
    </div>
  );
}