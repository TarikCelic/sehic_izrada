import { prisma } from "@/lib/prisma";
import { Product } from "@prisma/client";
import React from "react";

const Page = async () => {
  const [
    products,
    topProduct,
    lastMonthCount,
    ukupnoProdano,
    zadnjaProdanaNarudzba,
    ukupnoProizvoda,
    top5ProdanihRaw,
    top5Posjeta,
  ] = await Promise.all([
    prisma.product.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.findFirst({
      orderBy: { visitors: "desc" },
      select: { name: true, visitors: true },
    }),
    prisma.narudzba.count({
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 1)),
        },
      },
    }),
    prisma.narudzba.count({
      where: { status: "ZAVRSENA" },
    }),
    prisma.narudzba.findFirst({
      where: { status: "ZAVRSENA" },
      orderBy: { createdAt: "desc" },
      select: { product: { select: { name: true } } },
    }),
    prisma.product.count(),
    prisma.narudzba.groupBy({
      by: ["productId"],
      where: { status: "ZAVRSENA" },
      _count: { id: true },
      orderBy: { _count: { id: "desc" } },
      take: 5,
    }),
    prisma.product.findMany({
      take: 5,
      orderBy: { visitors: "desc" },
      select: { name: true, visitors: true },
    }),
  ]);

  const top5ProductIds = top5ProdanihRaw.map((p) => p.productId);
  const top5ProductNames =
    top5ProductIds.length > 0
      ? await prisma.product.findMany({
          where: { id: { in: top5ProductIds } },
          select: { id: true, name: true },
        })
      : [];

  const top5Prodanih = top5ProdanihRaw.map((item) => ({
    name:
      top5ProductNames.find((p) => p.id === item.productId)?.name ?? "Nepoznat",
    count: item._count.id,
  }));

  const maxProdanih = top5Prodanih[0]?.count ?? 1;
  const maxPosjeta = top5Posjeta[0]?.visitors ?? 1;

  const dashboardStats = [
    {
      important: true,
      name: topProduct?.name ?? "Nema podataka",
      number: topProduct?.visitors ?? 0,
      tab: "Najposjećeniji proizvod",
    },
    {
      important: false,
      name: "Ukupno narudžbi",
      number: lastMonthCount,
      tab: "Zadnjih 30 dana",
    },
    {
      important: false,
      name: zadnjaProdanaNarudzba?.product?.name ?? "/",
      number: ukupnoProdano,
      tab: "Završene prodaje",
    },
    {
      important: false,
      name: "Broj proizvoda",
      number: ukupnoProizvoda,
      tab: "Ukupno u bazi",
    },
  ];

  return (
    <section className="flex flex-col gap-8 p-4 sm:p-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-zinc-900">Admin Dashboard</h1>
        <p className="text-sm text-amber-600 mt-0.5">
          Sve informacije na jednom mjestu.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-down">
        {dashboardStats.map((item, index) => (
          <div
            key={index}
            className={`flex flex-col gap-2 bg-black/5 px-4 py-6 rounded-sm ${
              item.important ? "border-l-4 border-(--primary)" : ""
            }`}
          >
            <div className="flex justify-between items-center">
              <p
                className="font-semibold text-gray-800 truncate pr-2"
                title={item.name}
              >
                {item.name}
              </p>
              <p className="text-(--primary) font-bold text-xl">
                {item.number}
              </p>
            </div>
            <p className="font-mono uppercase text-xs text-black/40 tracking-widest">
              {item.tab}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-col w-full h-full rounded-2xl overflow-hidden border border-gray-100 animate-fade">
        <div className="bg-black/5 text-gray-800 uppercase font-mono text-xs tracking-widest flex items-center w-full px-4 py-3 border-b border-black/10">
          <div className="w-20 shrink-0">ID</div>
          <div className="flex-1 min-w-[150px]">Ime Proizvoda</div>
          <div className="w-32 hidden md:block shrink-0">Kategorija</div>
          <div className="w-20 text-right shrink-0">Posjete</div>
        </div>
        {products.map((item: Product) => (
          <div
            key={item.id}
            className="flex items-center w-full px-4 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors text-sm"
          >
            <div className="w-20 shrink-0 text-gray-400">
              #{item.id.slice(-6)}
            </div>
            <div className="flex-1 font-medium text-gray-900">{item.name}</div>
            <div className="w-32 hidden md:block shrink-0 text-gray-500">
              {item.category}
            </div>
            <div className="w-20 text-right shrink-0 font-mono font-bold">
              {item.visitors}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-down">
        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">
              Top 5 Najprodavanijih
            </h3>
            <span className="text-xs text-gray-400">Po broju komada</span>
          </div>

          <div className="space-y-4">
            {top5Prodanih.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                Nema završenih narudžbi
              </p>
            ) : (
              top5Prodanih.map((item, i) => {
                const barColors = [
                  "bg-(--primary)",
                  "bg-black/80",
                  "bg-black/60",
                  "bg-black/40",
                  "bg-black/20",
                ];
                const pct = Math.round((item.count / maxProdanih) * 100);
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="truncate pr-2">{item.name}</span>
                      <span className="shrink-0">{item.count} prodano</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${barColors[i]} h-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-sm border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-gray-800 uppercase text-sm tracking-wider">
              Top 5 Najposjećenijih
            </h3>
            <span className="text-xs text-gray-400">Broj pregleda</span>
          </div>

          <div className="space-y-4">
            {top5Posjeta.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-4">
                Nema podataka o posjetama
              </p>
            ) : (
              top5Posjeta.map((item, i) => {
                const barColors = [
                  "bg-blue-500",
                  "bg-blue-400",
                  "bg-blue-300",
                  "bg-blue-200",
                  "bg-blue-100",
                ];
                const pct = Math.round(
                  ((item.visitors ?? 0) / maxPosjeta) * 100,
                );
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-xs font-medium">
                      <span className="truncate pr-2">{item.name}</span>
                      <span className="shrink-0">
                        {item.visitors ?? 0} klikova
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div
                        className={`${barColors[i]} h-full transition-all duration-500`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Page;
