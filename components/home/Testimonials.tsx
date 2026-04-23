const TESTIMONIALS = [
  {
    name: "Amina K.",
    location: "Sarajevo",
    text: "Sto koji smo naručili premašio je sva očekivanja. Kvaliteta drveta i završna obrada su na najvišem nivou.",
    rating: 5,
  },
  {
    name: "Damir H.",
    location: "Mostar",
    text: "Kvaliteta koja se vidi i osjeti odmah čim raspakuješ. Naručili smo policu po mjeri i savršeno sjedi.",
    rating: 5,
  },
  {
    name: "Sara M.",
    location: "Banja Luka",
    text: "Dostava za 2 dana, montaža uključena. Ekipa profesionalna, namještaj još bolji uživo nego na slikama.",
    rating: 5,
  },
  {
    name: "Nermin B.",
    location: "Tuzla",
    text: "Radni sto od hrasta i metala — kupovina u životu. Već 3 godine stoji kao prvi dan.",
    rating: 5,
  },
  {
    name: "Lejla P.",
    location: "Zenica",
    text: "Konačno domaća firma koja stoji iza svog proizvoda. Preporučujem svima bez razmišljanja.",
    rating: 5,
  },
  {
    name: "Haris V.",
    location: "Sarajevo",
    text: "Naručili smo cijelu trpezariju. Gosti uvijek pitaju odakle namještaj — ponosan što je domaće.",
    rating: 5,
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-[2px]">
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[var(--primary)] text-sm">
          ★
        </span>
      ))}
    </div>
  );
}

function TestimonialCard({ t }: { t: (typeof TESTIMONIALS)[0] }) {
  return (
    <div className="flex-none w-[17rem] sm:w-72 md:w-80 bg-white border border-black/10 rounded-sm p-4 sm:p-6 mx-2">
      <Stars count={t.rating} />
      <p className="mt-3 text-black/70 text-sm leading-relaxed">
        &ldquo;{t.text}&rdquo;
      </p>
      <div className="mt-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[var(--primary)]/20 flex items-center justify-center flex-shrink-0">
          <span className="font-mono text-xs text-[var(--primary)] font-bold">
            {t.name[0]}
          </span>
        </div>
        <div>
          <p className="font-medium text-sm">{t.name}</p>
          <p className="font-mono text-xs text-black/40 tracking-wide">
            {t.location}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-12 md:py-20 overflow-hidden">
      <div className="text-center mb-8 md:mb-12 px-4">
        <p className="font-mono text-xs sm:text-sm tracking-widest text-[var(--primary)]">
          RECENZIJE
        </p>
        <h2 className="font-sekuya text-3xl sm:text-3xl md:text-4xl mt-1">
          Šta kažu kupci
        </h2>
      </div>

      <div className="flex group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
        <div
          className="flex animate-marquee group-hover:[animation-play-state:paused]"
          aria-hidden
        >
          {TESTIMONIALS.map((t, i) => (
            <TestimonialCard key={i} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
