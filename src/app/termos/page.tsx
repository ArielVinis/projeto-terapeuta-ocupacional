import Link from "next/link"
import { Header } from "@/src/components/boty/header"
import { Footer } from "@/src/components/boty/footer"
import { PATHS } from "@/src/constants/paths"

export default function TermosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <article className="max-w-3xl mx-auto px-6 pt-32 pb-24 prose prose-neutral">
        <h1 className="font-serif text-4xl mb-6">Termos de Uso</h1>
        <p className="text-muted-foreground mb-6">
          Última atualização: {new Date().toLocaleDateString("pt-BR")}
        </p>
        <div className="flex flex-col gap-4 text-foreground/90 leading-relaxed">
          <p>
            Estes Termos regulam o uso do site e a compra de e-books digitais
            oferecidos por Vitoria Vizzotto Moreira.
          </p>
          <h2 className="font-serif text-2xl mt-4">1. Conta</h2>
          <p>
            Para concluir uma compra é necessário criar uma conta (e-mail/senha
            ou Google). Você é responsável por manter as credenciais em
            segurança.
          </p>
          <h2 className="font-serif text-2xl mt-4">2. Produtos digitais</h2>
          <p>
            Vendemos apenas e-books. Após o pagamento confirmado, o acesso fica
            disponível em &quot;Meus e-books&quot;. Não há envio físico.
          </p>
          <h2 className="font-serif text-2xl mt-4">3. Pagamentos</h2>
          <p>
            Os pagamentos são processados pela Stripe (cartão e Pix). Não
            aceitamos boleto. Preços em reais (BRL).
          </p>
          <h2 className="font-serif text-2xl mt-4">4. Licença de uso</h2>
          <p>
            O e-book é licenciado para uso pessoal. É proibida a redistribuição,
            revenda ou compartilhamento público do arquivo.
          </p>
          <h2 className="font-serif text-2xl mt-4">5. Contato</h2>
          <p>
            Dúvidas:{" "}
            <a href="mailto:tovitoriamoreira@gmail.com" className="text-primary">
              tovitoriamoreira@gmail.com
            </a>
            .
          </p>
          <p>
            Veja também a{" "}
            <Link href={PATHS.privacidade} className="text-primary underline">
              Política de Privacidade
            </Link>
            .
          </p>
        </div>
      </article>
      <Footer />
    </main>
  )
}
