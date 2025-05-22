
export const INSTRUMENTS = [
  "PETR4", "VALE3", "ITUB4", "BBDC4", "MGLU3", "ABEV3", "WEGE3", 
  "B3SA3", "RENT3", "BRKM5", "EMBR3", "BBAS3", "GGBR4", "LREN3"
];

export enum OrderStatus {
  OPEN = "Aberta",
  PARTIAL = "Parcial",
  EXECUTED = "Executada",
  CANCELLED = "Cancelada"
}

export enum OrderSide {
  BUY = "Compra",
  SELL = "Venda"
}

export const STATUS_CONFIG = {
  [OrderStatus.OPEN]: { color: "bg-blue-100 text-blue-800 hover:bg-blue-100", text: OrderStatus.OPEN },
  [OrderStatus.PARTIAL]: { color: "bg-amber-100 text-amber-800 hover:bg-amber-100", text: OrderStatus.PARTIAL },
  [OrderStatus.EXECUTED]: { color: "bg-green-100 text-green-800 hover:bg-green-100", text: OrderStatus.EXECUTED },
  [OrderStatus.CANCELLED]: { color: "bg-red-100 text-red-800 hover:bg-red-100", text: OrderStatus.CANCELLED }
};
