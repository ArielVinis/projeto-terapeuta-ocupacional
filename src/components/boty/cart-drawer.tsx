"use client";

import { useTransition } from "react";
import { Trash2, ShoppingBag } from "lucide-react";
import Image from "next/image";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/src/components/ui/drawer";
import { Button } from "@/src/components/ui/button";
import { Spinner } from "@/src/components/ui/spinner";
import { startCheckoutAction } from "@/src/server/actions/ebooks";
import { useCart } from "./cart-context";

export function CartDrawer() {
  const {
    items,
    removeItem,
    isOpen,
    setIsOpen,
    itemCount,
    subtotal,
  } = useCart();
  const [pending, startTransition] = useTransition();

  const total = subtotal;

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen} swipeDirection="right">
      <DrawerContent>
        <DrawerHeader className="border-b border-border/50 p-6 py-2.5 text-left">
          <DrawerTitle className="font-serif text-2xl">Carrinho</DrawerTitle>
          <DrawerDescription>
            {itemCount} {itemCount === 1 ? "e-book" : "e-books"}
          </DrawerDescription>
        </DrawerHeader>

        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground">Seu carrinho esta vazio</p>
              <DrawerClose
                render={
                  <button
                    type="button"
                    className="mt-4 text-primary hover:underline text-sm"
                  />
                }
              >
                Continuar Comprando
              </DrawerClose>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="font-serif text-base text-foreground mb-1 font-semibold">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground mb-3 text-sm">
                      {item.description}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="p-1.5 text-muted-foreground hover:text-destructive vivi-transition"
                      aria-label="Remover item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      R$ {item.price}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <DrawerFooter className="border-t border-border/50 p-6 gap-4">
            <div className="flex justify-between text-base font-medium text-foreground pt-2">
              <span>Total</span>
              <span>R$ {total}</span>
            </div>

            <Button
              type="button"
              size="lg"
              disabled={pending}
              className="w-full rounded-full py-4 font-medium"
              onClick={() => {
                startTransition(async () => {
                  try {
                    const result = await startCheckoutAction(
                      items.map((item) => item.id),
                    )
                    if (!result.success) {
                      alert(result.error)
                      return
                    }
                    window.location.href = result.data.url
                  } catch {
                    alert("Não foi possível iniciar o checkout. Tente novamente.")
                  }
                })
              }}
            >
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {pending ? "A redirecionar..." : "Finalizar Compra"}
            </Button>

            <DrawerClose
              render={
                <button
                  type="button"
                  className="w-full border border-border text-foreground py-4 rounded-full font-medium hover:bg-muted vivi-transition"
                />
              }
            >
              Continuar Comprando
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
}
