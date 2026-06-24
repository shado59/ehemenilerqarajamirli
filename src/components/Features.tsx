import Image from 'next/image'

export default function Features({ sections }: any) {
  return (
    <section aria-labelledby="content-sections" className="py-8">
      <div className="space-y-16">
        {sections.map((s: any, idx: number) => (
          <article 
            key={s.id} 
            id={s.id} 
            className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${
              idx % 2 === 1 ? 'md:grid-cols-2 md:[direction:rtl]' : ''
            }`}
          >
            <div className="group cursor-default">
              <div className="absolute -inset-4 bg-gradient-to-r from-amber-600/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100 hidden md:block"></div>
              <div className="relative w-full h-56 md:h-72 rounded-xl overflow-hidden img-placeholder shadow-xl shadow-amber-900/20 md:[direction:ltr]">
                <Image 
                  src={s.image} 
                  alt={s.title} 
                  width={800} 
                  height={520} 
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110" 
                />
              </div>
            </div>
            <div className="md:[direction:ltr]">
              <h2 className="text-3xl md:text-4xl font-bold text-amber-100 mb-4 leading-tight">
                {s.title}
              </h2>
              <p className="text-base md:text-lg text-amber-100/75 leading-relaxed font-light">
                {s.text}
              </p>
              <div className="mt-6 h-1 w-16 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full"></div>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
