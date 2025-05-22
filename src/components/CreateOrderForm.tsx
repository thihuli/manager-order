
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { instruments } from "@/services/orderApi";
import { toast } from "sonner";

// Define the schema for order creation
const formSchema = z.object({
  instrument: z.string().min(1, "Instrumento é obrigatório"),
  side: z.enum(["Compra", "Venda"], {
    required_error: "Selecione se é uma ordem de compra ou venda",
  }),
  price: z.coerce
    .number()
    .positive("Preço deve ser maior que zero")
    .step(0.01, "Preço pode ter até 2 casas decimais"),
  quantity: z.coerce
    .number()
    .int("Quantidade deve ser um número inteiro")
    .positive("Quantidade deve ser maior que zero"),
});

type FormValues = z.infer<typeof formSchema>;

interface CreateOrderFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateOrder: (values: FormValues) => Promise<void>;
}

export function CreateOrderForm({ 
  open, 
  onOpenChange, 
  onCreateOrder 
}: CreateOrderFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      instrument: "",
      side: "Compra",
      price: 0,
      quantity: 0,
    },
  });

  async function handleSubmit(values: FormValues) {
    try {
      setIsSubmitting(true);
      await onCreateOrder(values);
      form.reset();
      onOpenChange(false);
      toast.success("Ordem criada com sucesso!");
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar ordem");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Ordem</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="instrument"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instrumento</FormLabel>
                  <Select
                    value={field.value || "default"}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um instrumento" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {field.value === "" && (
                        <SelectItem value="default" disabled>
                          Selecione um instrumento
                        </SelectItem>
                      )}
                      {instruments.map((instrument) => (
                        <SelectItem key={instrument} value={instrument}>
                          {instrument}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="side"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Ordem</FormLabel>
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={isSubmitting}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione compra ou venda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Compra">Compra</SelectItem>
                      <SelectItem value="Venda">Venda</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Preço</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Valor por unidade do ativo
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantidade</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="1"
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>
                    Número de unidades a negociar
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Criando..." : "Criar Ordem"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
