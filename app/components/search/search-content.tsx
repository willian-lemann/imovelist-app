import { SearchIcon, SlidersHorizontal } from "lucide-react";

import { Input } from "app/components/ui/input";
import { Button } from "app/components/ui/button";
import { ListFilterIcon, XIcon } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "app/components/ui/dropdown-menu";
import { Label } from "app/components/ui/label";

import { useNavigate, useLocation, useSearchParams } from "react-router";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { RangeFilter } from "../range-filter";
import { Capitalize } from "~/lib/utils";

const types = [
  { label: "Apartamento", value: "apartamento" },
  { label: "Comercial", value: "comercial" },
  { label: "Residencial", value: "residencial" },
];

const filtersPropertyType = [
  { label: "Aluguel", value: "aluguel" },
  { label: "Venda", value: "venda" },
];

export function SearchContent() {
  const [searchParams] = useSearchParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(searchParams);

  const [search, setSearch] = useState(params.get("q") || "");

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const [filters, setFilters] = useState({
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    parking: "",
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
  });

  const hasFilters =
    params.has("filter") || params.has("type") || params.has("q");

  function handleSearch() {
    if (search) {
      params.set("q", search);
    } else {
      params.delete("q");
    }
    navigate(`${pathname}?${params.toString()}`);
  }

  function handleFilter(filter: string) {
    if (filter) {
      params.set("filter", filter);
    } else {
      params.delete("filter");
    }
    params.delete("page");
    navigate(`${pathname}?${params.toString()}`);
  }

  function handleType(type: string) {
    if (type) {
      params.set("type", type);
    } else {
      params.delete("type");
    }
    params.delete("page");
    navigate(`${pathname}?${params.toString()}`);
  }

  function clearFilters() {
    params.delete("q");
    params.delete("filter");
    params.delete("type");
    navigate(`${pathname}?${params.toString()}`);
    setSearch("");
  }

  function clearQueryFilter() {
    params.delete("q");
    navigate(`${pathname}?${params.toString()}`);
    setSearch("");
  }

  useEffect(() => {
    document.addEventListener("input", (e: any) => {
      if (!e.inputType) {
        clearQueryFilter();
      }
    });

    return () => {
      document.removeEventListener("input", (e: any) => {
        if (!e.inputType) {
          clearQueryFilter();
        }
      });
    };
  }, []);

  return (
    <>
      <div className="relative flex-1 max-w-lg flex">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Pesquise pelo nome, endereço ou código do imóvel"
          value={search}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full py-3 pl-12 pr-4 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
        />

        {/* mobile filters */}
        <div className="flex md:hidden gap-1 ml-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-1">
                <ListFilterIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {Capitalize(params.get("filter")) || "Filtrar por"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="">
              <DropdownMenuLabel>Filtrar por</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {filtersPropertyType.map((filter) => (
                <DropdownMenuCheckboxItem
                  checked={params.get("filter") === filter.value}
                  key={filter.value}
                  onClick={() => handleFilter(filter.value)}
                >
                  {filter.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="default" className="gap-1">
                <ListFilterIcon className="h-3.5 w-3.5" />
                <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                  {Capitalize(params.get("type")) || "Tipo de imóvel"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuLabel> Tipo de imóvel</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {types.map((type) => (
                <DropdownMenuCheckboxItem
                  key={type.value}
                  checked={params.get("type") === type.value}
                  onClick={() => handleType(type.value)}
                >
                  {type.label}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <Button
        type="button"
        onClick={handleSearch}
        className="px-6 py-3 rounded-r-lg"
      >
        <SearchIcon className="mr-2 w-5 h-5" />
        Procurar
      </Button>

      {/* desktop filters */}
      <div className="hidden md:flex gap-1">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default" className="gap-1">
              <ListFilterIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {Capitalize(params.get("filter") || "") || "Filtros avançados"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="px-4 max-w-md min-w-md">
            <DropdownMenuLabel className="px-0">Filtros</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <div className="space-y-2 pb-10">
              {/* Price Range */}
              <div className="px-0">
                <RangeFilter
                  title="Preço"
                  min={0}
                  max={5000000}
                  step={10000}
                  defaultValue={[100000, 2000000]}
                  formatValue={formatCurrency}
                  onChange={setPriceRange}
                />
              </div>

              <DropdownMenuSeparator />

              <div className="px-0">
                <RangeFilter
                  title="Area (m²)"
                  min={0}
                  max={5000000}
                  step={10000}
                  defaultValue={[100000, 2000000]}
                  formatValue={formatCurrency}
                  onChange={setPriceRange}
                />
              </div>

              <DropdownMenuSeparator />

              <div className="flex space-x-4">
                <div className="flex-1">
                  <DropdownMenuLabel className="px-0">
                    Quartos
                  </DropdownMenuLabel>
                  <Select
                    value={filters.bedrooms}
                    onValueChange={(value) =>
                      setFilters({ ...filters, bedrooms: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 quarto</SelectItem>
                      <SelectItem value="2">2 quartos</SelectItem>
                      <SelectItem value="3">3 quartos</SelectItem>
                      <SelectItem value="4">4 quartos</SelectItem>
                      <SelectItem value="5">5+ quartos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Bathrooms */}
                <div className="flex-1">
                  <DropdownMenuLabel className="px-0">
                    Banheiros
                  </DropdownMenuLabel>
                  <Select
                    value={filters.bathrooms}
                    onValueChange={(value) =>
                      setFilters({ ...filters, bathrooms: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 banheiro</SelectItem>
                      <SelectItem value="2">2 banheiros</SelectItem>
                      <SelectItem value="3">3 banheiros</SelectItem>
                      <SelectItem value="4">4+ banheiros</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Parking */}
                <div className="flex-1">
                  <DropdownMenuLabel className="px-0">
                    Garagem
                  </DropdownMenuLabel>
                  <Select
                    value={filters.parking}
                    onValueChange={(value) =>
                      setFilters({ ...filters, parking: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 vaga</SelectItem>
                      <SelectItem value="2">2 vagas</SelectItem>
                      <SelectItem value="3">3 vagas</SelectItem>
                      <SelectItem value="4">4+ vagas</SelectItem>
                    </SelectContent>
                  </Select>

                  {filtersPropertyType.map((filter) => (
                    <DropdownMenuCheckboxItem
                      checked={params.get("filter") === filter.value}
                      key={filter.value}
                      onClick={() => handleFilter(filter.value)}
                    >
                      {filter.label}
                    </DropdownMenuCheckboxItem>
                  ))}
                </div>
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="default" className="gap-1">
              <ListFilterIcon className="h-3.5 w-3.5" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                {Capitalize(params.get("type")) || "Tipo de imóvel"}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel> Tipo de imóvel</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {types.map((type) => (
              <DropdownMenuCheckboxItem
                key={type.value}
                checked={params.get("type") === type.value}
                onClick={() => handleType(type.value)}
              >
                {type.label}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {hasFilters ? (
        <Button
          onClick={clearFilters}
          variant="secondary"
          className="flex items-center gap-2 animate-fadeIn"
        >
          <Label className="cursor-pointer">Limpar filtros</Label>
          <XIcon className="h-4 w-4" />
        </Button>
      ) : null}
    </>
  );
}
