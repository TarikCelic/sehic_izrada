import React from "react";

const Page = () => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <section className="flex flex-col gap-8 p-4 sm:p-6">
      <div className="animate-fadeUp">
        <h1 className="text-2xl font-bold text-zinc-900">Sekcije</h1>
        <p className="text-sm text-amber-600 mt-0.5">Uredite prikaz sadrzaja na odredenim sekcijama.</p>
      </div>

      <div className="flex flex-col animate-fade-down">
        <div className={"w-full bg-black/5 p-4"}>
          <div className={"flex flex-col"}>
            <p
              className={
                "text-(--primary) font-mono tracking-widest text-[0.9rem]"
              }
            >
              SEKCIJA
            </p>
            <p className={"font-bold text-[1.35rem] "}>Istaknuti Proizvodi</p>

            <form
              action="POST"
              className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"}
            >
              <input
                type="text"
                name={"prva_sekcija"}
                placeholder={"ID 1. Proizvoda"}
                className={"border border-black/10 p-2"}
              />
              <input
                type="text"
                name={"druga_sekcija"}
                placeholder={"ID 2. Proizvoda"}
                className={"border border-black/10 p-2"}
              />
              <input
                type="text"
                name={"treca_sekcija"}
                placeholder={"ID 3. Proizvoda"}
                className={"border border-black/10 p-2"}
              />
              <input
                type="text"
                name={"cetvrta_sekcija"}
                placeholder={"ID 4. Proizvoda"}
                className={"border border-black/10 p-2"}
              />
              <input
                type="submit"
                value="Ažuriraj sekciju"
                className={"bg-(--primary) text-white cursor-pointer"}
              />
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
export default Page;
