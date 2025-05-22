
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar as CalendarIcon, Filter, X } from "lucide-react";
import { Order, instruments } from "@/services/orderApi";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

// Define the schema for our filters
const filterSchema = z.object({
  id: z.string().optional(),
  instrument: z.string().optional(),
  side: z.enum(["Compra", "Venda", "all"]).optional(),
  status: z.enum(["Aberta", "Parcial", "Executada", "Cancelada", "all"]).optional(),
  date: z.date().optional(),
});

type FilterValues = z.infer<typeof filterSchema>;

interface OrderFiltersProps {
  onApplyFilters: (filters: Partial<Order>) => void;
}

export function OrderFilters({ onApplyFilters }: OrderFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const form = useForm<FilterValues>({
    resolver: zodResolver(filterSchema),
    defaultValues: {
      id: "",
      instrument: "",
      side: "all",
      status: "all",
      date: undefined,
    },
  });

  const handleSubmit = (values: FilterValues) => {
    // Build the filters object only with non-empty values
    const filters: Partial<Record<keyof Order, any>> = {};
    const newActiveFilters: string[] = [];

    if (values.id) {
      filters.id = values.id;
      newActiveFilters.push(`ID: ${values.id}`);
    }

    if (values.instrument) {
      filters.instrument = values.instrument;
      newActiveFilters.push(`Instrumento: ${values.instrument}`);
    }

    if (values.side && values.side !== "all") {
      filters.side = values.side as "Compra" | "Venda";
      newActiveFilters.push(`Lado: ${values.side}`);
    }

    if (values.status && values.status !== "all") {
      filters.status = values.status as Order["status"];
      newActiveFilters.push(`Status: ${values.status}`);
    }

    if (values.date) {
      // Convert date to ISO string for filtering
      const dateStr = format(values.date, "yyyy-MM-dd");
      filters.timestamp = dateStr;
      newActiveFilters.push(`Data: ${format(values.date, "dd/MM/yyyy")}`);
    }

    setActiveFilters(newActiveFilters);
    onApplyFilters(filters);
    setIsOpen(false);
  };

  const clearFilters = () => {
    form.reset();
    setActiveFilters([]);
    onApplyFilters({});
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 items-center">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filtros
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[320px] p-4" align="start">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(handleSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Ex: ORD-001" />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instrument"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instrumento</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione um instrumento" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="all">Todos</SelectItem>
                          {instruments.map((instrument) => (
                            <SelectItem key={instrument} value={instrument}>
                              {instrument}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="side"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Lado</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Lado" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="Compra">Compra</SelectItem>
                            <SelectItem value="Venda">Venda</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">Todos</SelectItem>
                            <SelectItem value="Aberta">Aberta</SelectItem>
                            <SelectItem value="Parcial">Parcial</SelectItem>
                            <SelectItem value="Executada">Executada</SelectItem>
                            <SelectItem value="Cancelada">Cancelada</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Data</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "dd/MM/yyyy")
                              ) : (
                                <span>Selecione uma data</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                            className="p-3 pointer-events-auto"
                          />
                        </PopoverContent>
                      </Popover>
                    </FormItem>
                  )}
                />

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={clearFilters}
                  >
                    Limpar
                  </Button>
                  <Button type="submit">Aplicar</Button>
                </div>
              </form>
            </Form>
          </PopoverContent>
        </Popover>

        {activeFilters.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center">
            {activeFilters.map((filter, index) => (
              <Badge key={index} variant="secondary" className="gap-1">
                {filter}
              </Badge>
            ))}
            <Button
              variant="ghost"
              size="sm"
              className="h-7 px-2"
              onClick={clearFilters}
            >
              <X className="h-4 w-4" />
              <span className="ml-1">Limpar filtros</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
