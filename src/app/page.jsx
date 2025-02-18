import Image from 'next/image';
import VerticalMenu from '@/app/components/VerticalMenu';
import HeroSection from '@/app/components/HeroSection';

export default function Home() {
  return (
    <main className="relative">
      <VerticalMenu />
      <HeroSection />
      <section className="py-12 md:py-20 px-4 bg-amber-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-amber-900 mb-8 md:mb-12 text-center">
            Nuestros Trabajos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="relative aspect-square overflow-hidden rounded-xl md:rounded-2xl shadow-lg"
              >
                <Image
                  src={`/images/casa${item}.jpg`}
                  alt={`Proyecto ${item}`}
                  width={500}
                  height={500}
                  className="w-full h-full object-cover transform hover:scale-105 transition-all duration-500"
                  unoptimized // Evita problemas con imágenes en /public
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center md:opacity-0 md:hover:opacity-100 transition-opacity">
                  <button className="text-white text-sm md:text-base px-4 py-2 border-2 border-white rounded-full">
                    Ver Detalles
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}