import Image from "next/image";

export default function Portfolio() {
  const portfolio = [
    {
      name: "ธีรัตม์ดลฉัตร ฉัตรชัย",
      program: "ศิิลป์-ภาษาจีน",
      cd: 56,
      faculty: "คณะเทคโนโลยีสารสนเทศและการสื่อสาร",
      university: "มหาวิทยาลัยมหิดล",
      link: "https://drive.google.com/file/d/1RJ-FjceRkhGbzuvut1M4zzZCm5rkB0HV/view?usp=sharing",
      image:
        "https://res.cloudinary.com/dbasoxt2o/image/upload/v1760971483/MU_ICT_PORTFOLIO_xkyfga.png",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-12 pb-20"> 
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

        <div className="mb-12 border-b border-gray-200 pb-4">

          <h1 className="text-4xl sm:text-5xl font-extrabold text-blue-600 mt-2">
            พอร์ตพี่มีให้ดู
          </h1>
        </div>

        <div className="container mx-auto p-4 lg:p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolio.map((item, index) => (
              <div
                key={index}
                className="flex flex-col bg-white border border-gray-200 rounded-xl overflow-hidden 
                   hover:border-blue-400 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
              >
                <div className="relative w-full h-44 sm:h-52 md:h-64">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="flex flex-col p-4 flex-grow">
                  <h4 className="text-base sm:text-lg font-extrabold text-blue-700 mb-2 truncate">
                    {item.name} <span className="text-gray-500">(CD{item.cd})</span>
                  </h4>

                  <div className="text-xs sm:text-sm text-gray-700 space-y-2">
                    <p className="border-l-4 border-yellow-500 pl-2">
                      <span className="font-medium text-gray-900">
                        สายการเรียน:
                      </span>{" "}
                      {item.program}
                    </p>

                    <p className="border-l-4 border-blue-400 pl-2">
                      <span className="font-medium text-gray-900">
                        คณะ/มหาลัย:
                      </span>{" "}
                      {item.faculty} {item.university}
                    </p>
                  </div>
                </div>

                <div className="p-4 border-t border-gray-100">
                  <a
                    href={item.link}
                    className="text-sm font-semibold text-blue-500 hover:text-blue-700"
                  >
                    ดูพอร์ต →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
