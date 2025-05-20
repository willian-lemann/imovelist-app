import { getListings } from "~/api/listings/get-listings";
import { Listings } from "~/components/listings";
import { Search } from "~/components/search";
import type { Route } from "./+types";
import type { Listing } from "~/api/types";

export function meta({}) {
  return [
    { title: "Encontre facilmente seu imóvel dos sonhos" },
    {
      name: "description",
      content:
        "Imovelist é um site imobiliário brasileiro que oferece uma ampla variedade de imóveis, incluindo casas, apartamentos e residências. Com mais de 300 listagens disponíveis, encontrar o imóvel perfeito nunca foi tão fácil. Navegue pelo site, filtre ou pesquise na barra de busca para encontrar exatamente o que você procura. Oferecemos uma experiência de usuário e interface de usuário elegantes e modernas para tornar a busca por imóveis uma experiência agradável. Não perca tempo com sites imobiliários desatualizados, escolha o Imovelist para encontrar seu novo lar hoje mesmo!",
    },
  ];
}

export async function loader({ request }: Route.LoaderArgs) {
  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const page = url.searchParams.get("page");
  const filter = url.searchParams.get("filter");
  const type = url.searchParams.get("type");
  const { data: listings, count } = await getListings({
    search: q ?? undefined,
    page: page ? parseInt(page) : 1,
    limit: 12,
    filter: filter ?? undefined,
    type: type ?? undefined,
  });

  return {
    data: listings,
    count,
  };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { data: listings, count } = loaderData;

  return (
    <div className="container px-0">
      <header className="bg-background border-b py-4">
        <div className="py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <svg
              className="w-6 h-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 2L2 12h3v8h6v-6h2v6h6v-8h3L12 2z"
              />
            </svg>
            <span className="font-bold text-lg">Imovelist</span>
          </a>

          <div className="flex items-center gap-4">
            {/* <LoginModal>
                <Button variant="outline">Login</Button>
              </LoginModal> */}

            {/* <a href="/announce" className="btn">
                Anunciar
              </a> */}

            {/* <Button variant="outline">Login</Button> */}

            {/* <a href="/login" className="btn">
                Sou corretor
              </a> */}
          </div>
        </div>
      </header>

      <div className="">
        <div className="py-4">
          <Search />
        </div>

        <div className="mt-0 data-[loading=true]:opacity-50 data-[loading=true]:pointer-events-none transition-all duration-200">
          <Listings listings={listings} count={count} />
        </div>
      </div>

      {/* <LoginModal>
        <SignIn mobile={mobile} />
      </LoginModal> */}
    </div>
  );
}
