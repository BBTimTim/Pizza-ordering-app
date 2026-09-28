
export default function About() {
  return (
    <div className="font font-Poppins bg-black min-h-screen rounded-lg">
      <div className="flex flex-col items-center relative pt-25 overflow-hidden">
        <h1 className="absolute text-6xl md:text-[14rem] font-bold text-white opacity-5 animate-pulse">
          Rólunk
        </h1>

        <div className="relative flex flex-col items-center mt-5 md:mt-25 group">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-100 to-red-700 mb-2 transition-all duration-500 group-hover:scale-105">
            One-More-Slice
          </h1>
          <div className="relative">
            <div className="w-20 md:w-32 h-1 rounded-full overflow-hidden">
              <div className="h-full bg-red-600 animate-progress-bar origin-left"></div>
            </div>
            <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-red-400 rounded-full animate-ping"></div>
          </div>
        </div>

        <p className="mt-6 text-gray-200 text-center max-w-md md:max-w-2xl px-4 text-sm md:text-base animate-fade-in">
          Mi a One-More-Slice csapata a lehető legautentikusabb és legfinomabb pizza
          elkészítését tűztük ki célul. A pizza iránti szenvedélyünk arra
          késztetett bennünket, hogy határokat nem ismerve egyenes
          Olaszországból hozzunk haza egy szelet örömöt minden pizzakedvelő
          számára.
        </p>
        <p className=" text-gray-200 text-center max-w-md md:max-w-2xl px-4 text-sm md:text-base animate-fade-in">
          A titok, pedig: A készítésben és az alapanyagok megfelelő
          kiválasztásában rejlik. Nápolyi Búbos kemencében sütve. Az eredmény,
          pedig egy olyan ínycsiklandó étlap, amelytől egyenesen a Duomo di San
          Gennaro melletti kis utcákban találjuk magunkat.
        </p>
      </div>
    </div>
  );
}
