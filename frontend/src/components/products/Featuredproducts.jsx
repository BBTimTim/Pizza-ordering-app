import config from "../../../config";
import { useGetFeaturedProductsQuery } from "../redux/products/productSlice";

const { img_url } = config;

export default function Featuredproducts() {
  const { data: products } = useGetFeaturedProductsQuery();
  return (
    <>
      <div className="px-2">
        <h2 className="px-3 py-3 mt-5 indent-2 bg-red-100 w-50 sm:w-55 rounded-full text-l xl:text-lg font-bold text-red-700 tracking-wide">
          Kiemelt ajánlataink
        </h2>

        <div className="flex mt-2 min-h-[150px]">
          <div className="w-full text-red-500 mx-auto">
            <div
              id="slider"
              className="flex overflow-x-scroll space-x-4 rounded-lg no-scrollbar select-none"
            >
              {products?.data?.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-col items-center text-center justify-around p-4 hover:bg-red-50 transision-all duration-300 flex-shrink-0 scroll-ml-6 md:w-[10vw] xl:w-[15vw] xl:h-[60vh]"
                >
                  <div className="relative w-[200px] h-[220px] sm:w-[300px] sm:h-[300px] object-cover hover:rotate-[60deg] transition-all duration-500">
                    {item.image && (
                      <img loading="lazy"
                        src={`${img_url}/products/${item?.image}`}
                        alt={item.name}
                        className="object-contain"
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 items-center justify-center w-[180px] sm:w-[250px] md:w-full">
                    <h1 className="text-sm sm:text-base xl:text-xl 2xl:text-2xl font-bold uppercase w-full text-center truncate">
                      {item.name}
                    </h1>

                    <p className="w-full p-1 sm:p-4 2xl:p-8 line-clamp-2 text-xs sm:text-sm xl:text-base break-words">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
